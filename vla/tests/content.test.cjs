const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');

function app(saved, blocked = false) {
  const elements = new Map(), storage = new Map();
  if (saved !== undefined) storage.set('vla-knowledge-lab-v1', JSON.stringify(saved));
  const element = id => {
    if (!elements.has(id)) {
      const classes = new Set(['quizRunning','quizResult','storageNotice'].includes(id) ? ['hide'] : []);
      elements.set(id, {value:id==='quizCategory'?'all':id==='quizCount'?'5':'', textContent:'', innerHTML:'', style:{},
        classList:{contains:c=>classes.has(c), add:c=>classes.add(c), remove:c=>classes.delete(c), toggle(c, on){if(on ?? !classes.has(c)) classes.add(c); else classes.delete(c);}},
        parentElement:{setAttribute(){}}, setAttribute(){}, focus(){}, querySelector:()=>({focus(){}})});
    }
    return elements.get(id);
  };
  const context = vm.createContext({
    document:{getElementById:element, querySelectorAll:()=>[], querySelector:()=>null, documentElement:{}},
    localStorage:{getItem:k=>{if(blocked) throw Error('blocked'); return storage.get(k) ?? null;}, setItem:(k,v)=>{if(blocked) throw Error('blocked'); storage.set(k,v);}},
    window:{scrollTo(){}}, confirm:()=>true
  });
  for (const file of ['questions.js','learning.js','../shared/progress-records.js','app.js']) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
  return {run:code=>vm.runInContext(code,context), element, storage};
}

test('both languages have complete, aligned questions and UI translations', () => {
  const {run} = app();
  assert.equal(run('bankZh.length'),30);
  assert.equal(run('bankEn.length'),30);
  assert.equal(run('categories.length'),5);
  assert.equal(run(`bankZh.every((q,i)=>q.length===6 && bankEn[i].length===6 && q[3].length===4 && bankEn[i][3].length===4 && q[4]===bankEn[i][4] && q[4]>=0 && q[4]<4 && [q,bankEn[i]].every(row=>[row[0],row[1],row[2],row[5],...row[3]].every(s=>typeof s==='string' && s.trim())))`),true);
  assert.equal(run('JSON.stringify(Object.keys(copy.zh).sort())===JSON.stringify(Object.keys(copy.en).sort())'),true);
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  for (const [,key] of html.matchAll(/data-(?:i18n|placeholder|alt)="([^"]+)"/g)) assert.equal(run(`typeof copy.en[${JSON.stringify(key)}]`),'string',key);
});

test('switching languages retains the question, feedback, score, and progress', () => {
  const {run,element} = app({read:[0,3],wrong:[],right:2,attempts:4});
  run('startQuiz(); pick(bankZh[exam[0]][4]);');
  const state=run('JSON.stringify({exam,cursor,score,selected,answered,store})');
  run("setLanguage('en')");
  assert.equal(run('JSON.stringify({exam,cursor,score,selected,answered,store})'),state);
  assert.match(element('quizFeedback').innerHTML,/That’s right/);
  assert.equal(element('quizOptions').innerHTML.includes('disabled'),true);
  run('pick(0)');
  assert.equal(run('store.attempts'),5);
  run("setLanguage('zh')");
  assert.match(element('quizFeedback').innerHTML,/答對了/);
});

test('missed questions can be practiced directly and cleared by a correct answer', () => {
  const {run,element} = app();
  run('startQuiz(); pick((bankZh[exam[0]][4]+1)%4)');
  assert.equal(run('store.wrong.length'),1);
  run('startQuiz(true)');
  assert.equal(run('exam.length'),1);
  run('pick(bankZh[exam[0]][4]); nextQuestion()');
  assert.equal(run('store.wrong.length'),0);
  assert.match(element('quizResult').innerHTML,/100%/);
  assert.equal(run('store.attempts'),2);
});

test('chapter filtering, bilingual search, and quiz counts stay consistent', () => {
  const {run,element} = app();
  element('quizCategory').value='系統設計';
  element('quizCount').value='20';
  run('startQuiz()');
  assert.equal(run('exam.length'),6);
  assert.equal(run('new Set(exam).size'),6);
  element('search').value='proprioception';
  run("setLanguage('zh')");
  assert.match(element('lessonList').innerHTML,/Proprioception/);
  assert.equal(element('resultCount').textContent,'1 個知識題');
});

test('existing progress is retained and invalid saved IDs are discarded', () => {
  const {run} = app({read:[0,0,19,-1,30,'3'],wrong:[1,99],right:3,attempts:5});
  assert.equal(run('JSON.stringify(store.read)'),'[0,19]');
  assert.equal(run('JSON.stringify(store.wrong)'),'[1]');
  assert.equal(run('store.right'),3);
  run('resetProgress()');
  assert.equal(run('store.attempts'),0);
  assert.equal(run('store.read.length'),0);
});

test('progress backups round-trip and reject another format before overwriting data', () => {
  const {run,storage} = app({read:[2,4],wrong:[7],right:3,attempts:5});
  const backup=run('JSON.stringify(backupData())');
  run('store=emptyStore(); restoreProgressBackup('+JSON.stringify(JSON.parse(backup))+')');
  assert.equal(run('JSON.stringify([store.read,store.wrong,store.right,store.attempts])'),'[[2,4],[7],3,5]');
  assert.ok(Number(storage.get('vla-knowledge-lab-v1-updated-at'))>0);
  assert.throws(()=>run("restoreProgressBackup({version:1,app:'other',progress:{}})"),/VLA Knowledge Lab/);
  assert.equal(run('store.attempts'),5);
});

