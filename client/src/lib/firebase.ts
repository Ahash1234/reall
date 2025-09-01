// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC56P2kOni2ejBebs6ft3-wLk25i7lG1KE",
  authDomain: "heavy-82776.firebaseapp.com",
  databaseURL: "https://heavy-82776-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "heavy-82776",
  storageBucket: "heavy-82776.firebasestorage.app",
  messagingSenderId: "322012290556",
  appId: "1:322012290556:web:53962170a05cd33cd26679",
  measurementId: "G-38TVZVYMVR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics };
