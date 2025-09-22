// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDprV2kb1r0vCh-YqO2BpPR4CxdP0Yn8yo",
  authDomain: "g1driver.firebaseapp.com",
  databaseURL: "https://g1driver-default-rtdb.firebaseio.com",
  projectId: "g1driver",
  storageBucket: "g1driver.firebasestorage.app",
  messagingSenderId: "1025497588378",
  appId: "1:1025497588378:web:7e70da8f30f2804ca13523"
};


// Init Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
