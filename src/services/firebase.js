import { initializeApp } from "firebase/app";
import { getAuth, signOut, sendPasswordResetEmail } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBN4r8Tqn3bS5EquJfnncfD47wkMlnSxGA",
  authDomain: "blitoestoque.firebaseapp.com",
  databaseURL: "https://blitoestoque-default-rtdb.firebaseio.com",
  projectId: "blitoestoque",
  storageBucket: "blitoestoque.appspot.com",
  messagingSenderId: "1019975983840",
  appId: "1:1019975983840:web:b5df8d39f6292ecae7e685",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app); // 🔥 ISSO É O PONTO CRÍTICO
export const logout = () => signOut(auth);
export const resetPassword = (email) =>
  sendPasswordResetEmail(auth, email);

export { app };
