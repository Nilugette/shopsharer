import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCKTIXTxYflNQIV7hCu8jRxsZwk58QYq4k",
    authDomain: "shopsharer-app.firebaseapp.com",
    projectId: "shopsharer-app",
    storageBucket: "shopsharer-app.appspot.com",
    messagingSenderId: "586002125178",
    appId: "1:586002125178:web:71f29529e0cf76cb3e06c3"
  };

const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();
