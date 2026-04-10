# Personal Finance Dashboard

A comprehensive, real-time personal finance dashboard built with React, Firebase, Tailwind CSS, and Chart.js.

![Dashboard Preview]() <!-- Add a screenshot URL if desired -->

## Features

- **Authentication:** Secure signup and login using Firebase Auth.
- **Dynamic Dashboard:** Track your total balance, income, and expenses effortlessly.
- **Transaction Management:** Quickly add robust transaction records categorized for both income and expenses.
- **Data Visualizations:** 
  - **Bar Charts:** Compare monthly income vs. expenses at a glance.
  - **Pie Charts:** Break down your expense spending by category.
- **Real-time Sync:** All transactions fetch and sync using Firebase Firestore.
- **Responsive UI:** Tailored with Tailwind CSS for support on full-viewport desktops down to mobile screens.

## Tech Stack

- **Frontend Framework:** React 19 + Vite
- **Styling:** Tailwind CSS 4
- **Storage/Auth:** Firebase Auth & Firestore
- **Charting Library:** Chart.js & react-chartjs-2

## Setup & Installation

Follow these steps to get the project running locally.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pranaykumarsingh06/finance-dashboard.git
   cd finance-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   Open `src/firebase.js` and replace the `firebaseConfig` object with your actual Firebase project settings:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
     // measurementId: "YOUR_MEASUREMENT_ID"
   };
   ```

   Make sure your Firebase project has **Firestore** enabled and proper rules setup. Example:
   ```js
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /accounts/{uid}/transactions/{transactionId} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## License

This project is open-source and available under the [MIT License](LICENSE).
