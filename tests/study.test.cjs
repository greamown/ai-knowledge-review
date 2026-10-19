// All three topics share shared/study.js; each page's script#seed holds its content and settings.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const script = fs.readFileSync(path.join(root, "shared/study.js"), "utf8");
const core = script.split('document.querySelectorAll("[data-icon]")')[0]; // state logic only, no rendering

function load(topic, stored = {}) {
  const html = fs.readFileSync(path.join(root, topic, "index.html"), "utf8");
  const seed = html.match(/<script id="seed" type="application\/json">([\s\S]*?)<\/script>/)[1];
  const storage = new Map(Object.entries(stored).map(([k, v]) => [k, JSON.stringify(v)]));
  const context = vm.createContext({
    document: { getElementById: (id) => (id === "seed" ? { textContent: seed } : null) },
    localStorage: { getItem: (k) => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v) },
    ProgressRecords: require("../shared/progress-records.js"),
  });
  vm.runInContext(core + ";globalThis.api={DATA,COPY,state,fromRecords,parseBackup,backupData,num};", context);
  return { ...context.api, html, storage };
}

for (const topic of ["agent", "genai", "vla"]) {
  test(`${topic}: seed content is complete in both languages`, () => {
    const { DATA, COPY, html } = load(topic);
    assert.ok(html.includes('src="../shared/study.js"') && html.includes("progress: studyProgress"));
    assert.deepEqual(Object.keys(COPY.zh).sort(), Object.keys(COPY.en).sort());
    const chapters = COPY.zh.labels.length;
    for (const key of ["labels", "shortLabels", "descriptions"]) for (const l of ["zh", "en"]) assert.equal(COPY[l][key].length, chapters, `${l}.${key}`);
    for (const l of ["zh", "en"]) assert.ok(DATA.site.guides[l].length >= 1);
    const ids = DATA.questions.map((q) => q.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const q of DATA.questions) {
      assert.ok(q.topic >= 0 && q.topic < chapters, `note ${q.id}: topic`);
      for (const f of [q, q.en]) assert.ok(f.title?.trim() && f.answer?.trim(), `note ${q.id}: text`);
      for (const flow of [...(q.flows || []), ...(q.en.flows || [])]) assert.ok(flow.steps.length && flow.steps.every((s) => s.trim()));
      assert.doesNotMatch(q.en.title + q.en.answer, /[㐀-鿿]/, `note ${q.id}: untranslated English`);
    }
    assert.equal(new Set(DATA.quiz.map((q) => q.id)).size, DATA.quiz.length);
    for (const q of DATA.quiz) {
      assert.ok(ids.includes(q.id), `quiz ${q.id} practices a note`);
      assert.ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < 4);
      for (const f of [q, q.en]) {
        assert.equal(new Set(f.options).size, 4);
        assert.ok(f.prompt?.trim() && f.explain?.trim());
      }
    }
  });
}

test("agent: progress saved by the old pages is still counted", () => {
  const records = {
    "architecture:What is an AI agent? How does it differ from a chatbot?": { state: "understood", at: 5 },
    "tools:How does an agent decide when to call a tool?": { state: "learning", at: 6 },
  };
  assert.deepEqual([...load("agent", { "agent-learning-records": records }).state.read], [1]);
  // Before per-question records existed, the old pages kept a {key: state} map.
  const legacy = { "security:How should agent tool permissions be designed?": "understood" };
  assert.deepEqual([...load("agent", { "agent-learning": legacy }).state.read], [9]);
  const { parseBackup } = load("agent");
  assert.deepEqual([...parseBackup({ version: 2, app: "agent-knowledge", learning: legacy }).read], [9]);
  assert.throws(() => parseBackup({ version: 2, app: "vla-knowledge-lab", progress: {} }), /Agent Knowledge Lab/);
});

test("vla: progress saved by the old pages is still counted", () => {
  const records = { "read:0": { read: true, at: 1 }, "quiz:4": { attempts: 3, right: 2, wrong: true, at: 2 }, earlier: { attempts: 4, right: 1, at: 1 } };
  const { state, num } = load("vla", { "vla-knowledge-lab-v1-records": records });
  assert.deepEqual([...state.read], [0]);
  assert.deepEqual([...state.wrong], [4]);
  assert.equal(state.attempts, 7);
  assert.equal(state.correct, 3);
  assert.equal(num(0), "01", "ids start at 0 but notes are numbered from 01");
  const legacy = { read: [2], wrong: [], right: 1, attempts: 1, answers: {}, earlier: { attempts: 1, right: 1 } };
  assert.deepEqual([...load("vla", { "vla-knowledge-lab-v1": legacy }).state.read], [2]);
  const { parseBackup } = load("vla");
  assert.deepEqual([...parseBackup({ version: 2, app: "vla-knowledge-lab", progress: legacy }).read], [2]);
});

test("landing page counts match each topic", () => {
  const landing = fs.readFileSync(path.join(root, "index.html"), "utf8");
  for (const topic of ["agent", "genai", "vla"]) {
    const { DATA } = load(topic);
    const [, key, notes, quiz] = landing.match(new RegExp(`href="${topic}/" data-records="([^"]+)" data-notes="(\\d+)" data-quiz="(\\d+)"`));
    assert.equal(key, DATA.site.key + "-records");
    assert.equal(Number(notes), DATA.questions.length);
    assert.equal(Number(quiz), DATA.quiz.length);
  }
});
