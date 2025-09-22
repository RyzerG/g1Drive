import { auth, db } from "./firebase.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { initTheme } from "./theme.js";

let questions = [];
let currentQuestion = 0;
let score = 0;

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  await loadQuestions();
  startQuiz();
});

async function loadQuestions() {
  const res = await fetch("data/questions.json");
  const allQuestions = await res.json();

  // shuffle and pick 25
  shuffleArray(allQuestions);
  questions = allQuestions.slice(0, 25);

  // shuffle answers inside each question
  questions = questions.map(q => {
    const options = [...q.options];
    shuffleArray(options);

    const correctText = q.options[q.correctAnswer];
    const newCorrectIndex = options.indexOf(correctText);

    return {
      ...q,
      options,
      correctAnswer: newCorrectIndex
    };
  });
}

function startQuiz() {
  score = 0;
  currentQuestion = 0;
  showQuestion();
}

function showQuestion() {
  if (currentQuestion >= questions.length) {
    finishQuiz();
    return;
  }

  const q = questions[currentQuestion];
  document.getElementById("question-number").textContent = currentQuestion + 1;
  document.getElementById("total-questions").textContent = questions.length;
  document.getElementById("question-text").textContent = q.question;

  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.dataset.index = i;
    btn.onclick = () => handleAnswer(i, q.correctAnswer, q.explanation || "");
    optionsContainer.appendChild(btn);
  });

  document.getElementById("feedback").innerHTML = "";
}

function handleAnswer(selected, correct, explanation) {
  const options = document.querySelectorAll("#options-container button");

  options.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) {
      btn.style.backgroundColor = "rgba(16,185,129,0.2)";
      btn.innerHTML += " ✅";
    } else if (i === selected) {
      btn.style.backgroundColor = "rgba(239,68,68,0.2)";
      btn.innerHTML += " ❌";
    }
  });

  if (selected === correct) score++;

  const feedback = document.getElementById("feedback");
  feedback.textContent = explanation;

  const contBtn = document.createElement("button");
  contBtn.textContent = "Continue →";
  contBtn.onclick = () => {
    currentQuestion++;
    showQuestion();
  };
  feedback.appendChild(document.createElement("br"));
  feedback.appendChild(contBtn);
}

async function finishQuiz() {
  const user = auth.currentUser;
  if (user) {
    const userRef = ref(db, "users/" + user.uid);
    const snap = await get(userRef);
    if (snap.exists()) {
      const currentPoints = snap.val().points || 0;
      await update(userRef, { points: currentPoints + score });
    }
  }

  sessionStorage.setItem("lastScore", score);
  sessionStorage.setItem("totalQuestions", questions.length);
  window.location.href = "results.html";
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
