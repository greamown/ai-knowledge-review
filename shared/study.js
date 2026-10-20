"use strict";
const DATA = JSON.parse(document.getElementById("seed").textContent);
// Each topic page provides its content and settings in script#seed: {site:{key, app, copy, guides}, questions, quiz}.
const SITE = DATA.site;
const KEY = SITE.key;
const UPDATED_KEY = KEY + "-updated-at";
const RECORDS_KEY = KEY + "-records";
const $ = id => document.getElementById(id);
const COPY = {
  zh: {
    skip:"跳至學習內容",navigation:"主選單",learn:"知識筆記",quiz:"練習測驗",review:"錯題複習",
    startLearning:"開始學習",continueLearning:"繼續學習",testYourself:"測試我的理解",
    readCount:"已理解的知識筆記",accuracy:"累計測驗答對率",progressLabel:"學習進度",wrongCount:"值得再練一次的觀念",chapters:"學習章節",tipTitle:"先想一下，再看答案。",tip:"試著用自己的話解釋這個觀念。閱讀解析後，再按「已理解」記下進度，最後用測驗確認理解。",localNote:"進度保存在此瀏覽器；登入 Google 可跨裝置自動同步，也可在頁尾下載備份。",
    notes:"知識筆記",searchPlaceholder:"搜尋觀念、題號或關鍵字…",searchLabel:"搜尋題目",statusLabel:"閱讀狀態",allStatus:"全部狀態",unread:"尚未理解",read:"已理解",allTopics:"全部章節",questions:"題",of:"／",show:"展開筆記 +",hide:"收起筆記 −",references:"延伸閱讀",reflect:"能用自己的話說明了嗎？",mark:"標記已理解",marked:"✓ 已理解",practice:"練習這個觀念 →",previous:"← 上一頁",next:"下一頁 →",noResults:"沒有找到符合的筆記",searchHint:"試試其他關鍵字，或調整章節與閱讀狀態。",resetFilters:"重設篩選",guideLabel:"VISUAL FIELDNOTES / 圖解導讀",guideHint:"先建立全貌，再往下探索每個觀念。",
    quizTitle:"把理解，變成直覺。",quizScope:"測驗範圍",quizIntro:"每回合最多 10 題，選項隨機排列。作答後立即看解析；答錯的觀念會留在複習區，陪你再練一次。",startQuiz:"開始新測驗 →",allAreas:"全部領域",question:"第",correct:"答對了 ✓",incorrect:"再想一次，下次會更熟悉。",correctAnswer:"正確答案：",nextQuestion:"下一題 →",seeResults:"查看成績 →",results:"本回合完成",scoreNote:"答對率",again:"再練一回 →",reviewResults:"複習錯題 →",restartConfirm:"目前的測驗尚未完成，確定開始新回合？已作答的紀錄會保留。",reviewIntro:"錯題是一張學習地圖。重新回答這些題目，答對後就會自動移出。",clearWrong:"清除錯題紀錄",clearConfirm:"確定清除所有錯題紀錄？累計測驗成績與閱讀進度會保留。",retryWrong:"練習這些錯題 →",noWrong:"目前沒有待複習的錯題",noWrongHint:"做一回測驗，找出下一個值得練習的觀念。",progressTools:"備份與同步",allTopics:"全部主題",progressIntro:"下載備份可離線保存（含每筆紀錄的時間）；從檔案還原會覆蓋此瀏覽器的學習進度。登入 Google 後，進度會在你的各裝置間自動同步。",downloadBackup:"下載進度備份 ↓",restoreBackup:"從檔案還原",restoreConfirm:"還原會覆蓋此瀏覽器目前的學習進度。確定繼續？",restoreDone:"進度已還原，正在重新載入…",restoreFailed:"還原失敗：",cloudBackup:"私人雲端同步",localUpdated:"本機最後學習：",cloudUpdated:"上次同步：",googleLogin:"使用 Google 登入",syncNow:"立即同步",logout:"登出",cloudWarning:"每則筆記與每道題都記錄最後變更的時間；同步時逐項以較新的變更為準，不同裝置的進度會合併而不是互相覆蓋。",storageNote:"此瀏覽器無法儲存進度；本次仍可學習，但重新開啟後不會保留紀錄。"
  },
  en: {
    skip:"Skip to learning content",navigation:"Main navigation",learn:"Fieldnotes",quiz:"Practice",review:"Review",
    startLearning:"Start exploring",continueLearning:"Continue learning",testYourself:"Test my knowledge",
    readCount:"Notes marked understood",accuracy:"Overall quiz accuracy",progressLabel:"Learning progress",wrongCount:"Concepts to revisit",chapters:"The chapters",tipTitle:"Think first. Then unfold.",tip:"Try explaining the concept in your own words. Read the note, mark it understood when ready, and test your understanding with a quiz.",localNote:"Progress is saved in this browser. Sign in with Google to sync across devices, or download a backup below.",
    notes:"The fieldnotes",searchPlaceholder:"Search concepts, question numbers, keywords…",searchLabel:"Search questions",statusLabel:"Reading status",allStatus:"All notes",unread:"To explore",read:"Understood",allTopics:"All chapters",questions:"notes",of:"of",show:"Unfold note +",hide:"Fold note −",references:"Read more",reflect:"Can you explain it in your own words?",mark:"Mark understood",marked:"✓ Understood",practice:"Practice this concept →",previous:"← Previous",next:"Next →",noResults:"No matching fieldnotes",searchHint:"Try another keyword, chapter, or reading status.",resetFilters:"Reset filters",guideLabel:"VISUAL FIELDNOTES / THE BIG PICTURE",guideHint:"Start with the big picture. Explore each concept below.",
    quizTitle:"Turn knowledge into intuition.",quizScope:"Quiz scope",quizIntro:"Up to 10 questions per round, with shuffled options. Get an explanation after every answer. Missed concepts stay in Review until you get them right.",startQuiz:"Start a new round →",allAreas:"All topics",question:"Question",correct:"That's right ✓",incorrect:"A useful one to revisit.",correctAnswer:"Correct answer: ",nextQuestion:"Next question →",seeResults:"See results →",results:"Round complete",scoreNote:"Accuracy",again:"Another round →",reviewResults:"Review missed concepts →",restartConfirm:"This round is unfinished. Start a new round? Your submitted answers will stay saved.",reviewIntro:"Mistakes are a map of what to learn next. Answer these again; correct answers leave your review list automatically.",clearWrong:"Clear review list",clearConfirm:"Clear all missed questions? Overall quiz scores and reading progress will be kept.",retryWrong:"Practice missed questions →",noWrong:"A fresh page. No missed questions.",noWrongHint:"Take a quiz to discover your next learning opportunity.",progressTools:"Backup & sync",allTopics:"All topics",progressIntro:"Download an offline backup (with the time of every record), or restore one to replace this browser's progress. Sign in with Google to sync automatically across your devices.",downloadBackup:"Download progress backup ↓",restoreBackup:"Restore from file",restoreConfirm:"Restoring will replace the learning progress in this browser. Continue?",restoreDone:"Progress restored. Reloading…",restoreFailed:"Restore failed: ",cloudBackup:"Private cloud sync",localUpdated:"Last studied here: ",cloudUpdated:"Last synced: ",googleLogin:"Sign in with Google",syncNow:"Sync now",logout:"Sign out",cloudWarning:"Every note and question keeps the time it last changed. Sync keeps the newer change for each one, so progress from different devices is combined instead of overwritten.",storageNote:"This browser cannot save progress. You can keep learning, but your progress will be lost when you reopen the page."
  }
};
for (const l of ["zh", "en"]) Object.assign(COPY[l], SITE.copy[l]);
const PATH_ICONS = ["network", "sliders", "layers", "arrow"];
const ICONS = {
  book:'<path d="M4 4h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v15h-6a3 3 0 0 0-2 1 3 3 0 0 0-2-1H4zM12 5v15"/>',
  network:'<circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="m11 7-5 9m7-9 5 9M7 18h10"/>',
  sliders:'<path d="M5 3v8m0 4v6M12 3v3m0 4v11M19 3v11m0 4v3M2 11h6M9 6h6m1 8h6"/>',
  layers:'<path d="m12 3 10 5-10 5L2 8zm-10 9 10 5 10-5M2 16l10 5 10-5"/>',
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  repeat:'<path d="M20 7H7a4 4 0 0 0-4 4m14-8 4 4-4 4M4 17h13a4 4 0 0 0 4-4M7 13l-4 4 4 4"/>',
  bulb:'<path d="M9 18h6m-6 3h6M8 14a6 6 0 1 1 8 0l-1 4H9zM12 1v2M3 5l2 2m14 0 2-2"/>',
  search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
  check:'<path d="m5 12 4 4L19 6"/>'
};
function cleanState(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const count = v => Number.isSafeInteger(v) && v >= 0 ? v : 0;
  const tally = v => { const attempts = count(v?.attempts); return {attempts, correct:Math.min(count(v?.correct ?? v?.right), attempts)}; };
  const answers = Object.fromEntries(Object.entries(source.answers && typeof source.answers === "object" ? source.answers : {})
    .filter(([id]) => DATA.quiz.some(q => q.id === Number(id))).map(([id, v]) => [id, tally(v)]));
  // Totals saved before per-question counts existed are kept as-is under `earlier`.
  const earlier = tally(source.answers ? source.earlier : source), all = [earlier, ...Object.values(answers)];
  return {
    read:[...new Set((Array.isArray(source.read) ? source.read : []).filter(id => DATA.questions.some(q => q.id === id)))],
    wrong:[...new Set((Array.isArray(source.wrong) ? source.wrong : []).filter(id => DATA.quiz.some(q => q.id === id)))],
    answers, earlier,
    attempts:all.reduce((sum, v) => sum + v.attempts, 0),
    correct:all.reduce((sum, v) => sum + v.correct, 0),
    lang:source.lang === "zh" ? "zh" : "en"
  };
}
// Synced per-item records: note:<id> {read}, quiz:<id> {attempts, correct, wrong}, earlier {attempts, correct}; each carries `at`.
function toRecords(s) {
  const out = {};
  for (const id of s.read) out["note:" + id] = {read:true};
  for (const id of new Set([...Object.keys(s.answers).map(Number), ...s.wrong])) out["quiz:" + id] = {attempts:s.answers[id]?.attempts || 0, correct:s.answers[id]?.correct || 0, wrong:s.wrong.includes(id)};
  if (s.earlier.attempts) out.earlier = {...s.earlier};
  return out;
}
// Older Agent pages recorded notes as {"<topic>:<question>": "learning" | "understood"}; such notes carry that key as `legacyKey`.
function legacyRecords(value) {
  if (!value || typeof value !== "object" || Array.isArray(value.read)) return toRecords(cleanState(value));
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v === "understood").map(([key]) => [key, {state:"understood"}]));
}
const LEGACY_NOTES = Object.fromEntries(DATA.questions.filter(q => q.legacyKey).map(q => [q.legacyKey, q.id]));
function fromRecords(records) {
  const s = {read:[], wrong:[], answers:{}, earlier:{}};
  for (const [key, r] of Object.entries(ProgressRecords.live(records))) {
    const [kind, id] = key.split(":");
    if (key in LEGACY_NOTES) { if (r.state === "understood") s.read.push(LEGACY_NOTES[key]); continue; }
    if ((kind === "note" || kind === "read") && r.read) s.read.push(Number(id)); // VLA saved read:<id>
    if (kind === "quiz") { s.answers[id] = r; if (r.wrong) s.wrong.push(Number(id)); }
    if (key === "earlier") s.earlier = r;
  }
  return cleanState(s);
}
// Data saved before records existed is dated by its last update; corrupt records fall back to that snapshot.
function loadRecords() {
  const saved = localStorage.getItem(RECORDS_KEY), legacy = localStorage.getItem(KEY), legacyAt = Number(localStorage.getItem(UPDATED_KEY)) || 0;
  try { if (saved) return ProgressRecords.clean(JSON.parse(saved)); } catch {}
  let old; try { old = legacyRecords(JSON.parse(legacy)); } catch { old = {}; }
  return ProgressRecords.stamp({}, old, legacyAt);
}
let state, records = {};
try { state = cleanState(JSON.parse(localStorage.getItem(KEY))); } catch { state = cleanState({}); }
try { records = loadRecords(); state = {...fromRecords(records), lang:state.lang}; } catch {}
let lang = state.lang === "zh" ? "zh" : "en";
let topic = "all", tab = "learn", page = 0, session = null;
const expanded = new Set();
const PAGE_SIZE = 10;
const t = key => COPY[lang][key];
const localized = q => lang === "en" ? { ...q, ...q.en } : q;
// Notes are numbered by position, so ids only need to stay stable for saved progress.
const num = id => String(DATA.questions.findIndex(q => q.id === id) + 1).padStart(2, "0");
function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = String(text);
  return node;
}
function icon(name) {
  const wrapper = el("span");
  wrapper.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
  return wrapper.firstElementChild;
}
function button(text, cls, onClick) {
  const b = el("button", cls, text);
  b.type = "button";
  b.addEventListener("click", onClick);
  return b;
}
function save(markDirty = true) {
  state.lang = lang;
  try {
    const before = markDirty && loadRecords(); // read first: before records exist they derive from KEY
    localStorage.setItem(KEY, JSON.stringify(state));
    if (markDirty) {
      const updatedAt = Date.now();
      records = ProgressRecords.stamp(before, toRecords(state), updatedAt);
      localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
      localStorage.setItem(UPDATED_KEY, String(updatedAt));
      globalThis.markProgressDirty?.();
    }
  } catch { $("storageNote").classList.remove("hide"); }
  stats();
}
// Cloud sync and other tabs hand over merged records here.
globalThis.studyProgress = {
  records: loadRecords,
  fromLegacy: (value, at) => ProgressRecords.stamp({}, legacyRecords(value), at),
  apply(value) {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(value));
    records = value; state = {...fromRecords(value), lang};
    localStorage.setItem(KEY, JSON.stringify(state));
    stats(); renderPaths(); renderQuestions(); renderWrong();
  }
};
globalThis.addEventListener?.("storage", event => { if (event.key === RECORDS_KEY) try { studyProgress.apply(loadRecords()); } catch {} });
function when(key) {
  const at = ProgressRecords.live(records)[key]?.at;
  return at ? " · " + new Date(at).toLocaleString(lang === "en" ? "en" : "zh-TW", {month:"numeric", day:"numeric", hour:"2-digit", minute:"2-digit"}) : "";
}
function backupData() { return {version:2,app:SITE.app,exportedAt:new Date().toISOString(),state:cleanState(state),records}; }
// Older Agent and VLA backups kept their progress under `learning` and `progress`.
function parseBackup(value) {
  const snapshot = value?.state || value?.progress || value?.learning;
  if (![1, 2].includes(value?.version) || value.app !== SITE.app || !snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) throw Error(lang === "en" ? `This is not a ${t("name")} progress backup.` : `這不是 ${t("name")} 進度備份。`);
  return fromRecords(ProgressRecords.stamp({}, legacyRecords(snapshot), 1));
}
function exportProgress() {
  const blob = new Blob([JSON.stringify(backupData(), null, 2)], {type:"application/json"});
  const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = SITE.app + "-progress.json"; link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
async function restoreProgress(file) {
  try {
    const restored = parseBackup(JSON.parse(await file.text()));
    if (!confirm(t("restoreConfirm"))) return;
    state = {...restored, lang}; save();
    $("backupStatus").textContent = t("restoreDone"); location.reload();
  } catch (error) { $("backupStatus").textContent = t("restoreFailed") + error.message; }
}
function stats() {
  $("doneNum").textContent = state.read.length + " / " + DATA.questions.length;
  $("readBar").style.width = (state.read.length / DATA.questions.length * 100) + "%";
  $("accuracy").textContent = state.attempts ? Math.round(state.correct / state.attempts * 100) + "%" : "—";
  $("wrongNum").textContent = state.wrong.length;
  $("continueLearning").querySelector("[data-i18n]").textContent = t(state.read.length ? "continueLearning" : "startLearning");
}
function scrollToWorkspace() { $("workspace").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block:"start" }); }
function setTopic(value, scroll = false) {
  topic = value; page = 0;
  renderFilters(); renderPaths(); renderGuide(); renderQuestions();
  chooseTab("learn");
  if (scroll) scrollToWorkspace();
}
function renderPaths() {
  const root = $("paths"); root.replaceChildren();
  t("shortLabels").forEach((name, i) => {
    const b = button("", "path" + (topic === String(i) ? " active" : ""), () => setTopic(String(i), true));
    b.setAttribute("aria-pressed", String(topic === String(i)));
    const top = el("div", "path-top"), badge = el("span", "path-icon");
    badge.append(icon(PATH_ICONS[i % PATH_ICONS.length]));
    top.append(badge, el("span", "path-num", String(i + 1).padStart(2, "0")));
    const questions = DATA.questions.filter(q => q.topic === i);
    const bottom = el("div", "path-bottom");
    bottom.append(el("span", "", `${state.read.filter(id => questions.some(q => q.id === id)).length} / ${questions.length} ${t("questions")}`), el("span", "", "↗"));
    b.append(top, el("h3", "", name), el("p", "", t("descriptions")[i]), bottom); root.append(b);
  });
}
function renderFilters() {
  const root = $("filters"); root.replaceChildren();
  [["all", t("allTopics")], ...t("labels").map((name, i) => [String(i), name])].forEach(([value, name], i) => {
    const b = button("", "filter" + (topic === value ? " active" : ""), () => setTopic(value));
    b.setAttribute("aria-pressed", String(topic === value));
    b.append(icon(i ? PATH_ICONS[(i - 1) % PATH_ICONS.length] : "book"), el("span", "", name), el("span", "count", DATA.questions.filter(q => value === "all" || q.topic === Number(value)).length));
    root.append(b);
  });
}
function renderGuide() {
  const guides = SITE.guides[lang], g = guides[topic === "all" ? 0 : Number(topic)] || guides[0];
  const card = el("section", "visual-guide"), top = el("div", "guide-top"), text = el("div");
  text.append(el("div", "eyebrow accent", t("guideLabel")), el("h3", "", g.title), el("p", "", g.text));
  top.append(text, el("span", "guide-tag", "CONCEPT MAP"));
  const flow = el("ol", "flow");
  g.steps.forEach(([title, subtitle, symbol]) => {
    const step = el("li"); step.append(icon(symbol), el("span", "", title), el("small", "", subtitle)); flow.append(step);
  });
  // Parallel paths (LoRA) draw as a branch so they don't read as sequential steps; `branch` describes them.
  if (g.branch) {
    flow.classList.add("lora-flow");
    flow.setAttribute("aria-label", g.branch);
  }
  const foot = el("div", "guide-foot"); foot.append(icon("bulb"), el("span", "", t("guideHint")));
  card.append(top, flow, foot); $("guide").replaceChildren(card);
}
function emptyState(title, description, action) {
  const root = el("div", "empty"); root.append(icon("book"), el("h3", "", title), el("p", "", description));
  if (action) root.append(action);
  return root;
}
function resetFilters() { $("search").value = ""; $("statusFilter").value = "all"; setTopic("all"); }
function renderQuestions() {
  const root = $("questionList"); root.replaceChildren();
  const query = $("search").value.trim().toLowerCase(), status = $("statusFilter").value;
  const rows = DATA.questions.filter(q => {
    const searchText = `q${Number(num(q.id))} ${q.title} ${q.answer} ${q.en.title} ${q.en.answer}`.toLowerCase();
    return (topic === "all" || q.topic === Number(topic)) && (!query || searchText.includes(query)) && (status === "all" || state.read.includes(q.id) === (status === "read"));
  });
  page = Math.max(0, Math.min(page, Math.ceil(rows.length / PAGE_SIZE) - 1));
  $("resultCount").textContent = rows.length + " " + t("questions");
  if (!rows.length) root.append(emptyState(t("noResults"), t("searchHint"), button(t("resetFilters"), "btn", resetFilters)));
  rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).forEach(source => {
    const q = localized(source), isRead = state.read.includes(q.id);
    const card = el("article", "qa" + (isRead ? " is-read" : "")), heading = el("h3"), content = el("span", "question-copy");
    content.append(el("span", "question-title", q.title), el("span", "meta", t("labels")[q.topic]));
    const actions = el("span", "question-actions");
    if (isRead) { const check = el("span", "read-check"); check.append(icon("check")); check.setAttribute("aria-label", t("read")); actions.append(check); }
    const answerId = "answer-" + q.id, open = expanded.has(q.id);
    const show = el("span", "reveal", open ? "−" : "+"); show.setAttribute("aria-hidden", "true");
    const summary = button("", "question-summary", () => {
      const opened = box.classList.contains("hide"); box.classList.toggle("hide", !opened);
      opened ? expanded.add(q.id) : expanded.delete(q.id);
      show.textContent = opened ? "−" : "+";
      summary.setAttribute("aria-expanded", String(opened));
      summary.setAttribute("aria-label", t(opened ? "hide" : "show") + ": " + q.title);
    });
    summary.setAttribute("aria-expanded", String(open)); summary.setAttribute("aria-controls", answerId);
    summary.setAttribute("aria-label", t(open ? "hide" : "show") + ": " + q.title);
    actions.append(show); summary.append(el("span", "question-number", num(q.id)), content, actions);
    heading.append(summary);
    const box = el("div", "answer" + (open ? "" : " hide")); box.id = answerId;
    box.append(el("div", "answer-label", t("answer")), el("p", "", q.answer));
    for (const {caption, steps} of q.flows || []) {
      const flow = el("div", "mini-flow");
      if (caption) flow.append(el("small", "", caption));
      steps.forEach((text, i) => { if (i) flow.append(el("b", "", "→")); flow.append(el("span", "", text)); }); box.append(flow);
    }
    if (q.sources) {
      const sources = el("div", "answer-footer"); sources.append(el("span", "", t("references")));
      q.sources.forEach(source => {
        const link = el("a", "btn text", source.title);
        link.href = source.url; link.target = "_blank"; link.rel = "noopener noreferrer";
        sources.append(link);
      }); box.append(sources);
    }
    const footer = el("div", "answer-footer");
    const mark = button(t(isRead ? "marked" : "mark") + (isRead ? when("note:" + q.id) : ""), "btn mark", () => {
      state.read = isRead ? state.read.filter(id => id !== q.id) : [...state.read, q.id];
      save(); renderPaths(); renderQuestions();
      document.querySelector(`#answer-${q.id} .mark`)?.focus({preventScroll:true});
    }); mark.setAttribute("aria-pressed", String(isRead));
    footer.append(el("span", "", t("reflect")), mark); box.append(footer);
    const quiz = DATA.quiz.find(item => item.id === q.id);
    if (quiz) box.append(button(t("practice"), "btn text", () => { if (beginSession([quiz])) { chooseTab("quiz"); scrollToWorkspace(); } }));
    card.append(heading, box); root.append(card);
  });
  renderPagination(rows.length);
}
function renderPagination(count) {
  const root = $("pagination"); root.replaceChildren();
  if (count <= PAGE_SIZE) return;
  const previous = button(t("previous"), "btn", () => { page--; renderQuestions(); $("learnTitle").scrollIntoView({block:"start"}); });
  const next = button(t("next"), "btn", () => { page++; renderQuestions(); $("learnTitle").scrollIntoView({block:"start"}); });
  previous.disabled = page === 0; next.disabled = (page + 1) * PAGE_SIZE >= count;
  root.append(previous, el("span", "", `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, count)} ${t("of")} ${count}`), next);
}
function chooseTab(value) {
  tab = value;
  ["learn", "quiz", "review"].forEach(name => {
    $(name).classList.toggle("hide", name !== value);
    document.querySelector(`[data-tab="${name}"]`).setAttribute("aria-current", name === value ? "page" : "false");
  });
  if (value === "review") renderWrong();
  if (value === "learn") renderQuestions();
}
function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
function beginSession(pool) {
  if (session && session.index < session.list.length && !confirm(t("restartConfirm"))) return false;
  if (!pool.length) return false;
  session = {list:shuffle(pool).slice(0,10).map(q => ({q, order:shuffle([0,1,2,3]), selected:null})), index:0, score:0};
  renderQuiz(); return true;
}
function startQuiz() {
  const mode = $("quizMode").value;
  beginSession(DATA.quiz.filter(q => mode === "all" || DATA.questions.find(item => item.id === q.id).topic === Number(mode)));
}
function renderQuiz() {
  const host = $("quizHost"); host.replaceChildren(); if (!session) return;
  if (session.index >= session.list.length) {
    const panel = el("div", "panel quiz-card");
    panel.append(el("div", "eyebrow accent", t("results")), el("div", "score", `${session.score} / ${session.list.length}`), el("p", "", `${t("scoreNote")} ${Math.round(100 * session.score / session.list.length)}%`));
    const actions = el("div", "row"); actions.append(button(t("again"), "btn primary", startQuiz), button(t("reviewResults"), "btn", () => chooseTab("review"))); panel.append(actions); host.append(panel); return;
  }
  const item = session.list[session.index], q = localized(item.q), answered = item.selected !== null;
  const card = el("div", "panel quiz-card"), progress = el("div", "progress"), bar = el("div", "bar");
  progress.setAttribute("role","progressbar"); progress.setAttribute("aria-valuemin","0"); progress.setAttribute("aria-valuemax",String(session.list.length)); progress.setAttribute("aria-valuenow",String(session.index + (answered ? 1 : 0))); progress.setAttribute("aria-label",t("quiz"));
  bar.style.width = ((session.index + (answered ? 1 : 0)) / session.list.length * 100) + "%"; progress.append(bar);
  card.append(el("div", "meta", `${t("question")} ${session.index + 1} / ${session.list.length} · Q${num(q.id)}`), progress, el("h3", "", q.prompt));
  item.order.forEach((optionIndex, displayIndex) => {
    const b = button("", "quiz-option", () => {
      if (item.selected !== null) return;
      const tally = state.answers[q.id] ||= {attempts:0, correct:0};
      item.selected = optionIndex; state.attempts++; tally.attempts++;
      if (optionIndex === q.correct) { session.score++; state.correct++; tally.correct++; state.wrong = state.wrong.filter(id => id !== q.id); }
      else if (!state.wrong.includes(q.id)) state.wrong.push(q.id);
      save(); renderQuiz();
      $("quizHost").querySelector(".feedback button").focus({preventScroll:true});
    });
    b.append(el("span", "option-letter", "ABCD"[displayIndex]), el("span", "", q.options[optionIndex]));
    if (answered) { b.disabled = true; if (optionIndex === q.correct) { b.classList.add("correct"); b.append(el("span", "", "✓")); } else if (optionIndex === item.selected) { b.classList.add("wrong"); b.append(el("span", "", "×")); } }
    card.append(b);
  });
  if (answered) {
    const feedback = el("div", "feedback");
    feedback.append(el("strong", "", t(item.selected === q.correct ? "correct" : "incorrect")), el("p", "", t("correctAnswer") + q.options[q.correct]), el("p", "", q.explain), button(t(session.index === session.list.length - 1 ? "seeResults" : "nextQuestion"), "btn primary", () => { session.index++; renderQuiz(); $("quizHost").scrollIntoView({block:"start"}); }));
    card.append(feedback);
  }
  host.append(card);
}
function renderWrong() {
  const root = $("wrongList"); root.replaceChildren();
  $("retryWrong").classList.toggle("hide", !state.wrong.length); $("clearWrong").disabled = !state.wrong.length;
  if (!state.wrong.length) { root.append(emptyState(t("noWrong"), t("noWrongHint"), button(t("startQuiz"), "btn primary", () => { chooseTab("quiz"); startQuiz(); }))); return; }
  state.wrong.forEach(id => {
    const q = localized(DATA.quiz.find(item => item.id === id)), card = el("article", "panel");
    card.append(el("div", "meta", "Q" + num(id) + when("quiz:" + id)), el("h3", "", q.prompt), el("p", "", t("correctAnswer") + q.options[q.correct]), el("p", "", q.explain), button(t("practice"), "btn", () => { if (beginSession([DATA.quiz.find(item => item.id === id)])) chooseTab("quiz"); })); root.append(card);
  });
}
function setLanguage(value) {
  const changed = lang !== value;
  lang = value; document.documentElement.lang = lang === "en" ? "en" : "zh-Hant";
  document.querySelectorAll("[data-i18n]").forEach(node => { node.textContent = t(node.dataset.i18n); });
  document.querySelectorAll("[data-i18n-label]").forEach(node => node.setAttribute("aria-label", t(node.dataset.i18nLabel)));
  document.querySelectorAll("[data-i18n-placeholder]").forEach(node => node.placeholder = t(node.dataset.i18nPlaceholder));
  document.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  const mode = $("quizMode").value || "all"; $("quizMode").replaceChildren();
  [["all",t("allAreas")],...t("labels").map((name,i) => [String(i),name])].forEach(([value,name]) => {const option=el("option","",name);option.value=value;$("quizMode").append(option);});
  $("quizMode").value = mode;
  $("art").alt = t("artDesc");
  renderFilters(); renderPaths(); renderGuide(); renderQuestions(); renderQuiz(); renderWrong(); save(changed);
}
document.querySelectorAll("[data-icon]").forEach(node => node.replaceChildren(icon(node.dataset.icon)));
document.querySelectorAll("[data-tab]").forEach(b => b.addEventListener("click", () => { chooseTab(b.dataset.tab); scrollToWorkspace(); }));
document.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => setLanguage(b.dataset.lang)));
$("search").addEventListener("input", () => {page=0;renderQuestions();});
$("statusFilter").addEventListener("change", () => {page=0;renderQuestions();});
$("startQuiz").addEventListener("click", startQuiz);
$("retryWrong").addEventListener("click", () => {if (beginSession(DATA.quiz.filter(q => state.wrong.includes(q.id)))) chooseTab("quiz");});
$("clearWrong").addEventListener("click", () => { if (confirm(t("clearConfirm"))) { state.wrong=[];save();renderWrong(); } });
$("continueLearning").addEventListener("click", () => {
  $("search").value="";$("statusFilter").value="all";
  const next=DATA.questions.find(q=>!state.read.includes(q.id));
  setTopic(next ? String(next.topic) : "all", true);
  if (next) { page=Math.floor(DATA.questions.filter(q=>q.topic===next.topic).findIndex(q=>q.id===next.id)/PAGE_SIZE); renderQuestions(); }
});
$("heroQuiz").addEventListener("click", () => {chooseTab("quiz");scrollToWorkspace();});
$("exportProgress").addEventListener("click", exportProgress);
$("restoreProgress").addEventListener("click", () => $("importProgress").click());
$("importProgress").addEventListener("change", event => { const file = event.target.files[0]; if (file) restoreProgress(file); event.target.value = ""; });
setLanguage(lang);
