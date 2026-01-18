# MediSummary
> **Transforming messy clinical notes into professional documentation and patient clarity with Gemini 3.0 Flash.**

## About the Project

### 🏥 Inspiration: The "Invisible Patient"
In modern healthcare, there is a silent crisis known as the "2:1 ratio." For every hour a physician spends face-to-face with a patient, they spend nearly two hours tethered to a keyboard, documenting the encounter. This administrative burden is a primary driver of physician burnout and, more importantly, it makes the patient feel "invisible" during their own appointment. 

We built **MediSummary** to turn the doctor's focus back to the human in the room. By leveraging the low-latency reasoning of **Gemini 3.0 Flash**, we aimed to create a "Clinical Intelligence Partner" that listens to the raw, messy narrative of a consultation and instantly structures it into professional, actionable data.

### 🛠️ How We Built It
The project is architected as a full-stack workspace designed for speed and clarity:
*   **The Brain:** We utilized the `gemini-3-flash-preview` model via the Google Generative AI SDK. Its ability to process long-context clinical notes while maintaining high reasoning capabilities allowed us to implement complex features like **SOAP Note generation** and **Checklist extraction** with minimal prompt tuning.
*   **The Interface:** We moved away from traditional "clinical" (cold/white) UIs. Instead, we developed a **"Cosmic Glass" aesthetic** using React 19 and custom CSS. This dark-mode, bento-grid layout reduces eye strain for providers working night shifts and prioritizes information hierarchy.
*   **The Accessibility:** We integrated the Web Speech API to provide **Text-to-Speech (TTS)**, allowing doctors to listen to summaries while prepping for their next patient, effectively multitasking without increasing cognitive load.

### 📊 Mathematical Efficiency
The core value proposition can be viewed through the lens of time-to-documentation ($T_d$): 
If $T_m$ is the time spent on manual documentation and $T_a$ is the time spent on AI-assisted documentation, we observe:
$$T_a \approx 0.15 \times T_m$$
By reducing the documentation overhead, we increase the **Patient Interaction Ratio ($R_p$)**:
$$R_p = \frac{T_{patient}}{T_{doc} + T_{patient}}$$
Our goal was to move $R_p$ from $0.33$ toward $0.85$.

### ⚠️ Challenges We Faced
1.  **The "Jargon Gap":** One of our biggest hurdles was "Patient Mode." We had to engineer prompts that could translate high-level medical terms (e.g., *"Myocardial Infarction"*) into empathetic, non-alarming language (*"A situation where your heart muscle needed more oxygen"*) without losing the medical urgency.
2.  **Structuring the Unstructured:** Clinical notes are often a "stream of consciousness." Ensuring the AI correctly categorized data into the **SOAP** (Subjective, Objective, Assessment, Plan) format required rigorous system instructions to avoid "hallucinating" vitals that weren't present.

### 💡 What We Learned
We learned that AI in healthcare isn't about *replacing* the doctor's judgment; it's about *removing the friction* of the tools they use. We discovered that small UX details—like a "Read Aloud" button or a "One-Click Copy"—can be just as impactful as the AI model itself when it comes to real-world clinical adoption.
