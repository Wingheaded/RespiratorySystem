# Respira3D Quiz Generator Agent

The **Respira3D Quiz Generator Agent** creates short, grounded quizzes about the respiratory system for Portuguese K-12 students aged 11-14. For the MVP, it should run without a database and generate questions from the app's existing educational content.

This adapts the fact-first approach from `quiz_agent_walkthrough.md`, but removes the transcript, Firebase, Firestore, and LMS session pieces that are not needed for this project yet.

## 1. MVP Decisions

- **Language**: Portuguese only (`pt-PT`)
- **Audience**: 11-14 years old
- **Quiz length**: 5 questions per round
- **Difficulty**: Mixed
- **Feedback**: Explain the correct answer after each response
- **Database**: Not needed for MVP
- **Network dependency**: Avoid for MVP so the app can stay compatible with the offline-first goal

## 2. Recommended MVP Architecture

For the MVP, the quiz generator should be a deterministic client-side agent rather than a live LLM endpoint.

The agent uses the structured data in `src/data/structures.ts` as its source of truth:

- `label`
- `shortDescription`
- `size`
- `location`
- `primaryFunction`
- `biologyNotes`
- `funFact`

This gives the quiz enough grounded content without needing transcript extraction or external AI calls.

## 3. Adapted Generation Pipeline

### Stage 1: Source Fact Loading

Load the respiratory structures from `src/data/structures.ts`.

Each structure becomes a small set of grounded facts:

```ts
type QuizFact = {
  id: string;
  structureId: PartId;
  factType: 'identity' | 'location' | 'function' | 'mechanism' | 'comparison' | 'funFact';
  fact: string;
  explanation: string;
};
```

Example:

```ts
{
  id: 'alveoli-function',
  structureId: 'alveoli',
  factType: 'function',
  fact: 'Os alveolos trocam oxigenio e dioxido de carbono.',
  explanation: 'Nos alveolos, o oxigenio passa do ar para o sangue, enquanto o dioxido de carbono sai do sangue para ser expirado.'
}
```

### Stage 2: Fact Filtering

Pick facts that are appropriate for the age band:

- Prefer concrete anatomy and function
- Avoid overly technical wording
- Avoid tiny details unless they are already explained in the app
- Keep each explanation short and readable

### Stage 3: Heuristic Blueprinting

Create 5 blueprints per quiz round.

Each round should mix:

- **Recall**: name, location, or direct function
- **Understanding**: how air moves or why a structure matters
- **Application**: choose the structure involved in a simple situation
- **True/False**: quick check of a clear fact
- **Comparison**: difference between paired ideas, when available

Example blueprint set:

```ts
[
  { skill: 'recall', questionType: 'singleChoice', factType: 'location' },
  { skill: 'recall', questionType: 'singleChoice', factType: 'function' },
  { skill: 'understanding', questionType: 'trueFalse', factType: 'mechanism' },
  { skill: 'application', questionType: 'singleChoice', factType: 'function' },
  { skill: 'understanding', questionType: 'singleChoice', factType: 'comparison' }
]
```

### Stage 4: Question Synthesis

Generate questions from templates instead of an LLM call.

Example templates:

- `Qual e a principal funcao de {label}?`
- `Onde se localiza {label}?`
- `Que estrutura ajuda o ar a entrar e sair dos pulmoes?`
- `Verdadeiro ou falso: {fact}`
- `Que parte do sistema respiratorio corresponde a esta descricao?`

Questions should use simple pt-PT phrasing and avoid trick wording.

### Stage 5: Distractor Selection

For single-choice questions, build incorrect options from other respiratory structures.

Good distractors should be:

- From the same system
- Similar enough to be educational
- Not accidentally correct
- Not longer or more detailed than the correct answer

For example, if the correct answer is `Alveolos`, distractors can include `Bronquiolos`, `Bronquios Principais`, and `Pulmoes`, but the explanation should make the distinction clear.

### Stage 6: Local Validation

Before showing a quiz, validate it locally:

- Exactly 5 questions
- Each question has one correct answer
- No duplicate options inside the same question
- At least 4 different structures appear across the round
- Explanations are present for every question
- No question text is empty or too long for the UI

If validation fails, regenerate the round.

## 4. Quiz Question Type

```ts
type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  structureId?: PartId;
  skill: 'recall' | 'understanding' | 'application';
  questionType: 'singleChoice' | 'trueFalse';
};
```

For MVP, single-choice and true/false are enough. Multiple-answer questions can wait until the app has stronger quiz review UX.

## 5. Client-Side Session Flow

1. User opens Quiz mode.
2. App generates a 5-question round locally.
3. User answers one question at a time.
4. App shows whether the answer is correct.
5. App shows the explanation immediately.
6. User continues to the next question.
7. App shows final score and offers another random round.

No answers need to be hidden from the browser because this is practice, not a formal assessment.

## 6. Future AI Version

A later version can add an LLM-backed generator, but it should keep the same fact-first constraint:

- The model receives only the approved fact bank.
- The model must output JSON matching `QuizQuestion`.
- The app validates every generated question before display.
- A serverless endpoint can be used if API keys are needed.

Possible future stack:

- Vercel Serverless Function
- OpenAI or Gemini API
- No database for normal practice mode
- Optional signed answer token if formal assessment is introduced

## 7. Product Fit

This MVP quiz agent supports the current Respira3D goals:

- Reinforces the 10 main structures
- Uses the same educational copy the student already sees in Explore mode
- Keeps the experience short enough for classroom use
- Preserves the offline-first direction
- Avoids user accounts, progress tracking, and teacher dashboards until they are truly needed

