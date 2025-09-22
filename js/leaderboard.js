import { db } from "./firebase.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { initTheme } from "./theme.js";

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  await loadLeaderboard();
});

async function loadLeaderboard() {
  const snapshot = await get(ref(db, "users"));
  const leaderboardBody = document.getElementById("leaderboard-body");

  leaderboardBody.innerHTML = "";

  if (!snapshot.exists()) {
    leaderboardBody.innerHTML = "<tr><td colspan='3'>No users yet</td></tr>";
    return;
  }

  const users = Object.values(snapshot.val());

  users.sort((a, b) => (b.points || 0) - (a.points || 0));

  users.forEach((u, i) => {
  let rankSymbol = i + 1;
  if (i === 0) rankSymbol = "🏆";
  else if (i === 1) rankSymbol = "🥈";
  else if (i === 2) rankSymbol = "🥉";

  const row = document.createElement("tr");
  row.innerHTML = `
    <td style="font-weight:bold; text-align:center;">${rankSymbol}</td>
    <td>${u.name || "Unknown"}</td>
    <td style="text-align:center;">${u.points || 0}</td>
  `;
  leaderboardBody.appendChild(row);
});

}
