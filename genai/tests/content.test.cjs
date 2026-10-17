const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'), 'utf8');
const seed = html.match(/<script id="seed" type="application\/json">([\s\S]*?)<\/script>/)[1];
const data = JSON.parse(seed);
assert.equal(data.questions.length, 97);
assert.equal(data.quiz.length, 34);
assert.equal(new Set(data.questions.map(q => q.id)).size, 97);
assert.equal(new Set(data.quiz.map(q => q.id)).size, 34);
for (const q of data.questions) {
  assert.ok(Number.isInteger(q.id) && q.topic >= 0 && q.topic <= 3);
  for (const fields of [q, q.en]) for (const key of ['title', 'answer']) assert.ok(fields[key]?.trim(), `Q${q.id}: missing ${key}`);
  assert.doesNotMatch(q.en.title + q.en.answer, /[\u3400-\u9fff]/, `Q${q.id}: untranslated English`);
  assert.match(q.answer, /^白話說：[\s\S]+\n\n情境：[\s\S]+\n\n記住：.+$/, `Q${q.id}: missing learning context`);
  assert.match(q.en.answer, /^In plain words:[\s\S]+\n\nScenario:[\s\S]+\n\nRemember:.+$/, `Q${q.id}: missing English learning context`);
  if (q.id >= 91 && q.id <= 97) assert.ok(q.sources?.length, `Q${q.id}: missing primary sources`);
  for (const source of q.sources || []) {
    assert.ok(source.title?.trim(), `Q${q.id}: missing reference title`);
    assert.equal(new URL(source.url).protocol, 'https:', `Q${q.id}: reference must use HTTPS`);
    assert.doesNotMatch(source.title, /[\u3400-\u9fff]/, `Q${q.id}: reference title must work in English`);
  }
}
for (const q of data.quiz) {
  const note = data.questions.find(note => note.id === q.id);
  assert.ok(note);
  assert.equal(q.explain, note.answer, `Q${q.id}: quiz feedback differs from the note`);
  assert.equal(q.en.explain, note.en.answer, `Q${q.id}: English quiz feedback differs from the note`);
  assert.ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < 4);
  for (const fields of [q, q.en]) {
    assert.equal(fields.options.length, 4);
    assert.equal(new Set(fields.options).size, 4);
    assert.ok(fields.prompt?.trim() && fields.explain?.trim());
    assert.ok(fields.options.every(option => option.trim()));
  }
  assert.doesNotMatch(JSON.stringify(q.en), /[\u3400-\u9fff]/);
}
const script = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
new vm.Script(script);
// Exercise state and session logic without browser dependencies; rendering is checked in Chrome.
const core = script.split('document.querySelectorAll("[data-icon]")')[0];
const stored = new Map([['genai-learning-v1', JSON.stringify({read:[1,1,999,'2'],wrong:[3,3,2,999],attempts:5,correct:99,lang:'en'})]]);
const context = {
  document: {getElementById: id => id === 'seed' ? {textContent:seed} : null},
  localStorage: {getItem: key => stored.get(key) ?? null, setItem: (key,value) => stored.set(key,value)},
  confirm: () => false,
  ProgressRecords: require('../../shared/progress-records.js'),
  assert
};
vm.runInNewContext(core + `
  assert.deepEqual(Array.from(state.read), [1]);
  assert.deepEqual(Array.from(state.wrong), [3]);
  assert.equal(state.correct, 5);
  const backup=backupData();
  assert.equal(backup.version,2);
  assert.equal(backup.app,'genai-knowledge');
  assert.deepEqual(Array.from(parseBackup(backup).read),[1]);
  assert.throws(()=>parseBackup({version:1,app:'another-app',state:{}}),/GenAI Knowledge/);
  stats=()=>{};state.read=[1,2];let dirty=0;globalThis.markProgressDirty=()=>dirty++;save();
  assert.ok(Number(localStorage.getItem(UPDATED_KEY))>0);
  assert.equal(dirty,1);
  const saved=JSON.parse(localStorage.getItem(RECORDS_KEY));
  assert.equal(saved['note:1'].at,0,'migrated progress keeps its original time');
  assert.ok(saved['note:2'].at>0,'new progress is stamped');
  assert.deepEqual({...saved.earlier},{attempts:5,correct:5,at:0});
  assert.equal(saved['quiz:3'].wrong,true);
  state.answers[3]={attempts:1,correct:1};state.wrong=[];save();
  assert.equal(fromRecords(JSON.parse(localStorage.getItem(RECORDS_KEY))).attempts,6);
  for (const key of Object.keys(COPY.zh)) {
    assert.ok(Object.hasOwn(COPY.en, key), 'Missing English UI key: ' + key);
    assert.equal(typeof COPY.en[key], typeof COPY.zh[key]);
  }
  const source = [1,2,3,4];
  for (let i=0;i<20;i++) {
    const result=shuffle(source);
    assert.equal(result.length,4);
    assert.deepEqual(Array.from(result).sort(),source);
    assert.notEqual(result,source);
  }
  assert.deepEqual(source,[1,2,3,4]);
  renderQuiz = () => {};
  assert.equal(beginSession([]),false);
  assert.equal(beginSession(DATA.quiz),true);
  assert.equal(session.list.length,10);
  assert.equal(new Set(session.list.map(item=>item.q.id)).size,10);
  for(const item of session.list) assert.deepEqual(Array.from(item.order).sort(),[0,1,2,3]);
  const active=session;
  assert.equal(beginSession([DATA.quiz[0]]),false);
  assert.equal(session,active);
  session.index=session.list.length;
  assert.equal(beginSession([DATA.quiz[0]]),true);
  assert.equal(session.list.length,1);
  assert.equal(session.list[0].selected,null);
`, context);
console.log('Passed: bilingual content, IDs, state migration, shuffle, and quiz sessions.');
