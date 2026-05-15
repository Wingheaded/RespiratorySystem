import { structures } from './structures';
import { generateQuizRound, validateQuizRound } from './quizGenerator';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const quiz = generateQuizRound(structures, { seed: 'respira3d-mvp' });
const validation = validateQuizRound(quiz);

assert(quiz.length === 5, 'generates five questions per round');
assert(validation.ok, validation.errors.join('; '));

const structureCoverage = new Set(quiz.map((question) => question.structureId).filter(Boolean));
assert(structureCoverage.size >= 4, 'covers at least four respiratory structures');

const skills = new Set(quiz.map((question) => question.skill));
assert(skills.has('recall'), 'includes recall questions');
assert(skills.has('understanding'), 'includes understanding questions');
assert(skills.has('application'), 'includes application questions');

const questionTypes = new Set(quiz.map((question) => question.questionType));
assert(questionTypes.has('singleChoice'), 'includes single-choice questions');
assert(questionTypes.has('trueFalse'), 'includes true/false questions');

const trueFalseQuestions = quiz.filter((question) => question.questionType === 'trueFalse');
for (const question of trueFalseQuestions) {
  const structure = structures.find((part) => part.id === question.structureId);
  assert(structure, `true/false question ${question.id} has a source structure`);
  assert(
    question.prompt.toLocaleLowerCase('pt-PT').includes(structure.label.toLocaleLowerCase('pt-PT')),
    `true/false question ${question.id} asks a complete statement about the structure`
  );
}

const quizText = JSON.stringify(quiz);
for (const badText of ['funcao', 'respiracao', 'oxigenio', 'pulmao', 'pulmoes', 'Musculo']) {
  assert(!quizText.includes(badText), `quiz text should use proper pt-PT spelling instead of "${badText}"`);
}

for (const question of quiz) {
  assert(question.prompt.length > 12, `question ${question.id} has a meaningful prompt`);
  assert(question.explanation.length > 20, `question ${question.id} explains the answer`);
  assert(question.correctIndex >= 0, `question ${question.id} has a valid correct index`);
  assert(question.correctIndex < question.options.length, `question ${question.id} correct index is in range`);
  assert(new Set(question.options).size === question.options.length, `question ${question.id} has unique options`);
}
