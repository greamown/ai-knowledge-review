const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const vm = require("node:vm");
const ProgressRecords = require("../shared/progress-records.js");

const source = readFileSync(join(__dirname, "../shared/cloud-sync.js"), "utf8")
  .replace(/^import .*;\s*$/gm, "")
  .replace("export function", "function");
const DELETE = Symbol("delete");
const settle = () => new Promise((resolve) => setImmediate(resolve));

async function cloud({ local = {}, remote = {}, fail = false } = {}) {
  const ids = ["firebaseStatus", "firebaseLogin", "firebaseLogout", "firebaseSync", "cloudLocalTime", "cloudRemoteTime"];
  const elements = new Map(ids.map((id) => [id, { hidden: false, disabled: false, textContent: "" }]));
  const backup = { items: [{ english: "preserve lingua-forge" }], ...remote };
  const app = { records: local, applied: 0, cloudWrites: 0 };
  let signedIn;
  const context = vm.createContext({
    document: { documentElement: { lang: "zh-Hant" }, getElementById: (id) => elements.get(id), addEventListener() {} },
    MutationObserver: class { observe() {} },
    ProgressRecords, setTimeout, clearTimeout, Date,
    firebaseConfig: {}, initializeApp: () => ({}), getAuth: () => ({}), getFirestore: () => ({}),
    onAuthStateChanged: (_, callback) => { signedIn = callback; },
    GoogleAuthProvider: class {}, signInWithPopup: async () => {}, signOut: async () => {},
    doc: (_, ...path) => path, serverTimestamp: () => 123, deleteField: () => DELETE,
    runTransaction: async (_, run) => {
      if (fail) throw Error("offline");
      return run({
        get: async () => ({ exists: () => true, data: () => ({ ...backup }) }),
        set: (_, value, { mergeFields }) => { app.cloudWrites++; for (const f of mergeFields) value[f] === DELETE ? delete backup[f] : (backup[f] = value[f]); },
      });
    },
  });
  vm.runInContext(source, context);
  context.startCloudSync({
    field: "agentRecords", legacyField: "agentKnowledge", legacyTimeField: "agentKnowledgeUpdatedAt",
    progress: {
      records: () => app.records,
      fromLegacy: (value, at) => ProgressRecords.stamp({}, Object.fromEntries(Object.entries(value).map(([k, state]) => [k, { state }])), at),
      apply: (value) => { app.records = value; app.applied++; },
    },
  });
  signedIn({ uid: "test-user", email: "test@example.com" }); // signing in starts a sync
  await settle();
  return { app, backup, text: (id) => elements.get(id).textContent };
}

test("progress from two devices is merged per item, other apps' fields are kept", async () => {
  const c = await cloud({
    local: { "a:Q1": { state: "understood", at: 200 }, "a:Q3": { state: "learning", at: 250 } },
    remote: { agentRecords: { "a:Q2": { state: "understood", at: 100 }, "a:Q3": { state: "understood", at: 150 } } },
  });
  assert.deepEqual(Object.keys(c.backup.agentRecords).sort(), ["a:Q1", "a:Q2", "a:Q3"]);
  assert.equal(c.backup.agentRecords["a:Q3"].state, "learning", "newer change wins");
  assert.deepEqual(Object.keys(c.app.records).sort(), ["a:Q1", "a:Q2", "a:Q3"]);
  assert.equal(c.backup.items[0].english, "preserve lingua-forge");
  assert.match(c.text("firebaseStatus"), /已與雲端同步/);
  assert.notEqual(c.text("cloudLocalTime"), "尚未產生紀錄");
});

test("undoing progress is a newer change too", async () => {
  const c = await cloud({ local: { "a:Q1": { at: 300 } }, remote: { agentRecords: { "a:Q1": { state: "understood", at: 100 } } } });
  assert.deepEqual(c.backup.agentRecords["a:Q1"], { at: 300 });
});

test("old snapshot backups are folded in once and removed", async () => {
  const c = await cloud({ remote: { agentKnowledge: { "a:Q1": "understood" }, agentKnowledgeUpdatedAt: { toMillis: () => 50 } } });
  assert.deepEqual(c.app.records["a:Q1"], { state: "understood", at: 50 });
  assert.equal("agentKnowledge" in c.backup, false);
  assert.equal("agentKnowledgeUpdatedAt" in c.backup, false);
});

test("nothing is written when both sides already match", async () => {
  const c = await cloud({ local: { "a:Q1": { state: "understood", at: 100 } }, remote: { agentRecords: { "a:Q1": { at: 100, state: "understood" } } } });
  assert.equal(c.app.cloudWrites, 0);
  assert.equal(c.app.applied, 0);
});

test("a failed sync keeps local progress and says what happens next", async () => {
  const c = await cloud({ local: { "a:Q1": { state: "understood", at: 200 } }, fail: true });
  assert.equal(c.app.records["a:Q1"].state, "understood");
  assert.match(c.text("firebaseStatus"), /同步失敗：offline/);
});
