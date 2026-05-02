// Temporary script to add yesterday's data
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

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
const database = getDatabase(app);

// Add yesterday's data (May 1, 2026)
const yesterdayData = [{
  name: "Anannya",
  questions: 7,
  timestamp: "2026-05-01T12:00:00.000Z"
}];

const dateRef = ref(database, 'accountability/2026-05-01');
set(dateRef, yesterdayData)
  .then(() => {
    console.log('✅ Successfully added yesterday\'s data!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
