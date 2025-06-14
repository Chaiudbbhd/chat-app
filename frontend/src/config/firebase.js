import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApmvWFP6Rzeu4BarQe3mekzvvXqImk-H4",
  authDomain: "chat-application-8332e.firebaseapp.com",
  projectId: "chat-application-8332e",
  storageBucket: "chat-application-8332e.appspot.com",  // ✅ fixed
  messagingSenderId: "82663221527",
  appId: "1:82663221527:web:e1bc31200bb5fef23b2f52",
  measurementId: "G-ZD5B396616"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Export auth as default
export default auth;
