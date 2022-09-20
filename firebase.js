import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABZezTGQzIogMwAmmGy6-KZt28NpLP7bc",
  authDomain: "whatsapp-clone-82271.firebaseapp.com",
  projectId: "whatsapp-clone-82271",
  storageBucket: "whatsapp-clone-82271.appspot.com",
  messagingSenderId: "832888188143",
  appId: "1:832888188143:web:058e5fe2f98c0798f6ff1a"
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
