# Firebase Setup Guide

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "dsa-practice-tracker" (or any name you like)
4. Disable Google Analytics (not needed for this project)
5. Click "Create project"

## Step 2: Enable Realtime Database

1. In your Firebase project, click "Realtime Database" in the left sidebar
2. Click "Create Database"
3. Choose a location (e.g., us-central1)
4. **Start in TEST MODE** (we'll secure it later)
5. Click "Enable"

## Step 3: Get Your Firebase Configuration

1. Click the gear icon ⚙️ next to "Project Overview" → "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon `</>`
4. Register your app with a nickname like "DSA Tracker"
5. Copy the `firebaseConfig` object

## Step 4: Update Your Code

Open `src/firebase.js` and replace the placeholder config with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 5: Set Database Rules (Important!)

In Firebase Console → Realtime Database → Rules tab, use these rules:

```json
{
  "rules": {
    "accountability": {
      ".read": true,
      ".write": true
    }
  }
}
```

**Note:** These rules allow anyone to read/write. For better security in production, you should add Firebase Authentication.

## Step 6: Test Your App

1. Run `npm run dev` locally
2. Try adding an entry
3. Check Firebase Console → Realtime Database → Data tab to see if data appears

## Features After Setup

✅ **Real-time sync** - Changes appear instantly on all devices
✅ **Cross-device** - Works on any device with the URL
✅ **Date restrictions** - Only today's date is editable
✅ **Persistent** - Data never gets lost

## Done!

Your tracker now works across all devices and syncs in real-time! 🎉
