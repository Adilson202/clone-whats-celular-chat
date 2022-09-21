import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0xYx4iOM7FfEmMJt_3C_Tlj9rM8Wf6fk",
  authDomain: "whatsapp-com-chat.firebaseapp.com",
  projectId: "whatsapp-com-chat",
  storageBucket: "whatsapp-com-chat.appspot.com",
  messagingSenderId: "181166821193",
  appId: "1:181166821193:web:b769afe2c07390b2f65498"
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
