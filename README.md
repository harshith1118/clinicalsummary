# MediSummary

AI-powered clinical note assistant that transforms raw healthcare notes into structured clinical documentation using Google Gemini 3.0 Flash.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://clinicalsummary.vercel.app)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB)](https://reactjs.org/)
[![Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%203.0%20Flash-4285F4)](https://deepmind.google/technologies/gemini/)

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| **📝 Summarize** | Condense clinical notes into 5 key bullet points with an executive overview |
| **📋 SOAP Note** | Generate professional Subjective/Objective/Assessment/Plan format documentation |
| **✅ Checklist** | Extract actionable tasks, prescribed tests, and medications |
| **👤 Patient Mode** | Translate complex medical jargon into plain, understandable English |
| **🔊 Text-to-Speech** | Listen to summaries hands-free with built-in audio synthesis |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with Hooks for state management
- **Vite** for blazing-fast development and builds
- **Bootstrap 5** for responsive, accessible UI
- **CSS3** with custom styling

### Backend
- **Node.js** with Express.js runtime
- **Serverless deployment** on Vercel
- **RESTful API** architecture

### AI Integration
- **Google Gemini 3.0 Flash** for natural language processing
- **Raw fetch API** for low-latency, dependency-free inference
- **Prompt engineering** for specialized medical document formats

---

## 📦 Installation

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/harshith1118/clinicalsummary.git
cd clinicalsummary

# 2. Install frontend dependencies
cd client && npm install

# 3. Install backend dependencies
cd ../server && npm install

# 4. Configure environment variables
# Create server/.env with your Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" > server/.env

# 5. Start development servers

# Terminal 1: Backend (from project root)
npm start

# Terminal 2: Frontend (from client directory)
cd client && npm run dev

# 6. Open http://localhost:5173 in your browser
```

---

## 🚢 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fharshith1118%2Fclinicalsummary)

1. Push repository to GitHub
2. Import project into Vercel
3. Add environment variable:
   - `GEMINI_API_KEY` → Your Google AI Studio API key
4. Deploy — Vercel auto-detects the configuration

---

## 🏗️ Project Structure

```
clinicalsummary/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Main views
│   │   ├── styles/         # Custom CSS
│   │   └── utils/          # Helper functions
│   ├── index.html
│   └── package.json
├── server/                  # Node.js backend
│   ├── api/                # API route handlers
│   ├── services/           # Gemini integration layer
│   ├── .env.example        # Environment template
│   └── package.json
├── vercel.json             # Vercel deployment config
└── README.md
```

---

## 🤖 API Reference

### `POST /api/summarize`

Generates structured clinical summaries.

**Request Body:**
```json
{
  "text": "Raw clinical notes...",
  "mode": "soap" // Options: "summary" | "soap" | "checklist" | "patient"
}
```

**Response:**
```json
{
  "success": true,
  "result": "Structured clinical output...",
  "usage": {
    "tokens": 245,
    "model": "gemini-3.0-flash"
  }
}
```

---

## 📝 Prompt Engineering Highlights

MediSummary uses targeted prompts for each output mode:

| Mode | Prompt Strategy |
|------|-----------------|
| **Summary** | Extract key clinical findings into 5 bullet points + 3-sentence overview |
| **SOAP** | Structure using Subjective/Objective/Assessment/Plan clinical framework |
| **Checklist** | Identify actionable items, prioritize tasks, categorize by urgency |
| **Patient** | Translate to plain English, avoid medical jargon, use analogies |

---

## ⚡ Performance Optimizations

- **Raw fetch API**: Removes SDK overhead, reducing cold start time by ~40%
- **Vercel serverless**: Auto-scaling with zero configuration
- **Lazy loading**: Frontend components load on demand
- **Minified builds**: Production bundle size optimized with Vite

---

## ⚠️ Disclaimer

> **This tool is a clinical aid, not a replacement for professional medical judgment.**
>
> - Always verify AI-generated outputs before clinical use
> - Not approved for real clinical use without human review
> - Intended for documentation assistance, not diagnosis or treatment recommendations
> - Healthcare providers assume full responsibility for final documentation

---

## 📈 Roadmap

- [ ] Multi-language support (Hindi, Spanish)
- [ ] Voice input recognition
- [ ] Integration with EHR systems (Epic, Cerner)
- [ ] Export to PDF/Word formats
- [ ] Collaborative note editing
- [ ] Custom prompt templates

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

**Harshith D**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2)](https://linkedin.com/in/harshith-d-1b6089204)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717)](https://github.com/harshith1118)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335)](mailto:dharshith657@gmail.com)

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://deepmind.google/technologies/gemini/) for cutting-edge LLM capabilities
- [Vercel](https://vercel.com) for seamless serverless deployment
- [React](https://reactjs.org) and [Vite](https://vitejs.dev) communities

---

**Built with ❤️ for healthcare professionals**
