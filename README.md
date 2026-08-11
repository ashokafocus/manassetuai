ManasSetu AI 🧠🎙️

A Voice-Native, Multilingual Clinical Intake Agent for Psychiatry in Bharat.

📖 The Vision

Psychiatrists in India are burning out. A proper Biopsychosocial history takes 45 to 60 minutes, turning doctors into data-entry clerks rather than clinicians. Furthermore, Western mental health apps require high English literacy and typing skills, which alienates the vast majority of patients in Tier-2, Tier-3, and rural settings in India.

ManasSetu solves this. It is a multilingual, voice-first clinical intake assistant that conducts a comprehensive psychiatric interview with the patient in their native tongue before they step into the doctor's cabin.

🚀 Key Features

Zero-Typing UI (Voice-Native): Designed for low-tech literacy. Patients simply tap a microphone and speak naturally.

Multilingual Support: Currently mapped for English, Hindi, Telugu, Tamil, Kannada, and Malayalam.

The "Idioms of Distress" Engine: Our proprietary clinical mapping. If a patient says "Gas is rising to my head" in a regional language, ManasSetu does not translate literally to gastroenterology; it culturally translates to its true psychiatric vector: Somatic Anxiety.

Asynchronous Translation: The patient speaks in pure regional language. The AI validates the psychiatric vectors and prints a structured, professional English Medical Report for the Doctor.

🏗️ Technical Architecture

ManasSetu is built with a frugal, hyper-fast stack designed to load instantly on 3G village networks.

Frontend: Vanilla HTML5, CSS3 (Tailwind-inspired), and pure JavaScript.

Voice Engine: Web Speech API (SpeechRecognition & SpeechSynthesis) with custom Anti-Freeze fail-safes.

Backend (V3 Roadmap): Vercel Serverless Functions.

LLM Engine (V3 Roadmap): Google Gemini 1.5 Flash (Optimized for Indic languages and structured JSON output).

Database (V3 Roadmap): Firebase Firestore (HIPAA/DPDP compliant).

🩺 Clinical Guardrails

This AI acts as a Digital Junior Psychiatric Resident adhering strictly to the Kaplan & Sadock comprehensive psychiatric history framework.

Never Diagnoses: The AI only gathers data; it does not diagnose conditions.

Never Prescribes: The AI does not offer medical advice or suggest medications.

Red Flag Interrupt: Built-in safeguards to pause standard intake and flag severe risks (e.g., suicidality, abuse) directly to the physician.

🛠️ How to Run Locally (V2 Prototype)

To run the current V2 frontend prototype:

Clone this repository:

git clone https://github.com/your-username/manassetu-clinical-ai.git

Open the ai2.html (or ai2_robust_mic.html) file directly in any modern browser (Google Chrome highly recommended for Web Speech API support).

Allow microphone permissions when prompted.

Select a language, tap the microphone, and begin speaking.

🤝 About the Architect

Dr. P. Rama Krishna Reddy Pydala is a practicing psychiatrist and full-stack AI-native builder. Realizing that traditional software agencies could not grasp the nuance of clinical linguistics and cultural idioms, he architected ManasSetu to bridge the gap between rural patients and specialized psychiatric care.

ManasSetu: Because language should never be a barrier to being heard.
