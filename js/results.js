import { initTheme } from "./theme.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();

  const score = sessionStorage.getItem("lastScore");
  const total = sessionStorage.getItem("totalQuestions");

  document.getElementById("final-score").textContent = score ?? "0";
  document.getElementById("final-total").textContent = total ?? "0";
});
