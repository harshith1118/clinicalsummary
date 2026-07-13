require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Debug: Check if API Key is loaded
if (!process.env.GEMINI_API_KEY) {
    console.error("ERROR: GEMINI_API_KEY is missing in .env file");
} else {
    console.log("API Key loaded successfully");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/generate', async (req, res) => {
    try {
        const { mode, note } = req.body;
        console.log(`Processing request: ${mode}`); // Log request mode

        // Updated to Gemini 3 Flash Preview
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        let prompt = "";
        const baseSystemInstruction = "You are a healthcare note assistant. Do not diagnose. Only use the given note. ";

        switch (mode) {
            case 'summary':
                prompt = `${baseSystemInstruction} Summarize the following clinical note into 5 bullet points and 1 short paragraph.

Note: ${note}`;
                break;
            case 'checklist':
                prompt = `${baseSystemInstruction} Create a checklist of next steps based on this clinical note. Include follow-up tasks, tests mentioned, medicines mentioned, and missing info (allergies, dates).


Note: ${note}`;
                break;
            case 'patient':
                prompt = `${baseSystemInstruction} You are a kind and empathetic medical assistant explaining a doctor's note to a patient.

                Your goal is to make them feel calm and understood while explaining clearly.
                Use a warm, reassuring tone. Avoid medical jargon or explain it simply if necessary.      

                Structure your response like this:

                ### What is happening?
                (Explain the diagnosis or situation in simple words)

                ### What do you need to do?
                (Clear instructions on medicines, rest, or lifestyle changes)

                ### When to call the doctor?
                (Warning signs to watch out for)

                ### Next Steps
                (Follow-up appointments or tests)

                End with a reassuring sentence like "You're doing great, take care!"

                Note: ${note}`;
                break;
            case 'soap':
                prompt = `${baseSystemInstruction} Transform the following clinical note into a professional SOAP note format.

                Structure strictly as follows:
                ### Subjective (S)
                (Chief complaint, history of present illness, patient reports)

                ### Objective (O)
                (Vital signs, physical exam findings, lab/test results mentioned)

                ### Assessment (A)
                (Diagnosis or differential diagnosis)

                ### Plan (P)
                (Medications, follow-up, patient education, next steps)

                Use professional medical terminology. If information is missing for a section, state "Not documented".

                Note: ${note}`;
                break;
            default:
                return res.status(400).json({ error: "Invalid mode" });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ output: text });

    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({
            error: `Failed to generate content. Error: ${error.message || error}`
        });
    }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
