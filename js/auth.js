import { auth, db } from "./firebase.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import { ref, set } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

import { initTheme } from "./theme.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();

  // LOGIN
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;
      const errorEl = document.getElementById("login-error");
      errorEl.textContent = "";

      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "welcome.html";
      } catch (err) {
        errorEl.textContent = err.message;
      }
    });
  }

  // SIGNUP
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;
      const name = document.getElementById("signup-name").value; // 👈 grab name input
      const errorEl = document.getElementById("signup-error");
      errorEl.textContent = "";

      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        // Create entry in RTDB
        await set(ref(db, "users/" + user.uid), {
          name: name,
          email: user.email,
          uid: user.uid,
          leaderboardrank: 0,
          points: 0
        });

        window.location.href = "welcome.html";
      } catch (err) {
        errorEl.textContent = err.message;
      }
    });
  }

  // LOGOUT
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await signOut(auth);
      window.location.href = "index.html";
    });
  }

  // Redirect if not logged in
  onAuthStateChanged(auth, (user) => {
    if (!user && !["/index.html", "/signup.html"].some(p => window.location.pathname.endsWith(p))) {
      window.location.href = "index.html";
    }
  });
});
