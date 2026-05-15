import type { PartId, Structure } from './structures';

export type QuizSkill = 'recall' | 'understanding' | 'application';
export type QuizQuestionType = 'singleChoice' | 'trueFalse';

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  structureId?: PartId;
  skill: QuizSkill;
  questionType: QuizQuestionType;
};

type GenerateOptions = {
  seed?: string;
};

type ValidationResult = {
  ok: boolean;
  errors: string[];
};

type Blueprint = {
  skill: QuizSkill;
  questionType: QuizQuestionType;
  build: (structure: Structure, pool: Structure[], rng: () => number, index: number) => QuizQuestion;
};

const DEFAULT_SEED = 'respira3d-quiz';

const hashSeed = (seed: string) => {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const createRng = (seed: string) => {
  let state = hashSeed(seed) || 1;
  return () => {
    state += 0x6d2b79f5;
    let next = state;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
};

const shuffle = <T,>(items: T[], rng: () => number) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
};

const makeOptions = (correct: string, distractors: string[], rng: () => number, count = 4) => {
  const uniqueDistractors = [...new Set(distractors.filter((option) => option !== correct && option.trim()))];
  const selected = shuffle(uniqueDistractors, rng).slice(0, count - 1);
  const options = shuffle([correct, ...selected], rng);
  return {
    options,
    correctIndex: options.indexOf(correct)
  };
};

const trueStatements: Record<PartId, string> = {
  nasal: 'A cavidade nasal é a entrada do ar, onde este é filtrado, aquecido e humedecido.',
  pharynx: 'A faringe é uma passagem comum ao ar e aos alimentos, situada atrás da boca e do nariz.',
  larynx: 'A laringe é a estrutura onde se encontram as cordas vocais.',
  trachea: 'A traqueia é o tubo que liga a laringe aos brônquios.',
  'main-bronchi': 'Os brônquios principais são dois tubos que levam o ar da traqueia para cada pulmão.',
  bronchioles: 'Os bronquíolos são ramificações muito finas dentro dos pulmões.',
  alveoli: 'Os alvéolos são pequenos sacos onde o oxigénio entra no sangue.',
  'right-lung': 'O pulmão direito tem três lobos e situa-se do lado direito do tórax.',
  'left-lung': 'O pulmão esquerdo tem dois lobos e fica junto ao coração.',
  diaphragm: 'O diafragma é o músculo principal da respiração.'
};

const falseStatements: Record<PartId, string> = {
  nasal: 'A cavidade nasal é o local onde ocorre a troca de oxigénio com o sangue.',
  pharynx: 'A faringe é o músculo que faz os pulmões encherem de ar.',
  larynx: 'A laringe fica na base do tórax, por baixo dos pulmões.',
  trachea: 'A traqueia é formada por milhões de pequenos sacos de ar.',
  'main-bronchi': 'Os brônquios principais ficam dentro do nariz e aquecem o ar.',
  bronchioles: 'Os bronquíolos são os dois tubos principais que saem diretamente da traqueia.',
  alveoli: 'Os alvéolos são a parte que produz a voz.',
  'right-lung': 'O pulmão direito tem dois lobos e é mais pequeno do que o esquerdo.',
  'left-lung': 'O pulmão esquerdo tem três lobos e mais espaço por causa do coração.',
  diaphragm: 'O diafragma é um tubo que liga a laringe aos brônquios.'
};

const functionQuestion = (
  structure: Structure,
  pool: Structure[],
  rng: () => number,
  index: number
): QuizQuestion => {
  const { options, correctIndex } = makeOptions(
    structure.primaryFunction,
    pool.map((part) => part.primaryFunction),
    rng
  );

  return {
    id: `function-${structure.id}-${index}`,
    prompt: `Qual é a principal função de ${structure.label}?`,
    options,
    correctIndex,
    explanation: `${structure.label}: ${structure.biologyNotes}`,
    structureId: structure.id,
    skill: 'recall',
    questionType: 'singleChoice'
  };
};

const locationQuestion = (
  structure: Structure,
  pool: Structure[],
  rng: () => number,
  index: number
): QuizQuestion => {
  const { options, correctIndex } = makeOptions(
    structure.location,
    pool.map((part) => part.location),
    rng
  );

  return {
    id: `location-${structure.id}-${index}`,
    prompt: `Onde se localiza ${structure.label}?`,
    options,
    correctIndex,
    explanation: `${structure.label} localiza-se em: ${structure.location}. ${structure.shortDescription}`,
    structureId: structure.id,
    skill: 'recall',
    questionType: 'singleChoice'
  };
};

const trueFalseQuestion = (structure: Structure, rng: () => number, index: number): QuizQuestion => {
  const isTrue = rng() >= 0.5;
  const prompt = `Verdadeiro ou falso: ${isTrue ? trueStatements[structure.id] : falseStatements[structure.id]}`;
  const correctIndex = isTrue ? 0 : 1;

  return {
    id: `true-false-${structure.id}-${index}`,
    prompt,
    options: ['Verdadeiro', 'Falso'],
    correctIndex,
    explanation:
      correctIndex === 0
        ? `${structure.label}: ${structure.biologyNotes}`
        : `Na verdade, ${structure.label} tem como função principal: ${structure.primaryFunction}.`,
    structureId: structure.id,
    skill: 'understanding',
    questionType: 'trueFalse'
  };
};

const applicationQuestion = (
  structure: Structure,
  pool: Structure[],
  rng: () => number,
  index: number
): QuizQuestion => {
  const { options, correctIndex } = makeOptions(
    structure.label,
    pool.map((part) => part.label),
    rng
  );

  return {
    id: `application-${structure.id}-${index}`,
    prompt: `Que estrutura está mais envolvida em: ${structure.primaryFunction.toLowerCase()}?`,
    options,
    correctIndex,
    explanation: `${structure.label} é a resposta certa: a sua função principal é ${structure.primaryFunction.toLowerCase()}.`,
    structureId: structure.id,
    skill: 'application',
    questionType: 'singleChoice'
  };
};

const descriptionQuestion = (
  structure: Structure,
  pool: Structure[],
  rng: () => number,
  index: number
): QuizQuestion => {
  const { options, correctIndex } = makeOptions(
    structure.label,
    pool.map((part) => part.label),
    rng
  );

  return {
    id: `description-${structure.id}-${index}`,
    prompt: `Que parte corresponde a esta descrição: "${structure.shortDescription}"`,
    options,
    correctIndex,
    explanation: `A descrição aponta para ${structure.label}: ${structure.shortDescription}`,
    structureId: structure.id,
    skill: 'understanding',
    questionType: 'singleChoice'
  };
};

const blueprints: Blueprint[] = [
  {
    skill: 'recall',
    questionType: 'singleChoice',
    build: locationQuestion
  },
  {
    skill: 'recall',
    questionType: 'singleChoice',
    build: functionQuestion
  },
  {
    skill: 'understanding',
    questionType: 'trueFalse',
    build: (structure, _pool, rng, index) => trueFalseQuestion(structure, rng, index)
  },
  {
    skill: 'application',
    questionType: 'singleChoice',
    build: applicationQuestion
  },
  {
    skill: 'understanding',
    questionType: 'singleChoice',
    build: descriptionQuestion
  }
];

export function generateQuizRound(source: Structure[], options: GenerateOptions = {}): QuizQuestion[] {
  const rng = createRng(options.seed ?? `${DEFAULT_SEED}-${Date.now()}`);
  const pool = shuffle(source, rng);

  return blueprints.map((blueprint, index) => {
    const structure = pool[index % pool.length];
    return blueprint.build(structure, source, rng, index);
  });
}

export function validateQuizRound(questions: QuizQuestion[]): ValidationResult {
  const errors: string[] = [];

  if (questions.length !== 5) {
    errors.push('A quiz round must contain exactly five questions.');
  }

  const structureCoverage = new Set(questions.map((question) => question.structureId).filter(Boolean));
  if (structureCoverage.size < 4) {
    errors.push('A quiz round must cover at least four structures.');
  }

  questions.forEach((question) => {
    if (!question.prompt.trim()) {
      errors.push(`${question.id} has an empty prompt.`);
    }

    if (question.prompt.length > 180) {
      errors.push(`${question.id} prompt is too long.`);
    }

    if (!question.explanation.trim()) {
      errors.push(`${question.id} is missing an explanation.`);
    }

    if (question.correctIndex < 0 || question.correctIndex >= question.options.length) {
      errors.push(`${question.id} has a correct answer outside its options.`);
    }

    if (new Set(question.options).size !== question.options.length) {
      errors.push(`${question.id} has duplicate options.`);
    }

    if (question.questionType === 'singleChoice' && question.options.length < 3) {
      errors.push(`${question.id} should have at least three options.`);
    }

    if (question.questionType === 'trueFalse' && question.options.length !== 2) {
      errors.push(`${question.id} must have two options.`);
    }
  });

  return {
    ok: errors.length === 0,
    errors
  };
}
