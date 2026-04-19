# MindMate

MindMate is an intelligent, compassionate AI journaling wellness application. It provides users with a safe space to log their daily experiences, moods, and emotions, while leveraging the power of Artificial Intelligence to offer warm insights, coping mechanisms, and affirmations based on their entries.

## 🚀 Features

- **Secure Authentication:** User accounts and authorization protected by Firebase Auth.
- **AI-Powered Insights:** Uses the Gemini AI API to deeply analyze journal entries to determine emotional tones, create summaries, provide observations, and give practical coping tips.
- **Weekly Summaries:** Automatically generates an emotional week overview with dominant mood tracking and actionable wellness suggestions.
- **Persistent Storage:** All journal data is securely stored and retrieved using Firebase Firestore.
- **Modern UI:** Built with React and Vite for a fast and dynamic user experience.
- **Protected Routing:** Ensures only authenticated users have access to personal dashboards and journals.

## 🛠️ Technology Stack

- **Frontend:** React 19, React Router v7
- **Build Tool:** Vite
- **Backend / Services:** Firebase (Authentication, Firestore)
- **AI Integration:** Google Gemini API (`gemini-2.5-flash`)

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A Firebase project with Authentication and Firestore enabled
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   ```

2. **Navigate to the core project directory:**
   ```bash
   cd "MindMate"
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Configure Environment Variables:**
   Create a `.env` file in the root folder (`MindMate/.env`) and add your API keys:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Navigate to the app:**
   Open your browser and visit `http://localhost:5173`.

## 📂 Project Structure

- `src/pages/`: Contains main page components (`Dashboard`, `History`, `Insights`, `NewEntry`, `Login`, `Signup`).
- `src/components/`: Contains reusable UI components like `ProtectedRoute`.
- `src/services/`: Services handling external logic (`aiService.js` for Gemini, `firebase.js` for Firebase, `journalService.js` for DB interactions).
- `src/context/`: React Context providers for managing global state (`AuthContext`, `JournalContext`).

## 📜 License

This project is open-source and available under the terms of the MIT License.
