// js/theme.js
export function initTheme() {
  const current = localStorage.getItem("theme");
  if (current === "dark" || (!current && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.body.classList.add("dark");
  }

  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });
}
