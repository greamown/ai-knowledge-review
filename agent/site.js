let language = "zh";
try {
  language = localStorage.getItem("agent-language") === "en" ? "en" : "zh";
} catch {}
window.isEnglish = () => language === "en";
window.translatePage = () => {
  document.documentElement.lang = isEnglish() ? "en" : "zh-Hant";
  document.querySelectorAll("[data-en]").forEach((el) => {
    if (!el.hasAttribute("data-zh")) el.setAttribute("data-zh", el.innerHTML);
    el.innerHTML = el.getAttribute(isEnglish() ? "data-en" : "data-zh");
  });
  const toggle = document.getElementById("language");
  toggle.innerHTML = `${isEnglish() ? "中文" : "EN"} <span aria-hidden="true">↗</span>`;
  toggle.setAttribute(
    "aria-label",
    isEnglish() ? "切換為繁體中文" : "Switch to English",
  );
  document.dispatchEvent(new Event("languagechange"));
};
document.getElementById("language").addEventListener("click", () => {
  language = isEnglish() ? "zh" : "en";
  try {
    localStorage.setItem("agent-language", language);
  } catch {}
  translatePage();
});
translatePage();
