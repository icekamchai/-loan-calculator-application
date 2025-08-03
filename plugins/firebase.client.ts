import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBG0tcnejfjyaIGh9IbZIHsCguclvIl0Fg",
  authDomain: "loan-calculator-b4055.firebaseapp.com",
  projectId: "loan-calculator-b4055",
  storageBucket: "loan-calculator-b4055.firebasestorage.app",
  messagingSenderId: "198734748163",
  appId: "1:198734748163:web:a50979505dbd66eb908c36",
  measurementId: "G-Z99MZVJ2C3",
};

export default defineNuxtPlugin((nuxtApp) => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  nuxtApp.provide("auth", auth);
});
