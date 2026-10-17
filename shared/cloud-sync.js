import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, doc, runTransaction, serverTimestamp, deleteField } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const messages = {
  zh: { none: "尚未產生紀錄", check: "登入後同步", account: "尚未登入 Google", signedOut: "尚未登入 Google；進度只存在此瀏覽器。", syncing: "同步中…", pending: "有尚未同步的進度…", synced: (t) => `已與雲端同步 · ${t}`, syncFailed: (e) => `同步失敗：${e}。進度仍保存在此瀏覽器，下次變更或回到此頁時會再試。`, loginFailed: (e) => `登入失敗：${e}`, unavailable: (e) => `雲端同步目前無法使用：${e}` },
  en: { none: "No record yet", check: "Sign in to sync", account: "Not signed in to Google", signedOut: "Not signed in to Google. Progress is stored only in this browser.", syncing: "Syncing…", pending: "Changes waiting to sync…", synced: (t) => `Synced with the cloud · ${t}`, syncFailed: (e) => `Sync failed: ${e}. Progress is still saved in this browser; it will retry on your next change or visit.`, loginFailed: (e) => `Sign-in failed: ${e}`, unavailable: (e) => `Cloud sync is currently unavailable: ${e}` },
};

// Each app keeps its records in its own field of users/{uid}/backups/latest, so apps sharing the document never overwrite each other.
// progress: { records(), apply(records), fromLegacy(snapshot, at) }. Apps report changes through globalThis.markProgressDirty().
// Older versions uploaded a whole snapshot to legacyField; it is merged in, dated by legacyTimeField, then removed.
// Page elements: #firebaseStatus, #firebaseLogin, #firebaseSync, #firebaseLogout; optional #cloudAccount, #cloudLocalTime, #cloudRemoteTime.
export function startCloudSync({ progress, field, legacyField, legacyTimeField }) {
  const timeField = field + "UpdatedAt";
  const $ = (id) => document.getElementById(id);
  const status = $("firebaseStatus"), login = $("firebaseLogin"), syncButton = $("firebaseSync"), logout = $("firebaseLogout");
  const account = $("cloudAccount"), localTime = $("cloudLocalTime"), syncedTime = $("cloudRemoteTime");
  let auth, db, currentUser = null, syncing = false, again = false, timer, lastSynced = 0, lastStatus = ["signedOut"];

  const lang = () => (document.documentElement.lang === "en" ? "en" : "zh");
  const copy = () => messages[lang()];
  const shortTime = (ms) => new Date(ms).toLocaleString(lang() === "en" ? "en" : "zh-TW", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const savedTime = (ms) => (ms ? shortTime(ms) : copy().none);
  function report(key, detail) {
    lastStatus = [key, detail];
    const value = copy()[key];
    status.textContent = typeof value === "function" ? value(detail) : value;
  }
  function render() {
    if (account) account.textContent = currentUser ? currentUser.email : copy().account;
    if (localTime) { try { localTime.textContent = savedTime(ProgressRecords.latest(progress.records())); } catch { localTime.textContent = copy().none; } }
    if (syncedTime) syncedTime.textContent = lastSynced ? savedTime(lastSynced) : copy().check;
    login.hidden = !!currentUser;
    logout.hidden = syncButton.hidden = !currentUser;
    report(...lastStatus);
  }
  function timestamp(value) {
    if (typeof value === "number") return value;
    if (value?.toMillis) return value.toMillis();
    if (value?.seconds) return value.seconds * 1000;
    return 0;
  }
  function cloudRecords(cloud) {
    const records = ProgressRecords.clean(cloud[field]);
    const legacy = cloud[legacyField];
    if (!legacy || typeof legacy !== "object" || Array.isArray(legacy)) return records;
    return ProgressRecords.merge(records, progress.fromLegacy(legacy, timestamp(cloud[legacyTimeField])));
  }
  // Pull, merge per item (newer change wins), push. Safe to run any time on any device.
  async function sync() {
    if (!currentUser) return;
    if (syncing) { again = true; return; }
    syncing = true;
    report("syncing");
    try {
      const ref = doc(db, "users", currentUser.uid, "backups", "latest");
      const merged = await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        const cloud = snap.exists() ? snap.data() : {};
        const merged = ProgressRecords.merge(progress.records(), cloudRecords(cloud));
        if (!ProgressRecords.equal(merged, ProgressRecords.clean(cloud[field])) || legacyField in cloud) {
          tx.set(ref, { [field]: merged, [timeField]: serverTimestamp(), [legacyField]: deleteField(), [legacyTimeField]: deleteField() },
            { mergeFields: [field, timeField, legacyField, legacyTimeField] });
        }
        return merged;
      });
      const local = progress.records();
      const next = ProgressRecords.merge(local, merged); // keeps changes made while the request was in flight
      if (!ProgressRecords.equal(next, local)) progress.apply(next);
      lastSynced = Date.now();
      lastStatus = ["synced", shortTime(lastSynced)];
    } catch (error) {
      lastStatus = ["syncFailed", error.message];
    } finally {
      syncing = false;
      render();
      if (again) { again = false; sync(); }
    }
  }

  globalThis.markProgressDirty = () => {
    if (currentUser) {
      lastStatus = ["pending"];
      clearTimeout(timer);
      timer = setTimeout(sync, 1500);
    }
    render();
  };
  // Leaving the tab pushes pending changes; returning pulls what other devices did.
  document.addEventListener("visibilitychange", () => { clearTimeout(timer); sync(); });
  // Every app switches language by setting <html lang>.
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  login.onclick = async () => { try { await signInWithPopup(auth, new GoogleAuthProvider()); } catch (error) { report("loginFailed", error.message); } };
  logout.onclick = async () => { try { await signOut(auth); } catch (error) { report("loginFailed", error.message); } };
  syncButton.onclick = sync;

  render();
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    onAuthStateChanged(auth, (user) => {
      currentUser = user;
      lastSynced = 0;
      lastStatus = ["signedOut"];
      render();
      if (user) sync();
    });
  } catch (error) {
    login.disabled = true;
    report("unavailable", error.message);
  }
}
