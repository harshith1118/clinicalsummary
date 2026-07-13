require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

app.post('/generate', async (req, res) => {
  try {
    if (!apiKey) {
      return res.json({ output: "Set GEMINI_API_KEY in Vercel environment variables to use the AI features." });
    }

    const { mode, note } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let prompt = "";
    const base = "You are a healthcare note assistant. Do not diagnose. Only use the given note. ";

    switch (mode) {
      case 'summary':
        prompt = `${base} Summarize the following clinical note into 5 bullet points and 1 short paragraph.\n\nNote: ${note}`;
        break;
      case 'checklist':
        prompt = `${base} Create a checklist of next steps based on this clinical note. Include follow-up tasks, tests mentioned, medicines mentioned, and missing info (allergies, dates).\n\nNote: ${note}`;
        break;
      case 'patient':
        prompt = `${base} You are a kind and empathetic medical assistant explaining a doctor's note to a patient.\nUse a warm, reassuring tone. Avoid medical jargon or explain it simply.\nStructure:\n### What is happening?\n### What do you need to do?\n### When to call the doctor?\n### Next Steps\nEnd with a reassuring sentence.\n\nNote: ${note}`;
        break;
      case 'soap':
        prompt = `${base} Transform the following clinical note into SOAP format.\n### Subjective (S)\n### Objective (O)\n### Assessment (A)\n### Plan (P)\nIf info missing, state \"Not documented\".\n\nNote: ${note}`;
        break;
      default:
        return res.status(400).json({ error: "Invalid mode" });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ output: text });
  } catch (error) {
    res.json({ output: "AI service unavailable. Check your GEMINI_API_KEY or try again later." });
  }
});

module.exports = app;
