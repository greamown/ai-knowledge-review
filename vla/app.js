const copy = {
  zh: {
    officialSources:'官方資源', visualLabel:'概念圖解', shortAnswer:'先記住這一句', fullExplanation:'展開完整解說與面試提醒', readHint:'讀完圖解，試著用自己的話回答。', skip:'跳到主要內容', allTopics:'全部主題', home:'總覽', learn:'知識庫', quiz:'測驗練習', review:'錯題複習',
    heroTitle:'讓機器理解世界，<br>讓你掌握<em>下一步。</em>', heroDesc:'從視覺與語言，到真實世界的動作。用一份有脈絡的學習手冊，建立 VLA 知識，準備你的下一場 Robotics 與 Edge AI 面試。', startLearn:'開始探索知識庫 ↗', startQuiz:'開始測驗 →', robotAlt:'等距機械手臂示意圖：觀察橘色方塊、推理抓取路徑，並透過夾爪執行動作。', figureCaption:'從感知到行動：VLA 的真實世界閉環',
    totalLabel:'核心知識題', totalNote:'5 大章節，從基礎到系統設計', readLabel:'已閱讀', readNote:'每一個理解，都是下一步的基礎', accuracyLabel:'累計正確率', accuracyNote:'透過練習，找出值得再讀的觀念', routeTitle:'理解、練習，再往前一步。', routeCaption:'三個步驟，把知識變成自己的能力。', routeLearn:'建立你的知識地圖', routeLearnDesc:'理解模型架構、訓練資料與部署取捨。每題都附上答案，以及面試時值得深入的細節。', routeLearnFoot:'30 個觀念 · 5 個章節', routeQuiz:'用問題驗證理解', routeQuizDesc:'選擇章節與題數，透過隨機測驗主動回想。即時詳解，讓每一次作答都有收穫。', routeQuizFoot:'彈性題數 · 即時詳解', routeReview:'把弱點變成進步', routeReviewDesc:'自動整理錯題，集中補強還不熟悉的觀念。再次答對後，題目就會從清單移除。', routeReviewFoot:'錯題追蹤 · 專注複習',
    pipelineTitle:'VLA，如何從看到做到？', pipelineDesc:'模型只是其中一環。理解完整資料流，才能設計能落地的機器人系統。', observe:'觀察', observeDesc:'影像、指令與機器人狀態', reason:'推理', reasonDesc:'多模態融合與動作預測', act:'行動', actDesc:'安全檢查與底層控制', feedbackLoop:'← 感測回饋 · 持續修正 · 形成閉環',
    learnTitle:'從觀念，到系統。', learnDesc:'在「模型架構」認識 OpenVLA、π0、GR00T N1.7 與 Gemini Robotics，並連到官方資源。也可依章節探索或搜尋關鍵字。', searchLabel:'尋找一個觀念', searchPlaceholder:'搜尋題目與答案…', chapters:'學習章節', libraryHint:'理解答案，也練習說出背後的原因。', results:n=>`${n} 個知識題`, all:'全部章節', interview:'面試延伸', markRead:'標記已閱讀', readDone:'✓ 已閱讀 · 點擊取消', noResults:'找不到符合條件的內容。試試其他關鍵字。',
    quizTitle:'把理解，化為直覺。', quizDesc:'隨機抽題、即時詳解。答錯的觀念會保留下來，讓下一次練習更有方向。', setupTitle:'安排一場小練習', setupDesc:'先選一個章節，或挑戰整份題庫。不計時，專注在理解。', questionCount:'測驗題數', allQuestions:'全部題目', five:'5 題 · 快速暖身', ten:'10 題 · 深入練習', twenty:'20 題 · 加強練習', progress:(i,n)=>`第 ${i} / ${n} 題`, score:n=>`答對 ${n} 題`, correct:'✓ 答對了', incorrect:c=>`答錯了 · 正確答案 ${c}`, next:'下一題 →', seeResult:'查看成績 →', complete:'測驗完成', result:(s,n)=>`本次答對 ${s} / ${n} 題。答錯的題目已加入複習清單。`, retry:'再測一次',
    reviewTitle:'每個錯題，都是線索。', reviewDesc:'回到還不熟悉的觀念。閱讀詳解後，再測一次；答對就會從清單移除。', practiceMistakes:'練習這些錯題 →', emptyTitle:'目前沒有待複習的錯題', emptyDesc:'完成一場測驗，這裡會自動收集需要再練習的觀念。', backupTitle:'備份與同步進度', backupDesc:'下載一份本機備份，或使用 Google 登入，在其他裝置接續學習。', downloadBackup:'下載進度備份 ↓', restoreBackup:'從備份還原', cloudTitle:'私人雲端同步', localVersion:'這台裝置最後學習', cloudVersion:'上次同步', cloudSync:'立即同步', googleLogin:'使用 Google 登入', cloudLogout:'登出', cloudNote:'登入後自動同步。每題的閱讀與作答都記錄時間，同步時逐題以較新的變更為準，不同裝置的進度會合併而不是互相覆蓋。', reset:'清除學習紀錄', confirmReset:'確定清除所有閱讀與測驗紀錄？已登入時，清除也會同步到你的其他裝置。此操作無法復原。', localNote:'學習進度儲存於此瀏覽器，登入後可跨裝置同步', source:'GitHub 原始碼 ↗', storageError:'此瀏覽器無法儲存紀錄。你仍可繼續學習，但重新整理後可能失去進度。'
  },
  en: {
    officialSources:'Official resources', visualLabel:'CONCEPT AT A GLANCE', shortAnswer:'The one thing to remember', fullExplanation:'Read the full explanation & interview insight', readHint:'After the diagram, explain it in your own words.', skip:'Skip to main content', allTopics:'All topics', home:'Overview', learn:'Library', quiz:'Practice', review:'Review',
    heroTitle:'Machines learn to act.<br>You learn <em>what’s next.</em>', heroDesc:'From vision and language to real-world action. Build a connected understanding of VLA, and prepare for your next robotics or edge AI interview.', startLearn:'Explore the library ↗', startQuiz:'Start a practice →', robotAlt:'Isometric robotic arm observing an orange cube, reasoning about a grasp, and executing an action with its gripper.', figureCaption:'From perception to action: the real-world VLA loop',
    totalLabel:'core questions', totalNote:'5 chapters, from foundations to systems', readLabel:'read so far', readNote:'Every concept builds your next step', accuracyLabel:'overall accuracy', accuracyNote:'Practice reveals what to revisit', routeTitle:'Understand. Practice. Move forward.', routeCaption:'A three-step route from knowledge to confidence.', routeLearn:'Map the fundamentals', routeLearnDesc:'Explore architectures, training data, and deployment trade-offs. Every question includes an answer and an interview insight.', routeLearnFoot:'30 concepts · 5 chapters', routeQuiz:'Put knowledge to work', routeQuizDesc:'Choose a chapter and a session size. Recall what you know, with randomized questions and explanations after every answer.', routeQuizFoot:'Flexible sessions · Instant feedback', routeReview:'Turn gaps into progress', routeReviewDesc:'Revisit the concepts that need a little more attention. Answer correctly in a new practice to clear them from your list.', routeReviewFoot:'Mistake tracking · Focused review',
    pipelineTitle:'How does seeing become doing?', pipelineDesc:'The model is one part of the loop. Understand the entire flow to build robotics systems that work.', observe:'Observe', observeDesc:'Images, instructions & robot state', reason:'Reason', reasonDesc:'Multimodal fusion & action prediction', act:'Act', actDesc:'Safety checks & low-level control', feedbackLoop:'← SENSOR FEEDBACK · CORRECT · REPEAT',
    learnTitle:'From concepts to systems.', learnDesc:'Meet OpenVLA, π0, GR00T N1.7, and Gemini Robotics in Model architecture, with official resources. Explore by chapter or search for a concept.', searchLabel:'Find a concept', searchPlaceholder:'Search questions & answers…', chapters:'Chapters', libraryHint:'Know the answer. Understand the reasoning.', results:n=>`${n} knowledge questions`, all:'All chapters', interview:'Interview insight', markRead:'Mark as read', readDone:'✓ Read · click to undo', noResults:'No matching concepts. Try a different search.',
    quizTitle:'Make understanding second nature.', quizDesc:'Randomized questions. Immediate explanations. Keep the concepts you miss for a more focused next session.', setupTitle:'Make room for a little practice', setupDesc:'Focus on a chapter or try the whole library. No timer. Just understanding.', questionCount:'Session size', allQuestions:'All questions', five:'5 questions · A quick warm-up', ten:'10 questions · Go a little deeper', twenty:'20 questions · Extended practice', progress:(i,n)=>`Question ${i} / ${n}`, score:n=>`${n} correct`, correct:'✓ That’s right', incorrect:c=>`Not quite · Correct answer ${c}`, next:'Next question →', seeResult:'View results →', complete:'Practice complete', result:(s,n)=>`You answered ${s} of ${n} correctly. Missed questions are ready in your review list.`, retry:'Practice again',
    reviewTitle:'Every mistake leaves a clue.', reviewDesc:'Revisit the concepts you’re still building. Read the explanation, then practice again. Correct answers clear your list.', practiceMistakes:'Practice these questions →', emptyTitle:'A clear review list', emptyDesc:'Complete a practice session. Concepts that need another look will appear here automatically.', backupTitle:'Back up and sync progress', backupDesc:'Download a local copy, or sign in with Google to continue on another device.', downloadBackup:'Download progress backup ↓', restoreBackup:'Restore from backup', cloudTitle:'Private cloud sync', localVersion:'Last studied here', cloudVersion:'Last synced', cloudSync:'Sync now', googleLogin:'Sign in with Google', cloudLogout:'Sign out', cloudNote:'Syncs automatically once you sign in. Every read and answer keeps its time; sync keeps the newer change for each question, so progress from different devices is combined instead of overwritten.', reset:'Clear learning progress', confirmReset:'Clear all reading and practice records? When signed in, this also clears them on your other devices. This cannot be undone.', localNote:'Progress is saved in this browser and syncs across devices once you sign in', source:'Source on GitHub ↗', storageError:'This browser cannot save your progress. You can keep learning, but progress may be lost when you reload.'
  }
};
const key = 'vla-knowledge-lab-v1';
const languageKey = 'vla-knowledge-lab-language';
const updatedKey = `${key}-updated-at`;
const recordsKey = `${key}-records`;
const emptyStore = () => ({read:[], wrong:[], right:0, attempts:0, answers:{}, earlier:{attempts:0, right:0}});
function validStore(saved) {
  if (!saved || !Number.isInteger(saved.attempts) || saved.attempts < 0 || !Number.isInteger(saved.right) || saved.right < 0 || saved.right > saved.attempts) return null;
  const known = id => Number.isInteger(id) && id >= 0 && id < bankZh.length;
  const tally = v => { const attempts = Number.isInteger(v?.attempts) && v.attempts >= 0 ? v.attempts : 0; return {attempts, right:Number.isInteger(v?.right) && v.right >= 0 ? Math.min(v.right, attempts) : 0}; };
  const answers = Object.fromEntries(Object.entries(saved.answers && typeof saved.answers === 'object' ? saved.answers : {}).filter(([id]) => known(Number(id))).map(([id, v]) => [id, tally(v)]));
  // Totals saved before per-question counts existed are kept as-is under `earlier`.
  const earlier = tally(saved.answers ? saved.earlier : saved), all = [earlier, ...Object.values(answers)];
  const result = {...emptyStore(), answers, earlier, right:all.reduce((n, v) => n + v.right, 0), attempts:all.reduce((n, v) => n + v.attempts, 0)};
  for (const field of ['read','wrong']) result[field] = [...new Set((Array.isArray(saved[field]) ? saved[field] : []).filter(known))];
  return result;
}
// Synced per-item records: read:<id> {read}, quiz:<id> {attempts, right, wrong}, earlier {attempts, right}; each carries `at`.
function toRecords(s) {
  const out = {};
  for (const id of s.read) out[`read:${id}`] = {read:true};
  for (const id of new Set([...Object.keys(s.answers).map(Number), ...s.wrong])) out[`quiz:${id}`] = {attempts:s.answers[id]?.attempts || 0, right:s.answers[id]?.right || 0, wrong:s.wrong.includes(id)};
  if (s.earlier.attempts) out.earlier = {...s.earlier};
  return out;
}
function fromRecords(value) {
  const s = {...emptyStore(), earlier:{}};
  for (const [name, r] of Object.entries(ProgressRecords.live(value))) {
    const [kind, id] = name.split(':');
    if (kind === 'read' && r.read) s.read.push(Number(id));
    if (kind === 'quiz') { s.answers[id] = r; if (r.wrong) s.wrong.push(Number(id)); }
    if (name === 'earlier') s.earlier = r;
  }
  return validStore(s);
}
// Data saved before records existed is dated by its last update; corrupt records fall back to that snapshot.
function loadRecords() {
  const saved = localStorage.getItem(recordsKey), legacy = localStorage.getItem(key), legacyAt = Number(localStorage.getItem(updatedKey)) || 0;
  try { if (saved) return ProgressRecords.clean(JSON.parse(saved)); } catch {}
  let old = null; try { old = validStore(JSON.parse(legacy)); } catch {}
  return ProgressRecords.stamp({}, toRecords(old || emptyStore()), legacyAt);
}
let store = emptyStore(), lang = 'zh', records = {};
try {
  const saved = JSON.parse(localStorage.getItem(key));
  store = validStore(saved) || store;
  if (localStorage.getItem(languageKey) === 'en') lang = 'en';
} catch { /* Keep learning available when browser storage is blocked or corrupt. */ }
try { records = loadRecords(); store = fromRecords(records); } catch {}
let filter = 'all', exam = [], cursor = 0, score = 0, selected = null, answered = false;
const $ = id => document.getElementById(id);
const t = (key, ...args) => typeof copy[lang][key] === 'function' ? copy[lang][key](...args) : copy[lang][key];
const bank = () => lang === 'en' ? bankEn : bankZh;
const categories = [...new Set(bankZh.map(q => q[0]))];
const categoryName = id => id === 'all' ? t('all') : bank()[bankZh.findIndex(q => q[0] === id)][0];
function escapeHTML(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function save(key, value) {
  try { localStorage.setItem(key, value); return true; }
  catch { $('storageNotice').classList.remove('hide'); return false; }
}
function persist() {
  let before = null; try { before = loadRecords(); } catch {} // read first: before records exist they derive from `key`
  if (save(key, JSON.stringify(store))) {
    const updatedAt=Date.now();
    if (before) { records = ProgressRecords.stamp(before, toRecords(store), updatedAt); save(recordsKey, JSON.stringify(records)); }
    save(updatedKey,String(updatedAt));
    window.markProgressDirty?.();
  }
  updateHome();
}
// Cloud sync and other tabs hand over merged records here.
window.vlaProgress = {
  records: loadRecords,
  fromLegacy: (value, at) => ProgressRecords.stamp({}, toRecords(validStore(value) || emptyStore()), at),
  apply(value) {
    save(recordsKey, JSON.stringify(value));
    records = value; store = fromRecords(value);
    save(key, JSON.stringify(store));
    updateHome(); renderLearn(); renderReview();
  },
};
window.addEventListener?.('storage', event => { if (event.key === recordsKey) try { vlaProgress.apply(loadRecords()); } catch {} });
function when(name) {
  const at = ProgressRecords.live(records)[name]?.at;
  return at ? ` · ${new Date(at).toLocaleString(lang==='en'?'en':'zh-TW',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}` : '';
}
function backupData() { return {version:2,app:'vla-knowledge-lab',exportedAt:new Date().toISOString(),progress:store,records}; }
function exportProgress() {
  const blob=new Blob([JSON.stringify(backupData(),null,2)],{type:'application/json'}), link=document.createElement('a');
  link.href=URL.createObjectURL(blob); link.download='vla-knowledge-progress.json'; link.click();
  setTimeout(()=>URL.revokeObjectURL(link.href),1000);
}
function restoreProgressBackup(value) {
  if (value?.app !== 'vla-knowledge-lab' || ![1,2].includes(value.version)) throw Error(lang==='zh'?'不是可用的 VLA Knowledge Lab 備份。':'This is not a supported VLA Knowledge Lab backup.');
  const restored=validStore(value.progress);
  if (!restored) throw Error(lang==='zh'?'備份中的進度格式不正確。':'The progress data in this backup is invalid.');
  store=restored; exam=[]; answered=false; persist(); backToSetup(); renderLearn(); renderReview();
}
async function importProgress(event) {
  const file=event.target.files[0]; if (!file) return;
  try {
    const value=JSON.parse(await file.text());
    if (!confirm(lang==='zh'?'還原會覆蓋這台裝置目前的學習進度。確定繼續？':'Restoring will replace the learning progress on this device. Continue?')) return;
    restoreProgressBackup(value);
    $('progressBackupStatus').textContent=lang==='zh'?'進度已成功還原。':'Progress restored successfully.';
  } catch (error) { $('progressBackupStatus').textContent=(lang==='zh'?'還原失敗：':'Restore failed: ')+error.message; }
  finally { event.target.value=''; }
}
function setLanguage(value) {
  lang = value;
  save(languageKey, lang);
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant';
  document.title = `VLA Knowledge Lab — ${lang === 'en' ? 'The Physical AI Field Guide' : 'Physical AI 學習手冊'}`;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (el.dataset.i18n === 'heroTitle') el.innerHTML = t('heroTitle');
    else el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-placeholder]').forEach(el => el.placeholder = t(el.dataset.placeholder));
  document.querySelectorAll('[data-alt]').forEach(el => el.alt = t(el.dataset.alt));
  document.querySelectorAll('[data-lang]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.lang === lang)));
  const category = $('quizCategory').value || 'all';
  $('quizCategory').innerHTML = ['all', ...categories].map(id => `<option value="${escapeHTML(id)}">${escapeHTML(categoryName(id))}</option>`).join('');
  $('quizCategory').value = category;
  renderLearn(); renderReview(); updateHome();
  if (!$('quizRunning').classList.contains('hide')) renderQuestion();
  if (!$('quizResult').classList.contains('hide')) renderResult();
}
function showTab(name) {
  if (!['home','learn','quiz','review'].includes(name)) return;
  document.querySelectorAll('main>section').forEach(el => el.classList.toggle('hide', el.id !== name));
  document.querySelectorAll('#nav button').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === name);
    if (el.dataset.tab === name) el.setAttribute('aria-current','page'); else el.removeAttribute('aria-current');
  });
  if (name === 'learn') renderLearn();
  if (name === 'review') renderReview();
  window.scrollTo(0,0);
}
function updateHome() {
  $('total').textContent = bankZh.length;
  $('readCount').textContent = `${store.read.length} / ${bankZh.length}`;
  $('accuracy').textContent = store.attempts ? `${Math.round(100 * store.right / store.attempts)}%` : '—';
}
function markRead(id) {
  store.read = store.read.includes(id) ? store.read.filter(x => x !== id) : [...store.read, id];
  persist();
  const button = document.querySelector(`[data-read="${id}"]`);
  if (button) { button.textContent = t(store.read.includes(id) ? 'readDone' : 'markRead') + (store.read.includes(id) ? when(`read:${id}`) : ''); button.classList.toggle('read', store.read.includes(id)); button.setAttribute('aria-pressed', String(store.read.includes(id))); }
}
const openLessons = new Set();
function rememberLesson(id, open) {
  if (open) openLessons.add(id); else openLessons.delete(id);
}
function lessonSources(id) {
  const sources = learningNotes[id].sources;
  if (!sources) return '';
  return `<div class="lesson-sources"><b>${t('officialSources')}</b>${sources.map(([url,zh,en]) => `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(lang==='zh'?zh:en)} ↗</a>`).join('')}</div>`;
}
function lesson(id, withRead = true) {
  const q = bank()[id], read = store.read.includes(id);
  return `<details class="item visual-lesson" data-lesson="${id}" ontoggle="rememberLesson(${id},this.open)" ${openLessons.has(id)?'open':''}>
    <summary class="lesson-summary"><span class="row"><span class="tag">${learningIcon(['book','layers','robot','memory','action'][categories.indexOf(bankZh[id][0])])}${escapeHTML(q[0])}</span><small>Q${String(id+1).padStart(2,'0')}${withRead ? '' : when(`quiz:${id}`)}</small></span><h3>${escapeHTML(q[1])}</h3><span class="lesson-toggle" aria-hidden="true"><span class="lesson-expand">+</span><span class="lesson-collapse">−</span></span></summary>
    <div class="lesson-body"><div class="lesson-takeaway"><span>${t('shortAnswer')}</span><p>${escapeHTML(learningNotes[id][lang][0])}</p></div>${lessonVisual(id)}${lessonSources(id)}
    <div class="lesson-details"><div class="answer">${escapeHTML(q[2])}</div><div class="interview-note">${learningIcon('action')}<div><b>${t('interview')}</b><p>${escapeHTML(q[5])}</p></div></div></div>
    <div class="lesson-footer"><small>${t('readHint')}</small>${withRead ? `<button class="btn ${read?'read':''}" data-read="${id}" aria-pressed="${read}" onclick="markRead(${id})">${t(read?'readDone':'markRead')}${read?when(`read:${id}`):''}</button>` : ''}</div></div>
  </details>`;
}
function renderLearn() {
  const search = $('search').value.trim().toLowerCase();
  $('chapters').innerHTML = ['all', ...categories].map(id => `<button class="chip ${filter===id?'active':''}" data-category="${escapeHTML(id)}" aria-pressed="${filter===id}">${escapeHTML(categoryName(id))}<span>${id==='all'?bankZh.length:bankZh.filter(q=>q[0]===id).length}</span></button>`).join('');
  document.querySelectorAll('[data-category]').forEach(el => el.onclick = () => {filter = el.dataset.category; renderLearn();});
  const ids = bankZh.map((_,id)=>id).filter(id => (filter==='all'||bankZh[id][0]===filter) && `${bankZh[id].flat().join(' ')} ${bankEn[id].flat().join(' ')} ${learningNotes[id].zh.flat(2).join(' ')} ${learningNotes[id].en.flat(2).join(' ')}`.toLowerCase().includes(search));
  $('resultCount').textContent = t('results', ids.length);
  $('lessonList').innerHTML = ids.length ? ids.map(id => lesson(id)).join('') : `<div class="empty-state"><p>${t('noResults')}</p></div>`;
}
function startQuiz(reviewOnly = false) {
  const category = $('quizCategory').value;
  exam = reviewOnly ? [...store.wrong] : bankZh.map((_,id)=>id).filter(id => category==='all'||bankZh[id][0]===category);
  for (let i=exam.length-1; i>0; i--) { const j=Math.floor(Math.random()*(i+1)); [exam[i],exam[j]]=[exam[j],exam[i]]; }
  if (!reviewOnly) exam = exam.slice(0, Number($('quizCount').value));
  if (!exam.length) return;
  cursor=0; score=0; selected=null; answered=false;
  showTab('quiz');
  $('quizSetup').classList.add('hide'); $('quizResult').classList.add('hide'); $('quizRunning').classList.remove('hide');
  renderQuestion();
}
function renderQuestion() {
  const q = bank()[exam[cursor]];
  $('quizProgress').textContent = t('progress',cursor+1,exam.length);
  $('quizScore').textContent = t('score',score);
  const progress = Math.round(100*(cursor+(answered?1:0))/exam.length);
  $('quizBar').style.width = `${progress}%`;
  $('quizBar').parentElement.setAttribute('aria-valuenow',progress);
  $('quizBar').parentElement.setAttribute('aria-label',t('quiz'));
  $('quizQuestion').innerHTML = `<span class="tag">${escapeHTML(q[0])}</span><h2>${escapeHTML(q[1])}</h2>`;
  $('quizOptions').innerHTML = q[3].map((option,i) => {
    const state = answered ? i===q[4]?'correct':i===selected?'wrong':'' : '';
    return `<button class="option ${state}" ${answered?'disabled':''} onclick="pick(${i})"><span>${String.fromCharCode(65+i)}.</span><span>${escapeHTML(option)}</span>${state?`<span class="option-state" aria-hidden="true">${state==='correct'?'✓':'×'}</span>`:''}</button>`;
  }).join('');
  $('quizFeedback').classList.toggle('hide',!answered);
  $('nextBtn').classList.toggle('hide',!answered);
  if (answered) {
    $('quizFeedback').innerHTML = `<b>${selected===q[4]?t('correct'):t('incorrect',String.fromCharCode(65+q[4]))}</b><br>${escapeHTML(q[2])}<br><br><b>${t('interview')} · </b>${escapeHTML(q[5])}${lessonSources(exam[cursor])}`;
    $('nextBtn').textContent = t(cursor+1===exam.length?'seeResult':'next');
  }
}
function pick(i) {
  if (answered || !exam.length || !Number.isInteger(i) || i<0 || i>3) return;
  answered=true; selected=i;
  const id=exam[cursor], correct=i===bankZh[id][4];
  const tally = store.answers[id] ||= {attempts:0, right:0};
  store.attempts++; tally.attempts++;
  if (correct) {score++; store.right++; tally.right++; store.wrong=store.wrong.filter(x=>x!==id);}
  else if (!store.wrong.includes(id)) store.wrong.push(id);
  persist(); renderQuestion();
  $('nextBtn').focus({preventScroll:true});
}
function nextQuestion() {
  if (!answered) return;
  cursor++;
  if (cursor<exam.length) {answered=false; selected=null; renderQuestion(); $('quizOptions').querySelector('button').focus({preventScroll:true}); return;}
  $('quizRunning').classList.add('hide'); $('quizResult').classList.remove('hide'); renderResult();
}
function renderResult() {
  $('quizResult').innerHTML = `<div class="eyebrow">SESSION COMPLETE</div><h2>${t('complete')}</h2><div class="metric">${Math.round(score/exam.length*100)}%</div><p>${t('result',score,exam.length)}</p><div class="actions"><button class="btn primary" onclick="backToSetup()">${t('retry')}</button><button class="text-btn" onclick="showTab('review')">${t('review')} →</button></div>`;
}
function backToSetup() { $('quizResult').classList.add('hide'); $('quizRunning').classList.add('hide'); $('quizSetup').classList.remove('hide'); }
function renderReview() {
  $('reviewQuiz').classList.toggle('hide',!store.wrong.length);
  $('reviewList').innerHTML = store.wrong.length ? store.wrong.map(id=>lesson(id,false)).join('') : `<div class="empty-state"><span aria-hidden="true">↺</span><h2>${t('emptyTitle')}</h2><p>${t('emptyDesc')}</p><button class="btn primary" onclick="showTab('quiz')">${t('startQuiz')}</button></div>`;
}
function resetProgress() {
  if (!confirm(t('confirmReset'))) return;
  store=emptyStore(); exam=[]; answered=false; persist(); backToSetup(); renderLearn(); renderReview();
}
document.querySelectorAll('#nav button').forEach(el=>el.addEventListener('click',()=>showTab(el.dataset.tab)));
document.querySelectorAll('[data-lang]').forEach(el=>el.addEventListener('click',()=>setLanguage(el.dataset.lang)));
setLanguage(lang);
showTab('home');
