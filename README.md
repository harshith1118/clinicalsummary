# MediSummary

AI-powered clinical note assistant. Transforms raw healthcare notes into summaries, SOAP notes, checklists, and patient-friendly explanations using Google Gemini 3.0 Flash.

## Features

- **Summarize** — Condense clinical notes into 5 bullet points + overview
- **SOAP Note** — Generate professional Subjective/Objective/Assessment/Plan format
- **Checklist** — Extract actionable tasks, tests, and medications
- **Patient Mode** — Translate medical jargon into plain English
- **Text-to-Speech** — Listen to summaries hands-free

## Tech Stack

- **Frontend:** React 19, Vite, Bootstrap 5
- **Backend:** Node.js, Express (serverless on Vercel)
- **AI:** Google Gemini 3.0 Flash

## Local Development

### Prerequisites
- Node.js 18+
- Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Setup

```bash
# Install dependencies
cd client && npm install
cd ../server && npm install

# Configure environment
# Create server/.env with:
# GEMINI_API_KEY=your_key_here
```

### Run

```bash
# Terminal 1: Backend
npm start

# Terminal 2: Frontend
cd client && npm run dev
```

Open http://localhost:5173

## Deploy to Vercel

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push this repo to GitHub
2. Import into Vercel
3. Add environment variable: `GEMINI_API_KEY`
4. Deploy — Vercel auto-detects the config

## Disclaimer

This tool is a clinical aid, not a replacement for professional judgment. Always verify AI-generated outputs before use. Not for real clinical use without human review.
