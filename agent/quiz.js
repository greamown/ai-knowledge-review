const qs = [...window.QUIZ_QUESTIONS];
for (let j = qs.length - 1; j > 0; j--) {
  const k = Math.floor(Math.random() * (j + 1));
  [qs[j], qs[k]] = [qs[k], qs[j]];
}
let index = 0,
  score = 0,
  selected = null,
  locked = false;
const missed = [];
const get = (id) => document.getElementById(id);
const english = () => window.isEnglish?.() === true;
const label = (zh, en) => (english() ? en : zh);
const content = (q) => (english() ? q.en : q);
function render(focus = false) {
  if (index >= qs.length) {
    renderResult();
    return;
  }
  const q = qs[index],
    text = content(q);
  get("counter").textContent = label(
    `第 ${index + 1} / ${qs.length} 題`,
    `QUESTION ${index + 1} / ${qs.length}`,
  );
  get("scoreLive").textContent = label(`答對 ${score} 題`, `${score} correct`);
  get("bar").style.width = `${((index + Number(locked)) / qs.length) * 100}%`;
  get("bar").parentElement.setAttribute(
    "aria-valuenow",
    index + Number(locked),
  );
  get("question").textContent = text.q;
  get("choices").replaceChildren();
  text.choices.forEach((choice, choiceIndex) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.textContent = choice;
    button.setAttribute("aria-pressed", String(selected === choiceIndex));
    button.disabled = locked;
    if (selected === choiceIndex) button.classList.add("selected");
    if (locked && choiceIndex === q.answer) button.classList.add("correct");
    if (locked && choiceIndex === selected && choiceIndex !== q.answer)
      button.classList.add("wrong");
    button.onclick = () => {
      selected = choiceIndex;
      [...get("choices").children].forEach((el, i) => {
        el.classList.toggle("selected", i === selected);
        el.setAttribute("aria-pressed", String(i === selected));
      });
      get("submit").disabled = false;
      get("hint").textContent = label(
        "選好了，就確認答案。",
        "Ready? Confirm your answer.",
      );
    };
    get("choices").appendChild(button);
  });
  get("explain").hidden = !locked;
  get("explain").replaceChildren();
  if (locked) {
    const heading = document.createElement("strong");
    heading.textContent =
      selected === q.answer
        ? label("答對了！", "Correct!")
        : label("再想想這個觀念", "Let’s revisit this idea");
    get("explain").append(
      heading,
      document.createTextNode(
        label("正確答案：", "Correct answer: ") +
          text.choices[q.answer] +
          " — " +
          text.explain,
      ),
    );
  }
  get("submit").hidden = locked;
  get("submit").disabled = selected === null;
  get("submit").textContent = label("確認答案", "Check answer");
  get("next").hidden = !locked;
  get("next").textContent =
    index === qs.length - 1
      ? label("查看結果 ↗", "View results ↗")
      : label("下一題 →", "Next question →");
  get("hint").textContent = locked
    ? ""
    : selected === null
      ? label("請先選擇一個答案。", "Select an answer to continue.")
      : label("選好了，就確認答案。", "Ready? Confirm your answer.");
  if (focus) get("question").focus();
}
function renderResult() {
  const shell = get("quiz");
  shell.replaceChildren();
  const result = document.createElement("div");
  result.className = "scorebox";
  result.innerHTML = `<span class="eyebrow">${label("測驗完成", "PRACTICE COMPLETE")}</span><div class="score">${score}<small> / ${qs.length}</small></div><h2 tabindex="-1">${score >= 12 ? label("基礎很穩，挑戰 System Design 吧。", "Strong foundations. Try system design next.") : score >= 9 ? label("方向對了，再補強幾個觀念。", "On the right track. Strengthen a few ideas.") : label("從核心開始，再練一次。", "Revisit the foundations and try again.")}</h2><div class="result-actions"><a class="btn" href="quiz.html">${label("再測一次", "Try again")} ↗</a><a class="btn secondary" href="learn.html${score >= 12 ? "#system-design" : ""}">${label("繼續學習", "Continue learning")}</a></div>`;
  if (missed.length) {
    const heading = document.createElement("h3");
    heading.textContent = label(
      `值得再看一次的 ${missed.length} 題`,
      `${missed.length} questions to revisit`,
    );
    const list = document.createElement("ul");
    list.className = "review-list";
    missed.forEach((q) => {
      const li = document.createElement("li"),
        title = document.createElement("strong"),
        explanation = document.createElement("p"),
        link = document.createElement("a");
      title.textContent = content(q).q;
      explanation.textContent =
        label("正確答案：", "Correct answer: ") +
        content(q).choices[q.answer] +
        " — " +
        content(q).explain;
      link.href = `learn.html#${q.topic}`;
      link.textContent = label("複習這個主題 ↗", "Review this topic ↗");
      li.append(title, explanation, link);
      list.appendChild(li);
    });
    result.append(heading, list);
  }
  shell.appendChild(result);
  result.querySelector("h2").focus();
}
get("submit").onclick = () => {
  if (selected === null || locked) return;
  locked = true;
  if (selected === qs[index].answer) score++;
  else missed.push(qs[index]);
  render();
  get("next").focus();
};
get("next").onclick = () => {
  index++;
  selected = null;
  locked = false;
  render(true);
};
document.addEventListener("languagechange", () => render());
render();
