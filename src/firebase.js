import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA4aqmcdjKTAgtIdVqXc_VxUilV-UtfYzA",
  authDomain: "dsa-tracker-react-bda9f.firebaseapp.com",
  databaseURL: "https://dsa-tracker-react-bda9f-default-rtdb.firebaseio.com",
  projectId: "dsa-tracker-react-bda9f",
  storageBucket: "dsa-tracker-react-bda9f.firebasestorage.app",
  messagingSenderId: "306960975498",
  appId: "1:306960975498:web:3bb77045cde85a82d84f73",
  measurementId: "G-3M6K18N5DH"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
