// import {initializeApp} from "firebase/app"
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC8dtCm55QCO0Fvrv0SA3ST5ptjiFj_PE8",
  authDomain: "chat-app-dbded.firebaseapp.com",
  projectId: "chat-app-dbded",
  storageBucket: "chat-app-dbded.firebasestorage.app",
  messagingSenderId: "898816765625",
  appId: "1:898816765625:web:39a017449a2aef1182b568",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
