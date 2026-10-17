const topics = [...document.querySelectorAll(".topic")];
const filter = document.getElementById("topic-filter");
const questions = [...document.querySelectorAll(".qa")];
const learningKey = "agent-learning";
const updatedAtKey = `${learningKey}-updated-at`;
const recordsKey = `${learningKey}-records`;
const toRecords = (value) => Object.fromEntries(Object.entries(value)
  .filter(([, state]) => state === "learning" || state === "understood")
  .map(([key, state]) => [key, { state }]));
questions.forEach((qa, i) => {
  qa.querySelector("summary").setAttribute("data-en", window.LEARN_EN[i][0]);
  qa.querySelector(".answer").setAttribute("data-en", window.LEARN_EN[i][1]);
  qa.dataset.key = `${qa.closest(".topic").id}:${window.LEARN_EN[i][0]}`;
  const actions = document.createElement("div");
  actions.className = "learning-actions";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn secondary understood-toggle";
  button.addEventListener("click", () => {
    learning[qa.dataset.key] = learning[qa.dataset.key] === "understood"
      ? "learning"
      : "understood";
    saveLearning();
    updateLearning();
  });
  actions.append(button);
  qa.append(actions);
});
let learning = {};
let records = {};
// Per-question records ({state, at}) are what syncs; data saved before records existed is dated by its last update.
function loadRecords() {
  const saved = localStorage.getItem(recordsKey), legacy = localStorage.getItem(learningKey);
  try {
    if (saved) return ProgressRecords.clean(JSON.parse(saved));
    const value = JSON.parse(legacy || "{}");
    return ProgressRecords.stamp({}, toRecords(value && typeof value === "object" ? value : {}), Number(localStorage.getItem(updatedAtKey)) || 0);
  } catch {
    return {}; // Corrupt progress must not block saving a fresh state.
  }
}
function useRecords(value) {
  records = value;
  const live = ProgressRecords.live(records);
  learning = Object.fromEntries(
    questions
      .map((qa) => [qa.dataset.key, live[qa.dataset.key]?.state])
      .filter(([, state]) => state === "learning" || state === "understood"),
  );
}
try {
  useRecords(loadRecords());
} catch {
  document.getElementById("progress-storage").hidden = false;
}
function saveLearning() {
  try {
    const updatedAt = Date.now();
    // Keep records for questions not on this page (e.g. reworded ones) instead of marking them removed.
    const stored = loadRecords();
    const current = { ...ProgressRecords.live(stored), ...toRecords(learning) };
    for (const qa of questions) if (!learning[qa.dataset.key]) delete current[qa.dataset.key];
    records = ProgressRecords.stamp(stored, current, updatedAt);
    localStorage.setItem(recordsKey, JSON.stringify(records));
    localStorage.setItem(learningKey, JSON.stringify(learning));
    localStorage.setItem(updatedAtKey, String(updatedAt));
    window.markProgressDirty?.();
    document.getElementById("progress-storage").hidden = true;
  } catch {
    document.getElementById("progress-storage").hidden = false;
  }
}
function validLearning(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw Error("Invalid progress data");
  if (Object.values(value).some((state) => !["learning", "understood"].includes(state))) throw Error("Invalid progress data");
  const keys = new Set(questions.map((qa) => qa.dataset.key));
  return Object.fromEntries(Object.entries(value).filter(([key, state]) => keys.has(key) && ["learning", "understood"].includes(state)));
}
document.getElementById("progress-export").addEventListener("click", () => {
  const backup = { version: 2, app: "agent-knowledge", exportedAt: new Date().toISOString(), learning, records };
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
  link.download = "agent-knowledge-progress.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
});
document.getElementById("progress-import").addEventListener("change", async (event) => {
  const input = event.currentTarget;
  const status = document.getElementById("progress-backup-status");
  try {
    if (!input.files[0] || input.files[0].size > 1024 * 1024) throw Error("Invalid backup size");
    const backup = JSON.parse(await input.files[0].text());
    if (backup?.app !== "agent-knowledge" || ![1, 2].includes(backup.version)) throw Error("Wrong backup format");
    const restored = validLearning(backup.learning);
    const english = window.isEnglish?.();
    if (!confirm(english ? "Restore this backup and replace progress in this browser?" : "要用這份備份覆蓋此瀏覽器的學習進度嗎？")) return;
    learning = restored;
    saveLearning();
    updateLearning();
    status.textContent = english ? "Progress restored." : "已還原學習進度。";
  } catch {
    status.textContent = window.isEnglish?.() ? "This is not a valid Agent Knowledge backup." : "這不是有效的 Agent Knowledge 備份。";
  } finally {
    input.value = "";
  }
});
function updateLearning() {
  const english = window.isEnglish?.();
  let understood = 0;
  questions.forEach((qa) => {
    const state = learning[qa.dataset.key] || "new";
    const complete = state === "understood";
    if (complete) understood++;
    qa.dataset.state = state;
    const summary = qa.querySelector("summary");
    let status = summary.querySelector(".learning-status");
    if (!status) {
      status = document.createElement("span");
      status.className = "learning-status";
      summary.append(status);
    }
    const at = records[qa.dataset.key]?.at;
    status.textContent = (complete
      ? (english ? "✓ Understood" : "✓ 已理解")
      : state === "learning"
        ? (english ? "In progress" : "學習中")
        : (english ? "Not started" : "未學習"))
      + (state !== "new" && at ? ` · ${new Date(at).toLocaleString(english ? "en" : "zh-TW", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}` : "");
    const button = qa.querySelector(".understood-toggle");
    button.textContent = complete
      ? (english ? "✓ Understood" : "✓ 已理解")
      : (english ? "I understand" : "我已理解");
    button.setAttribute("aria-pressed", String(complete));
    button.title = english ? "Click to mark or undo understanding" : "點擊以標記或取消理解";
  });
  document.getElementById("understood").textContent = english
    ? `Understood ${understood} / ${questions.length} questions`
    : `已理解 ${understood} / ${questions.length} 題`;
  document.getElementById("learning-progress").max = questions.length;
  document.getElementById("learning-progress").value = understood;
}
function updateCount() {
  const shown = questions.filter((qa) => !qa.closest(".topic").hidden);
  const open = shown.filter((qa) => qa.open).length;
  document.getElementById("revealed").textContent = window.isEnglish?.()
    ? `${open} / ${shown.length} answers revealed`
    : `已展開 ${open} / ${shown.length} 題答案`;
}
function selectTopic() {
  const slug = location.hash.slice(1);
  filter.value = topics.some((topic) => topic.id === slug) ? slug : "all";
  topics.forEach((topic) => {
    topic.hidden = filter.value !== "all" && topic.id !== filter.value;
  });
  updateCount();
}
filter.addEventListener("change", () => {
  history.replaceState(
    null,
    "",
    filter.value === "all"
      ? location.pathname + location.search
      : `#${filter.value}`,
  );
  selectTopic();
});
window.addEventListener("hashchange", selectTopic);
questions.forEach((qa) => qa.addEventListener("toggle", () => {
  if (qa.open && !learning[qa.dataset.key]) {
    learning[qa.dataset.key] = "learning";
    saveLearning();
    updateLearning();
  }
  updateCount();
}));
// Cloud sync and other tabs hand over merged records here.
globalThis.agentProgress = {
  records: loadRecords,
  fromLegacy: (value, at) => ProgressRecords.stamp({}, toRecords(value), at),
  apply(value) {
    localStorage.setItem(recordsKey, JSON.stringify(value));
    useRecords(value);
    localStorage.setItem(learningKey, JSON.stringify(learning));
    updateLearning();
  },
};
window.addEventListener("storage", (event) => {
  if (event.key === recordsKey) { try { useRecords(loadRecords()); updateLearning(); } catch {} }
});
document.addEventListener("languagechange", updateCount);
document.addEventListener("languagechange", updateLearning);
selectTopic();
updateLearning();
if (window.translatePage) window.translatePage();
