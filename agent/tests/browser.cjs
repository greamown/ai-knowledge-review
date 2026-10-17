const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN || undefined,
    args: ["--no-sandbox"],
  });
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400)
        errors.push(`${response.status()} ${response.url()}`);
    });
    const base = process.env.BASE_URL || "http://127.0.0.1:8765";
    const screenshotDir = process.env.SCREENSHOT_DIR;
    if (screenshotDir) fs.mkdirSync(screenshotDir, { recursive: true });
    async function fits() {
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        "Page should fit the viewport",
      );
    }
    for (const width of [1440, 768, 390, 360]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of ["index.html", "learn.html", "quiz.html"]) {
        await page.goto(`${base}/${route}`);
        await fits();
        if (screenshotDir && [1440, 390].includes(width)) {
          await page.screenshot({
            path: `${screenshotDir}/${route}-${width}.png`,
            fullPage: true,
            animations: "disabled",
          });
        }
        await page.click("#language");
        assert.equal(await page.getAttribute("html", "lang"), "en");
        await fits();
        await page.click("#language");
      }
    }
    await page.goto(`${base}/learn.html#rag`);
    assert(await page.isVisible("#cloud-progress"));
    assert.equal(await page.getAttribute("#firebaseLogin", "type"), "button");
    assert.equal(await page.locator(".topic:visible").count(), 1);
    assert.equal(await page.inputValue("#topic-filter"), "rag");
    await page.locator("#rag summary").first().click();
    await page.waitForFunction(() =>
      document.getElementById("revealed").textContent.includes("1 / 4"),
    );
    await page.click("#language");
    assert(
      (await page.locator("#rag summary").first().textContent()).includes(
        "conversation history",
      ),
    );
    assert.equal(await page.locator("#rag details[open]").count(), 1);
    const ragQuestion = page.locator("#rag .qa").first();
    assert.equal(await ragQuestion.getAttribute("data-state"), "learning");
    assert.equal(await page.locator('#architecture .qa[data-state="new"]').count(), 2);
    const understoodButton = ragQuestion.locator(".understood-toggle");
    await understoodButton.click();
    assert.equal(await understoodButton.getAttribute("aria-pressed"), "true");
    assert.equal(await page.textContent("#understood"), "Understood 1 / 27 questions");
    assert.equal(await page.getAttribute("#learning-progress", "value"), "1");
    await page.click("#language");
    assert.equal(await understoodButton.textContent(), "✓ 已理解");
    assert.equal(await ragQuestion.locator(".learning-status").count(), 1);
    await understoodButton.focus();
    await page.keyboard.press("Space");
    assert.equal(await understoodButton.getAttribute("aria-pressed"), "false");
    assert.equal(await ragQuestion.getAttribute("data-state"), "learning");
    assert.equal(await page.textContent("#understood"), "已理解 0 / 27 題");
    await understoodButton.click();
    await page.reload();
    assert.equal(await ragQuestion.getAttribute("data-state"), "understood");
    assert.equal(await page.getAttribute("#learning-progress", "value"), "1");
    const downloadPromise = page.waitForEvent("download");
    await page.click("#progress-export");
    const download = await downloadPromise;
    const backup = JSON.parse(fs.readFileSync(await download.path(), "utf8"));
    assert.equal(download.suggestedFilename(), "agent-knowledge-progress.json");
    assert.equal(backup.app, "agent-knowledge");
    assert.equal(Object.values(backup.learning).filter((state) => state === "understood").length, 1);
    assert.equal(await page.locator('#architecture .qa[data-state="new"]').count(), 2);
    await page.selectOption("#topic-filter", "architecture");
    assert.equal(await page.getAttribute("#learning-progress", "value"), "1", "Progress includes all topics");
    await page.locator("#progress-import").setInputFiles({
      name: "invalid.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify({ version: 1, app: "agent-knowledge", learning: { question: "tampered" } })),
    });
    assert.equal(await page.getAttribute("#learning-progress", "value"), "1");
    assert((await page.textContent("#progress-backup-status")).includes("不是有效"));
    page.once("dialog", (dialog) => dialog.accept());
    await page.locator("#progress-import").setInputFiles({
      name: "agent-knowledge-progress.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify({ version: 1, app: "agent-knowledge", learning: {} })),
    });
    assert.equal(await page.getAttribute("#learning-progress", "value"), "0");
    assert((await page.textContent("#progress-backup-status")).includes("已還原"));
    await page.click("#language");
    await page.selectOption("#topic-filter", "all");
    assert.equal(await page.locator(".qa").count(), 27);
    assert.equal(await page.locator(".qa summary[data-en]").count(), 27);
    assert.equal(await page.locator(".qa .answer[data-en]").count(), 27);
    assert.equal(await page.locator(".topic:visible").count(), 12);
    // Exercise expanded content, not just the collapsed question list.
    for (const width of [1440, 768, 390, 360]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const lang of ["en", "zh-Hant"]) {
        if ((await page.getAttribute("html", "lang")) !== lang)
          await page.click("#language");
        for (let i = 0; i < 27; i++) {
          const qa = page.locator(".qa").nth(i);
          if ((await qa.getAttribute("open")) === null)
            await qa.locator("summary").click();
          assert.equal(await qa.locator(".answer-core p").count(), 1);
          assert.equal(await qa.locator(".answer-visual").count(), 1);
          assert.equal(await qa.locator(".answer-prompt p").count(), 1);
          await fits();
          await qa.locator("summary").click();
        }
      }
    }
    if (screenshotDir) {
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.selectOption("#topic-filter", "rag");
        for (const summary of await page.locator("#rag summary").all())
          await summary.click();
        await page.screenshot({
          path: `${screenshotDir}/expanded-rag-${width}.png`,
          fullPage: true,
        });
        for (const summary of await page.locator("#rag summary").all())
          await summary.click();
      }
      await page.selectOption("#topic-filter", "all");
    }
    if ((await page.getAttribute("html", "lang")) !== "en")
      await page.click("#language");
    await page.goto(`${base}/quiz.html`);
    assert.equal(
      await page.getAttribute("html", "lang"),
      "en",
      "Language should persist across pages",
    );
    assert(await page.isDisabled("#submit"));
    const data = await page.evaluate(() => window.QUIZ_QUESTIONS);
    assert.equal(data.length, 15);
    for (const q of data) {
      assert.equal(q.choices.length, 4);
      assert.equal(q.en.choices.length, 4);
      assert(q.answer >= 0 && q.answer < 4);
    }
    let firstQuestion;
    for (let i = 0; i < data.length; i++) {
      const text = await page.textContent("#question");
      const q = data.find((q) => q.en.q === text);
      assert(q, "Every displayed question must have an English translation");
      const choice = i === 0 ? (q.answer + 1) % 4 : q.answer;
      await page.locator(".choice").nth(choice).click();
      if (i === 0) {
        firstQuestion = q;
        await page.click("#language");
        assert.equal(await page.textContent("#question"), q.q);
        assert.equal(
          await page.locator('.choice[aria-pressed="true"]').count(),
          1,
        );
        await page.click("#language");
      }
      await page.click("#submit");
      assert.equal(await page.locator(".choice.correct").count(), 1);
      assert.equal(await page.locator(".choice:disabled").count(), 4);
      assert(await page.isVisible("#explain"));
      if (i === 0) {
        await page.click("#language");
        assert((await page.textContent("#explain")).includes(q.explain));
        await page.click("#language");
      }
      await page.click("#next");
    }
    assert((await page.textContent(".score")).includes("14"));
    assert.equal(await page.locator(".review-list li").count(), 1);
    assert.equal(
      await page.getAttribute(".review-list a", "href"),
      `learn.html#${firstQuestion.topic}`,
    );
    await page.click("#language");
    assert((await page.textContent(".review-list")).includes(firstQuestion.q));
    assert((await page.textContent(".score")).includes("14"));
    await page.click(".result-actions .btn");
    assert(await page.isDisabled("#submit"));
    assert((await page.textContent("#scoreLive")).includes("0"));
    assert.deepEqual(errors, []);
    // Storage can be unavailable when opening static files or under privacy settings.
    const noStorage = await browser.newContext();
    await noStorage.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("Storage blocked");
        },
      });
    });
    const fallback = await noStorage.newPage();
    const fallbackErrors = [];
    fallback.on("pageerror", (error) => fallbackErrors.push(error.message));
    await fallback.goto(`${base}/learn.html`);
    await fallback.click("#language");
    assert.equal(await fallback.getAttribute("html", "lang"), "en");
    assert(
      (await fallback.locator("summary").first().textContent()).includes(
        "AI agent",
      ),
    );
    await fallback.locator("summary").first().click();
    await fallback.locator(".understood-toggle").first().click();
    assert.equal(await fallback.getAttribute("#learning-progress", "value"), "1");
    assert(await fallback.isVisible("#progress-storage"));
    assert.deepEqual(fallbackErrors, []);
    await noStorage.close();
    // Corrupt progress must not prevent studying or saving a fresh state.
    await page.evaluate(() => localStorage.setItem("agent-learning", "{broken"));
    await page.goto(`${base}/learn.html`);
    assert.equal(await page.getAttribute("#learning-progress", "value"), "0");
    await page.locator("summary").first().click();
    await page.locator(".understood-toggle").first().click();
    assert.equal(await page.getAttribute("#learning-progress", "value"), "1");
    assert(await page.isHidden("#progress-storage"));
    assert.deepEqual(errors, []);
    console.log(
      "Passed: responsive layouts, both languages, learning states, saved progress, keyboard undo, study filters, full quiz, review links, restart, blocked/corrupt storage, and page errors.",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
