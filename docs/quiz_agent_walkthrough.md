# Quiz Agent Walkthrough: SSL LMS Knowledge Grounding

The **Quiz Agent** is a sophisticated backend service built with **Firebase Cloud Functions** and the **Google Gemini API**. It is designed to generate high-quality, grounded quizzes directly from video/audio transcripts.

## 1. Core Technology Stack
- **AI Engine**: Google Gemini (`gemini-2.5-flash` model)
- **Integration**: `@google/genai` TypeScript SDK
- **Backend**: Firebase Functions (v2)
- **Database**: Cloud Firestore (for session management and source tracking)
- **Security**: API keys are managed via Firebase Secrets (`GEMINI_API_KEY`)

## 2. The Generation Pipeline (Multi-Stage)

To prevent "hallucinations" and ensure every question is backed by the actual content, the agent uses a 6-stage grounding pipeline.

### Stage 1: Transcript Normalization & Chunking
The raw transcript is often messy. The agent:
1.  Removes filler words (*uhm*, *ah*, *ok*).
2.  Normalizes whitespace and removes timestamps.
3.  Splits the text into logical **chunks** (approx. 1200-1800 characters) to fit the model's optimal context window for detail extraction.

### Stage 2: Grounded Fact Extraction
For each chunk, Gemini is prompted to extract "Explicit Teaching Points."
- **Focus**: Definitions, mechanisms, benefits, cautions, and processes.
- **Exclusion**: Framing language ("In this session..."), speaker greetings, and marketing fluff.
- **Output**: JSON containing the `fact`, the `excerpt` (evidence), and the `factType`.

### Stage 3: Fact Consolidation
The agent takes all extracted facts from all chunks and asks Gemini to pick the **top 10 strongest facts**.
- It removes duplicates or "near-duplicates."
- It ensures "Meta-questions" (e.g., "What is the title of this talk?") are discarded in favor of actual knowledge.

### Stage 4: Heuristic Blueprinting
Unlike simple "generate a quiz" prompts, this agent uses a **deterministic blueprinting logic** in TypeScript.
- It creates **5 blueprints** for the quiz.
- Each blueprint defines:
    - **Target Skill**: Recall, Understanding, or Application.
    - **Question Type**: Single Choice, Multiple Choice, or True/False.
    - **Source Facts**: It assigns specific Fact IDs to each blueprint.
- This ensures the quiz is balanced and covers different parts of the transcript.

### Stage 5: Question Synthesis
Gemini is then given the **Training Title**, the **Consolidated Facts**, and the **Approved Blueprints**.
- **The Constraint**: It is strictly forbidden from using outside knowledge. It must only use the provided facts.
- **Output**: 5 questions formatted as JSON, ready for the LMS.

### Stage 6: Automated Validation & Repair
The agent performs a "Self-Check" after generation:
- **Scoring**: Each question is scored based on lexical overlap with the source facts, length, and specificity.
- **Repair**: If a question is "weak" (e.g., too short or too vague), the agent triggers a **Repair Stage** where Gemini is asked specifically to fix that one question based on the problems identified.
- **Retry**: If the quiz as a whole fails validation, the system retries the full generation (up to 2 times).

## 3. Security & Session Flow

1.  **Request**: The frontend calls the `generateQuiz` function with a `trainingId`.
2.  **Generation**: The pipeline runs, and the "Ground Truth" (correct answers) is stored in a **`quizSessions`** document in Firestore.
3.  **Obfuscation**: The client receives **only** the questions and options. The `correctAnswer` indices are **never** sent to the browser.
4.  **Verification**: When a user submits, a separate function compares their answers against the stored session data.

## 4. Key Implementation Files
- **Logic**: [generateQuiz.ts](file:///d:/Claudia/SkinSelfLove/SSL_LMS/SSL_LLM_Project/functions/src/quiz/generateQuiz.ts)
- **Types**: [types.ts](file:///d:/Claudia/SkinSelfLove/SSL_LMS/SSL_LLM_Project/lms-web/lib/types.ts)
- **Frontend Trigger**: [quiz/page.tsx](file:///d:/Claudia/SkinSelfLove/SSL_LMS/SSL_LLM_Project/lms-web/app/trainings/[trainingId]/quiz/page.tsx)

---
> [!TIP]
> This "Fact-First" approach is much more reliable than standard RAG (Retrieval-Augmented Generation) for quizzes because it forces the model to commit to specific evidence before a single question is even drafted.
