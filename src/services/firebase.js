import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBN4r8Tqn3bS5EquJfnncfD47wkMlnSxGA",
  authDomain: "blitoestoque.firebaseapp.com",
  databaseURL: "https://blitoestoque-default-rtdb.firebaseio.com",
  projectId: "blitoestoque",
  storageBucket: "blitoestoque.appspot.com",
  messagingSenderId: "1019975983840",
  appId: "1:1019975983840:web:b5df8d39f6292ecae7e685",
  measurementId: "G-1H2BZ0CQTR"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);

export { app };