# 🏥 MediSummary - Next-Gen Clinical Workspace

**MediSummary** is a futuristic, AI-powered clinical intelligence workspace designed to streamline healthcare documentation. Powered by Google's **Gemini 3.0 Flash**, it transforms raw clinical notes into professional summaries, actionable checklists, SOAP notes, and patient-friendly explanations—all within a stunning "Cosmic Glass" interface.

![AI Model](https://img.shields.io/badge/AI-Gemini%203.0%20Flash-7000FF?style=flat-square)
![Status](https://img.shields.io/badge/status-Live-00FF88?style=flat-square)
![Deployment](https://img.shields.io/badge/deploy-Google%20Cloud-4285F4?style=flat-square)

---

## ✨ Key Features

### 🧠 Advanced AI Modes
1.  **📋 SOAP Note Generator:** Instantly formats raw input into professional **Subjective, Objective, Assessment, Plan** documentation for EHR records.
2.  **📝 Clinical Summary:** Condenses complex notes into 5 key bullet points and a high-level overview.
3.  **✅ Action Checklist:** Auto-generates to-do lists for staff (labs to order, meds to prescribe).
4.  **❤️ Patient (Empathy) Mode:** Translates medical jargon into plain, reassuring English for patients, explaining diagnosis and care instructions.

### 🎨 "Cosmic Glass" UI
*   **Framer-Inspired Aesthetic:** Deep dark mode, neon gradients, and frosted glass cards.
*   **Bento Grid Layout:** Spacious, responsive, and floating card design.
*   **Immersive Experience:** Ambient background glows and fluid animations.

### ⚡ Productivity Tools
*   **🔊 Read Aloud (TTS):** Integrated Text-to-Speech to listen to summaries hands-free.
*   **🧹 Smart Workspace:** One-click "Clear All" to reset for the next patient.
*   **🚀 Instant Sample Data:** "Load Sample" button for quick demos and testing.

---

## 🛠️ Tech Stack

*   **Frontend:** React 18, Vite, Custom CSS (No external UI frameworks).
*   **Backend:** Node.js, Express.
*   **AI Engine:** Google Generative AI SDK (Gemini 3.0 Flash).
*   **Deployment:** Google Cloud Platform (Cloud Run).

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Google Cloud Gemini API Key

### 1. Installation
```bash
git clone https://github.com/your-username/medisummary.git
cd MediSummary
```

### 2. Setup
**One-command setup** (installs both client and server dependencies):
```bash
cd server && npm install && cd ../client && npm install
```

### 3. Configuration
Create a `.env` file in the `server/` directory:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Locally
**Start Backend:**
```bash
cd server
npm start
```
**Start Frontend:**
```bash
cd client
npm run dev
```

---

## ☁️ Deployment (Google Cloud)

Deploy as a single container to Cloud Run:

```bash
gcloud run deploy medisummary \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_API_KEY,PORT=8080
```

---

## ⚠️ Disclaimer
**MediSummary is a clinical aid, not a replacement for professional judgment.** Always verify AI-generated outputs before entering them into official medical records.