test('blocked browser storage leaves the application usable with a notice', () => {
  const {run,element} = app(undefined,true);
  run('startQuiz(); pick(bankZh[exam[0]][4])');
  assert.equal(run('score'),1);
  assert.equal(element('storageNotice').classList.contains('hide'),false);
});

test('every question has a bilingual content behind a collapsed question heading', () => {
  const {run} = app();
  assert.equal(run('learningNotes.length'),run('bankZh.length'));
  for (const language of ['zh','en']) {
    run(`setLanguage('${language}')`);
    for(let id=0; id<run('bankZh.length'); id++) {
      assert.equal(run(`learningNotes[${id}][lang].length`),4);
      const html=run(`lesson(${id})`);
      assert.match(html,/<figure class="lesson-visual">/);
      assert.match(html,/<details class="item visual-lesson"/);
      assert.match(html,/<summary class="lesson-summary">/);
      assert.match(html,/<span class="lesson-expand">\+<\/span>/);
      assert.match(html,/<span class="lesson-collapse">−<\/span>/);
      assert.ok(!html.includes(' open>'));
      assert.equal((html.match(/<details /g)||[]).length,1);
      assert.ok(html.includes(run(`escapeHTML(bank()[${id}][2])`)));
      assert.ok(html.includes(run(`escapeHTML(bank()[${id}][5])`)));
      assert.ok(!html.includes('undefined'),`missing visual data for ${language} ${id}`);
    }
  }
});

test('expanded question state survives language changes and visual-only terms are searchable', () => {
  const {run,element} = app();
  run("rememberLesson(0,true); setLanguage('en')");
  assert.match(run('lesson(0)'),/ontoggle="[^"]+" open>/);
  run('rememberLesson(0,false)');
  assert.ok(!run('lesson(0)').includes(' open>'));
  run('rememberLesson(7,true)');
  element('search').value='velocity field';
  run('renderLearn()');
  assert.match(element('lessonList').innerHTML,/flow-matching/);
  assert.match(element('lessonList').innerHTML,/data-lesson="7"[^>]* open>/);
  run('store.wrong=[7]; renderReview()');
  assert.match(element('reviewList').innerHTML,/data-lesson="7"[^>]* open>/);
  run('rememberLesson(7,false); renderReview()');
  assert.ok(!element('reviewList').innerHTML.includes(' open>'));
});

test('model lessons are searchable and expose official links in lessons, review, and quiz feedback', () => {
  const {run,element} = app({read:[0,19],wrong:[22],right:1,attempts:2});
  const models = ['OpenVLA','π0','GR00T N1.7','Gemini Robotics'];
  for (const language of ['zh','en']) {
    run(`setLanguage('${language}')`);
    for (let i=0;i<models.length;i++) {
      const id=20+i;
      element('search').value=models[i];
      run('renderLearn()');
      assert.ok(element('lessonList').innerHTML.includes(`Q${id+1}`));
      const html=run(`lesson(${id})`);
      assert.match(html,/<div class="lesson-sources">/);
      assert.ok(!html.includes('undefined'));
      const sources=JSON.parse(run(`JSON.stringify(learningNotes[${id}].sources)`));
      assert.ok(sources.length>=2);
      for (const [url,zh,en] of sources) {
        assert.equal(new URL(url).protocol,'https:');
        assert.ok(zh.trim() && en.trim());
        assert.ok(html.includes(`href="${url}" target="_blank" rel="noopener noreferrer"`));
      }
      run(`exam=[${id}]; cursor=0; answered=false; pick(bankZh[${id}][4])`);
      assert.match(element('quizFeedback').innerHTML,/<div class="lesson-sources">/);
    }
    run('store.wrong=[22]; renderReview()');
    assert.match(element('reviewList').innerHTML,/TensorRT/);
    assert.match(element('reviewList').innerHTML,/<div class="lesson-sources">/);
  }
  assert.equal(run('JSON.stringify(store.read)'),'[0,19]');
  element('quizCategory').value='模型架構';
  element('quizCount').value='999';
  run('startQuiz()');
  assert.equal(run('[20,21,22,23].every(id=>exam.includes(id))'),true);
});

test('Physical AI interview lessons are searchable, quizzable, and reviewable in both languages', () => {
  const {run,element} = app({read:[0,23],wrong:[],right:0,attempts:0});
  const terms=['Sensor-to-Actuation','GPU','Jetson','40%','100 ms','Reliable QoS'];
  for (const language of ['zh','en']) {
    run(`setLanguage('${language}')`);
    for (let id=24; id<30; id++) {
      element('search').value=terms[id-24];
      run('renderLearn()');
      assert.ok(element('lessonList').innerHTML.includes(`data-lesson="${id}"`));
      run(`exam=[${id}]; cursor=0; answered=false; pick((bankZh[${id}][4]+1)%4)`);
      assert.ok(run(`store.wrong.includes(${id})`));
      assert.match(element('quizFeedback').innerHTML,/<div class="lesson-sources">/);
      run('renderReview()');
      assert.ok(element('reviewList').innerHTML.includes(`data-lesson="${id}"`));
      run(`startQuiz(true); cursor=exam.indexOf(${id}); answered=false; pick(bankZh[${id}][4])`);
      assert.ok(!run(`store.wrong.includes(${id})`));
    }
    element('quizCategory').value='all';
    element('quizCount').value='999';
    run('startQuiz()');
    assert.equal(run('[24,25,26,27,28,29].every(id=>exam.includes(id))'),true);
  }
  assert.equal(run('JSON.stringify(store.read)'),'[0,23]');
});
