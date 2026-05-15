import {
  AudioLines,
  BookOpenCheck,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  HelpCircle,
  Info,
  Move3D,
  RefreshCcw,
  RotateCcw,
  ScanLine,
  Sparkles,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ExerciseScene from './components/ExerciseScene';
import RespiratoryScene from './components/RespiratoryScene';
import { PartId, ViewMode, getStructure, structures } from './data/structures';
import { QuizQuestion, generateQuizRound, validateQuizRound } from './data/quizGenerator';

type Mode = 'explore' | 'exercise' | 'quiz';
type LegalPage = 'aviso-legal' | 'creditos' | 'privacidade';
type ExercisePhase = 'parts' | 'review' | 'labels' | 'complete';
type DragItem = { kind: 'part' | 'label'; id: PartId } | null;

const shuffled = () => [...structures].sort(() => Math.random() - 0.5);

function buildQuizRound() {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const round = generateQuizRound(structures, { seed: `${Date.now()}-${attempt}-${Math.random()}` });
    if (validateQuizRound(round).ok) {
      return round;
    }
  }
  return generateQuizRound(structures);
}

function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const navigate = (next: string) => {
    window.history.pushState({}, '', next);
    setPath(next);
  };
  return { path, navigate };
}

export default function App() {
  const { path, navigate } = usePath();
  const initialPart = new URLSearchParams(window.location.search).get('parte') as PartId | null;
  const [mode, setMode] = useState<Mode>(path === '/exercicio' ? 'exercise' : path === '/quiz' ? 'quiz' : 'explore');
  const [selected, setSelected] = useState<PartId | null>(null);

  useEffect(() => {
    if (initialPart) {
      window.history.replaceState({}, '', '/explorar');
    }
  }, []);
  const [hovered, setHovered] = useState<PartId | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('normal');
  const [autoRotate, setAutoRotate] = useState(false);
  const [isolate, setIsolate] = useState(false);
  const [ghost, setGhost] = useState(false);
  const [breathing, setBreathing] = useState(true);
  const [bottomTab, setBottomTab] = useState<'real' | 'compare'>('real');
  const [accepted, setAccepted] = useState(
    () => localStorage.getItem('corpus3d.disclaimerAccepted') === 'true'
  );
  const [bank, setBank] = useState(shuffled);
  const [exercisePhase, setExercisePhase] = useState<ExercisePhase>('parts');
  const [placedParts, setPlacedParts] = useState<Set<PartId>>(new Set());
  const [placedLabels, setPlacedLabels] = useState<Set<PartId>>(new Set());
  const [dragging, setDragging] = useState<DragItem>(null);
  const [feedback, setFeedback] = useState('Arrasta uma imagem para a zona correta.');
  const [mistakes, setMistakes] = useState<Record<PartId, number>>({} as Record<PartId, number>);
  const [muted, setMuted] = useState(false);
  const [quizRound, setQuizRound] = useState<QuizQuestion[]>(buildQuizRound);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Array<number | null>>(() => Array(5).fill(null));
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastAudioUrl = useRef<string | null>(null);

  const active = getStructure(hovered ?? selected);
  const legal = path.slice(1) as LegalPage;

  const playAudio = (url?: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (url && !muted) {
      audioRef.current = new Audio(url);
      audioRef.current.play().catch((e) => console.log('Audio pending user interaction or error:', e));
    }
  };

  useEffect(() => {
    const target = hovered || selected;
    const struct = getStructure(target);
    const url = struct?.audio || null;

    if (muted || !url) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      lastAudioUrl.current = null;
      return;
    }

    if (url !== lastAudioUrl.current || audioRef.current?.paused) {
      playAudio(url);
      lastAudioUrl.current = url;
    }
  }, [hovered, selected, muted]);

  useEffect(() => {
    setMode(path === '/exercicio' ? 'exercise' : path === '/quiz' ? 'quiz' : 'explore');
  }, [path]);

  const selectPart = (id: PartId | null) => {
    setSelected(id);
    if (mode === 'explore') {
      const url = id ? `/explorar?parte=${id}` : '/explorar';
      window.history.replaceState({}, '', url);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    navigate(next === 'exercise' ? '/exercicio' : next === 'quiz' ? '/quiz' : '/explorar');
  };

  const resetExercise = () => {
    setBank(shuffled());
    setExercisePhase('parts');
    setPlacedParts(new Set());
    setPlacedLabels(new Set());
    setDragging(null);
    setMistakes({} as Record<PartId, number>);
    setFeedback('Nova ronda iniciada. Coloca primeiro as imagens nas zonas indicadas.');
  };

  const attemptDrop = (zoneId: PartId) => {
    if (!dragging) return;
    const part = getStructure(dragging.id);
    if (zoneId === dragging.id) {
      if (dragging.kind === 'part') {
        const next = new Set(placedParts).add(dragging.id);
        setPlacedParts(next);
        if (next.size === structures.length) {
          setExercisePhase('review');
          setFeedback('Muito bem! Observa o sistema montado e continua quando estiveres pronto.');
        } else {
          setFeedback(`Excelente! ${part?.label} ficou no lugar certo.`);
        }
      } else {
        const next = new Set(placedLabels).add(dragging.id);
        setPlacedLabels(next);
        if (next.size === structures.length) {
          setExercisePhase('complete');
          setFeedback('Sistema Respiratório Reconstruído!');
        } else {
          setFeedback(`Certo! A etiqueta ${part?.label} ficou ligada ao local correto.`);
        }
      }
    } else {
      setMistakes((prev) => ({ ...prev, [dragging.id]: (prev[dragging.id] ?? 0) + 1 }));
      setFeedback(
        dragging.kind === 'part'
          ? 'Ainda não é esse lugar. Observa a forma e tenta novamente.'
          : 'Essa etiqueta pertence a outra zona. Compara com o modelo montado.'
      );
    }
    setDragging(null);
  };

  const selectExerciseTarget = (zoneId: PartId) => {
    if (dragging) {
      attemptDrop(zoneId);
      return;
    }
    selectPart(zoneId);
  };

  const continueToLabels = () => {
    setExercisePhase('labels');
    setDragging(null);
    setFeedback('Agora arrasta os nomes para as etiquetas corretas.');
  };

  const answerQuiz = (optionIndex: number) => {
    if (quizIndex >= quizRound.length || quizAnswers[quizIndex] !== null) return;
    setQuizAnswers((prev) => prev.map((answer, index) => (index === quizIndex ? optionIndex : answer)));
  };

  const nextQuizQuestion = () => {
    setQuizIndex((current) => Math.min(current + 1, quizRound.length));
  };

  const restartQuiz = () => {
    setQuizRound(buildQuizRound());
    setQuizIndex(0);
    setQuizAnswers(Array(5).fill(null));
  };

  const quizScore = quizRound.reduce(
    (score, question, index) => score + (quizAnswers[index] === question.correctIndex ? 1 : 0),
    0
  );

  if (['/aviso-legal', '/creditos', '/privacidade'].includes(path)) {
    return <LegalPageView page={legal} onBack={() => navigate('/explorar')} />;
  }

  return (
    <div className={`app-shell ${mode}-mode`}>
      <header className="topbar">
        <div className="topbar-left">
          <button className="brand-logo" onClick={() => navigate('/explorar')} aria-label="Ir para explorar">
            <img src="/images/LogoCorpus3D.png" alt="Corpus3D" className="nav-logo" />
          </button>
          <NavHelpDropdown />
        </div>

        <div className="topbar-center">
          <img src="/images/LogoRespira3d_01.png" alt="Respira3D" className="nav-logo-center" />
        </div>

        <div className="topbar-actions">
          {mode === 'explore' && (
            <div className="view-switch-inline">
              <button
                className={viewMode === 'normal' ? 'seg active' : 'seg'}
                onClick={() => setViewMode('normal')}
              >
                Atlas
              </button>
              <button
                className={viewMode === 'xray' ? 'seg active' : 'seg'}
                onClick={() => setViewMode('xray')}
              >
                Raio-X
              </button>
            </div>
          )}
          <div className="mode-switch">
            <button className={mode === 'explore' ? 'seg active' : 'seg'} onClick={() => switchMode('explore')}>
              Explorar
            </button>
            <button className={mode === 'exercise' ? 'seg active' : 'seg'} onClick={() => switchMode('exercise')}>
              Exercício
            </button>
            <button className={mode === 'quiz' ? 'seg active' : 'seg'} onClick={() => switchMode('quiz')}>
              Quiz
            </button>
          </div>
          <button 
            className={muted ? 'icon-button active' : 'icon-button'} 
            aria-label={muted ? "Ativar som" : "Desativar som"}
            onClick={() => setMuted(!muted)}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </header>

      <aside className="left-panel">
        {mode === 'explore' ? (
          <>
            <PanelTitle title="Sistema Respiratório" subtitle="10 estruturas principais" />
            <div className="part-list">
              {structures.map((part) => (
                <button
                  key={part.id}
                  className={part.id === selected ? 'part-row active' : 'part-row'}
                  onClick={() => selectPart(part.id)}
                >
                  <img className="part-thumb" src={part.image} alt="" />
                  <span>{part.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : mode === 'exercise' ? (
          <ExerciseBank
            bank={bank}
            phase={exercisePhase}
            placedParts={placedParts}
            placedLabels={placedLabels}
            dragging={dragging}
            onDrag={setDragging}
          />
        ) : (
          <QuizNavigator
            questions={quizRound}
            answers={quizAnswers}
            currentIndex={quizIndex}
            onSelect={setQuizIndex}
          />
        )}
      </aside>

      <main className="stage">
        {mode === 'explore' ? (
          <>
            {viewMode === 'xray' ? (
              <div className="xray-stage">
                <img className="xray-image" src="/images/anatomy/X-Ray.png" alt="Raio-X do sistema respiratório" />
              </div>
            ) : (
              <RespiratoryScene
                selected={selected}
                hovered={hovered}
                onSelect={selectPart}
                onHover={setHovered}
                viewMode={viewMode}
                isolate={isolate}
                ghost={ghost}
                autoRotate={autoRotate}
                breathing={breathing}
                visible={accepted}
              />
            )}
          </>
        ) : mode === 'exercise' ? (
          <ExerciseScene
            phase={exercisePhase}
            placedParts={placedParts}
            placedLabels={placedLabels}
            dragging={dragging}
            highlightedId={dragging && (mistakes[dragging.id] ?? 0) >= 3 ? dragging.id : null}
            onDrop={attemptDrop}
            onSelectTarget={selectExerciseTarget}
          />
        ) : (
          <QuizStage
            questions={quizRound}
            currentIndex={quizIndex}
            answers={quizAnswers}
            score={quizScore}
            onAnswer={answerQuiz}
            onNext={nextQuizQuestion}
            onRestart={restartQuiz}
          />
        )}
      </main>

      <aside className="right-panel">
        {mode === 'explore' ? (
          <InfoPanel active={active} />
        ) : mode === 'exercise' ? (
          <ScorePanel
            phase={exercisePhase}
            placedParts={placedParts}
            placedLabels={placedLabels}
            mistakes={mistakes}
            feedback={feedback}
            onReset={resetExercise}
            onContinue={continueToLabels}
            dragging={dragging}
          />
        ) : (
          <QuizSidePanel
            questions={quizRound}
            answers={quizAnswers}
            currentIndex={quizIndex}
            score={quizScore}
            onRestart={restartQuiz}
          />
        )}
      </aside>



      <footer className="footer">
        <button onClick={() => navigate('/aviso-legal')}>Aviso Legal</button>
        <span>·</span>
        <button onClick={() => navigate('/creditos')}>Créditos</button>
        <span>·</span>
        <button onClick={() => navigate('/privacidade')}>Privacidade</button>
      </footer>

      {!accepted && (
        <Disclaimer
          onAccept={() => {
            localStorage.setItem('corpus3d.disclaimerAccepted', 'true');
            setAccepted(true);
          }}
          onLegal={() => navigate('/aviso-legal')}
        />
      )}
    </div>
  );
}

function PanelTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="panel-title">
      <small>{subtitle}</small>
      <h2>{title}</h2>
    </div>
  );
}

function Toolbar({
  autoRotate,
  setAutoRotate,
  isolate,
  setIsolate,
  ghost,
  setGhost,
  breathing,
  setBreathing
}: {
  autoRotate: boolean;
  setAutoRotate: (value: boolean) => void;
  isolate: boolean;
  setIsolate: (value: boolean) => void;
  ghost: boolean;
  setGhost: (value: boolean) => void;
  breathing: boolean;
  setBreathing: (value: boolean) => void;
}) {
  return (
    <div className="toolbar">
      <button className={autoRotate ? 'tool active' : 'tool'} onClick={() => setAutoRotate(!autoRotate)} title="Rodar">
        <RotateCcw size={18} />
      </button>
      <button className={isolate ? 'tool active' : 'tool'} onClick={() => setIsolate(!isolate)} title="Isolar">
        <Eye size={18} />
      </button>
      <button className={ghost ? 'tool active' : 'tool'} onClick={() => setGhost(!ghost)} title="Esconder outros">
        <EyeOff size={18} />
      </button>
      <button className="tool" onClick={() => window.location.reload()} title="Repor vista">
        <RefreshCcw size={18} />
      </button>
      <button className={breathing ? 'tool active wide' : 'tool wide'} onClick={() => setBreathing(!breathing)}>
        <AudioLines size={18} /> Respirar
      </button>
    </div>
  );
}

function InfoPanel({ active }: { active: ReturnType<typeof getStructure> }) {
  if (!active) {
    return <div className="empty-card">Clica numa parte do sistema respiratório para começares.</div>;
  }
  return (
    <div className="info-stack">
      <div className="info-card main-info">
        <div className="info-header">
          <img className="info-thumb" src={active.image} alt="" />
          <div className="info-title-area">
            <span className="badge" style={{ background: active.color }} />
            <h1>{active.label}</h1>
            <p className="short-desc">{active.shortDescription}</p>
          </div>
        </div>
        <div className="info-stats">
          <div className="stat-row">
            <div className="stat-item">
              <small>Tamanho</small>
              <strong>{active.size}</strong>
            </div>
            <div className="stat-item">
              <small>Localização</small>
              <strong>{active.location}</strong>
            </div>
          </div>
          <div className="stat-item wide">
            <small>Função principal</small>
            <strong>{active.primaryFunction}</strong>
          </div>
        </div>
      </div>

      <section className="info-card notes-info">
        <h3>Notas Biológicas</h3>
        <p>{active.biologyNotes}</p>
      </section>

      <section className="info-card fun-info">
        <Sparkles size={16} />
        <p><strong>Facto divertido:</strong> {active.funFact}</p>
      </section>
    </div>
  );
}

function RealWorld({ active }: { active: ReturnType<typeof getStructure> }) {
  return (
    <div className="real-grid">
      <img src={active?.image ?? '/images/anatomy/RespiratorySystem02.png'} alt="" />
      <div>
        <strong>{active ? active.label : 'Sistema respiratório'}</strong>
        <p>
          Imagem de referência em estilo atlas para distinguir melhor a forma e os detalhes visuais desta estrutura.
        </p>
      </div>
    </div>
  );
}

function ComparePanel() {
  return (
    <div className="compare-grid">
      <div className="compare-item healthy">
        <img src="/images/anatomy/RightLung.png" alt="" />
        <strong>Pulmão saudável</strong>
        <p>Cor mais clara, tecido elástico e boa capacidade de expansão.</p>
      </div>
      <div className="compare-item smoker">
        <img src="/images/anatomy/LeftLung.png" alt="" />
        <strong>Pulmão de fumador</strong>
        <p>Representação educativa: manchas escuras, menor elasticidade e trocas gasosas menos eficientes.</p>
      </div>
    </div>
  );
}



function ExerciseBank({
  bank,
  phase,
  placedParts,
  placedLabels,
  dragging,
  onDrag
}: {
  bank: typeof structures;
  phase: ExercisePhase;
  placedParts: Set<PartId>;
  placedLabels: Set<PartId>;
  dragging: DragItem;
  onDrag: (item: DragItem) => void;
}) {
  const partsOpen = phase === 'parts';
  const labelsOpen = phase === 'labels';
  const title = partsOpen ? 'Banco de Imagens' : labelsOpen ? 'Banco de Etiquetas' : 'Sistema Montado';
  const subtitle = partsOpen ? 'Completa o esquema' : labelsOpen ? 'Nomeia as partes' : 'Observa antes de continuar';
  const visibleItems = bank.filter((part) => {
    if (partsOpen) return !placedParts.has(part.id);
    if (labelsOpen) return !placedLabels.has(part.id);
    return false;
  });
  const startDrag = (part: (typeof structures)[number]) => (event?: React.DragEvent<HTMLButtonElement>) => {
    const item: DragItem = { kind: partsOpen ? 'part' : 'label', id: part.id };
    event?.dataTransfer.setData('text/plain', part.id);
    event?.dataTransfer.setData('application/corpus3d-kind', item.kind);
    onDrag(item);
  };

  return (
    <>
      <PanelTitle title={title} subtitle={subtitle} />
      <div className={partsOpen ? 'part-list image-bank' : 'part-list label-bank'}>
        {visibleItems.map((part) => (
          <button
            key={part.id}
            className={dragging?.id === part.id ? 'part-row active' : 'part-row'}
            draggable
            onDragStart={startDrag(part)}
            onDragEnd={() => onDrag(null)}
            onClick={() => onDrag({ kind: partsOpen ? 'part' : 'label', id: part.id })}
            aria-label={partsOpen ? `Arrastar imagem ${part.label}` : `Arrastar etiqueta ${part.label}`}
          >
            {partsOpen ? (
              <img className="part-thumb" src={part.image} alt="" />
            ) : (
              <span className="label-chip-dot" style={{ background: part.color }} />
            )}
            {!partsOpen && <span>{part.label}</span>}
          </button>
        ))}
        {visibleItems.length === 0 && (
          <div className="bank-empty">
            <Check size={18} />
            <span>
              {phase === 'complete'
                ? 'Exercício completo.'
                : phase === 'review'
                  ? 'Imagens colocadas corretamente.'
                  : 'Tudo colocado. Passa para as etiquetas.'}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

function ScorePanel({
  phase,
  placedParts,
  placedLabels,
  mistakes,
  feedback,
  onReset,
  onContinue,
  dragging
}: {
  phase: ExercisePhase;
  placedParts: Set<PartId>;
  placedLabels: Set<PartId>;
  mistakes: Record<PartId, number>;
  feedback: string;
  onReset: () => void;
  onContinue: () => void;
  dragging: DragItem;
}) {
  const score = phase === 'parts' || phase === 'review' ? placedParts.size : placedLabels.size;
  const label = phase === 'parts' || phase === 'review' ? 'imagens' : 'nomes';
  const totalMistakes = Object.values(mistakes).reduce((sum, value) => sum + value, 0);
  const activeMistakes = dragging ? mistakes[dragging.id] ?? 0 : 0;
  const complete = phase === 'complete';
  return (
    <div className="info-stack">
      <div className="title-card">
        <h1>{complete ? structures.length : score} / {structures.length} {label}</h1>
        <div className="progress">
          <span style={{ width: `${(score / structures.length) * 100}%` }} />
        </div>
        <p aria-live="polite">{complete ? 'Sistema Respiratório Reconstruído!' : feedback}</p>
      </div>
      <div className="data-card">
        <dl>
          <dt>Fase</dt>
          <dd>{phase === 'parts' ? 'Imagens' : phase === 'review' ? 'Revisão' : phase === 'labels' ? 'Etiquetas' : 'Completo'}</dd>
          <dt>Erros</dt>
          <dd>{totalMistakes}</dd>
          <dt>Hint</dt>
          <dd>{activeMistakes >= 3 ? 'Disponivel: procura a zona a pulsar.' : 'Desbloqueia apos 3 tentativas.'}</dd>
        </dl>
      </div>
      {phase === 'review' && (
        <button className="primary-action" onClick={onContinue}>Continuar para nomes</button>
      )}
      <button className="primary-action" onClick={onReset}>Reiniciar exercício</button>
    </div>
  );
}

function QuizNavigator({
  questions,
  answers,
  currentIndex,
  onSelect
}: {
  questions: QuizQuestion[];
  answers: Array<number | null>;
  currentIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <>
      <PanelTitle title="Quiz Respiratório" subtitle="5 perguntas mistas" />
      <div className="quiz-nav-list">
        {questions.map((question, index) => {
          const answered = answers[index] !== null;
          const correct = answered && answers[index] === question.correctIndex;
          const locked = !answered && index > currentIndex;
          return (
            <button
              key={question.id}
              className={[
                'quiz-nav-row',
                index === currentIndex ? 'active' : '',
                answered ? (correct ? 'correct' : 'incorrect') : '',
                locked ? 'locked' : ''
              ].join(' ')}
              disabled={locked}
              onClick={() => onSelect(index)}
            >
              <span>{index + 1}</span>
              <div>
                <strong>Pergunta {index + 1}</strong>
                <small>
                  {question.skill === 'recall'
                    ? 'Memória'
                    : question.skill === 'application'
                      ? 'Aplicação'
                      : 'Compreensão'}
                </small>
              </div>
              {answered && <Check size={16} />}
            </button>
          );
        })}
      </div>
    </>
  );
}

function QuizStage({
  questions,
  currentIndex,
  answers,
  score,
  onAnswer,
  onNext,
  onRestart
}: {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: Array<number | null>;
  score: number;
  onAnswer: (optionIndex: number) => void;
  onNext: () => void;
  onRestart: () => void;
}) {
  const complete = currentIndex >= questions.length;
  const question = questions[currentIndex];
  const selectedAnswer = answers[currentIndex];

  if (complete) {
    return (
      <div className="quiz-stage">
        <div className="quiz-result">
          <BookOpenCheck size={42} />
          <small>Resultado final</small>
          <h1>{score} / {questions.length}</h1>
          <p>
            {score >= 4
              ? 'Excelente trabalho. Já reconheces bem as estruturas principais do sistema respiratório.'
              : score >= 3
                ? 'Bom progresso. Revê as explicações e tenta outra ronda para consolidar.'
                : 'Continua a praticar. Cada explicação ajuda-te a ligar a estrutura à função.'}
          </p>
          <button className="primary-action quiz-action" onClick={onRestart}>
            Gerar novo quiz
          </button>
        </div>
      </div>
    );
  }

  const answered = selectedAnswer !== null;

  return (
    <div className="quiz-stage">
      <div className="quiz-card">
        <div className="quiz-kicker">
          <span>Pergunta {currentIndex + 1} de {questions.length}</span>
          <strong>
            {question.skill === 'recall'
              ? 'Memória'
              : question.skill === 'application'
                ? 'Aplicação'
                : 'Compreensão'}
          </strong>
        </div>
        <h1>{question.prompt}</h1>
        <div className="quiz-options">
          {question.options.map((option, index) => {
            const isCorrect = index === question.correctIndex;
            const isSelected = selectedAnswer === index;
            return (
              <button
                key={option}
                className={[
                  'quiz-option',
                  answered && isCorrect ? 'correct' : '',
                  answered && isSelected && !isCorrect ? 'incorrect' : '',
                  isSelected ? 'selected' : ''
                ].join(' ')}
                disabled={answered}
                onClick={() => onAnswer(index)}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                <strong>{option}</strong>
              </button>
            );
          })}
        </div>
        {answered && (
          <div className={selectedAnswer === question.correctIndex ? 'quiz-feedback correct' : 'quiz-feedback incorrect'}>
            <strong>{selectedAnswer === question.correctIndex ? 'Correto!' : 'Ainda não.'}</strong>
            <p>{question.explanation}</p>
            <button className="primary-action quiz-action" onClick={onNext}>
              {currentIndex === questions.length - 1 ? 'Ver resultado' : 'Seguinte'}
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function QuizSidePanel({
  questions,
  answers,
  currentIndex,
  score,
  onRestart
}: {
  questions: QuizQuestion[];
  answers: Array<number | null>;
  currentIndex: number;
  score: number;
  onRestart: () => void;
}) {
  const complete = currentIndex >= questions.length;
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const activeQuestion = questions[Math.min(currentIndex, questions.length - 1)];
  const activeStructure = getStructure(activeQuestion?.structureId ?? null);

  return (
    <div className="info-stack">
      <div className="title-card quiz-score-card">
        <small>Quiz</small>
        <h1>{score} corretas</h1>
        <div className="progress">
          <span style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
        </div>
        <p>{complete ? 'Ronda terminada.' : `${answeredCount} de ${questions.length} respondidas.`}</p>
      </div>

      {activeStructure && (
        <section className="info-card quiz-source-card">
          <img src={activeStructure.image} alt="" />
          <div>
            <small>Fonte da pergunta</small>
            <h3>{activeStructure.label}</h3>
            <p>{activeStructure.shortDescription}</p>
          </div>
        </section>
      )}

      <section className="info-card quiz-agent-card">
        <h3>Como o quiz foi criado</h3>
        <p>
          As perguntas são geradas a partir dos factos do modo Explorar: localização, função, notas biológicas e
          descrições curtas.
        </p>
      </section>

      <button className="primary-action" onClick={onRestart}>Nova ronda</button>
    </div>
  );
}

function Disclaimer({ onAccept, onLegal }: { onAccept: () => void; onLegal: () => void }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Bem-vindo(a) ao Corpus3D</h2>
        <p>
          Esta aplicação destina-se a alunos dos 11 aos 14 anos e tem fins exclusivamente educativos. Os modelos 3D e imagens
          ajudam a aprender anatomia, mas não substituem aconselhamento médico.
        </p>
        <p>Algumas comparações mostram efeitos do tabagismo nos pulmões com objetivo educativo.</p>
        <div className="modal-actions">
          <button className="secondary-action" onClick={onLegal}>Ler aviso completo</button>
          <button className="primary-action" onClick={onAccept}>Compreendi, vamos começar</button>
        </div>
      </div>
    </div>
  );
}

function LegalPageView({ page, onBack }: { page: LegalPage; onBack: () => void }) {
  const content = useMemo(() => {
    if (page === 'aviso-legal') {
      return {
        title: 'Aviso Legal',
        body: [
          'O Corpus3D é uma aplicação educativa para alunos do 2.º e 3.º ciclos do ensino básico.',
          'A informação apresentada não constitui aconselhamento médico, diagnóstico ou tratamento.',
          'Para questoes de saude, consulta sempre um profissional qualificado.'
        ]
      };
    }
    if (page === 'creditos') {
      return {
        title: 'Créditos e Atribuições',
        body: [
          <span key="credits">
            Modelos 3D: gerados por IA para este projeto por{' '}
            <a href="http://jose-ai-solutions.web.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
              Jose-AI-Solutions
            </a>. Sem licencas externas necessarias.
          </span>,
          'Video local: fornecido na pasta Assets do projeto.',
          'Software: React, Vite, Three.js, React Three Fiber, Drei e Lucide.'
        ]
      };
    }
    return {
      title: 'Política de Privacidade',
      body: [
        'Esta aplicação não recolhe, armazena nem transmite dados pessoais.',
        'As preferências de utilização ficam apenas no armazenamento local do navegador.',
        'O modo offline guarda ficheiros educativos no dispositivo, sem dados pessoais.'
      ]
    };
  }, [page]);

  return (
    <main className="legal-page">
      <button className="close-link" onClick={onBack}>
        <X size={16} /> Voltar
      </button>
      <article>
        <h1>{content.title}</h1>
        {content.body.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
        <small>Última atualização: 14/05/2026 · Versão da aplicação: 0.1.0</small>
      </article>
    </main>
  );
}

function NavHelpDropdown() {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="nav-help-container" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button 
        className={open ? 'icon-button active' : 'icon-button'} 
        aria-label="Ajuda de Navegação"
      >
        <HelpCircle size={18} />
      </button>
      {open && (
        <div className="nav-help-dropdown">
          <div className="help-item">
            <div className="icon-wrapper">
              <RotateCcw size={18} />
            </div>
            <div>
              <strong>Rodar</strong>
              <span>Botão esquerdo e arrastar</span>
            </div>
          </div>
          <div className="help-item">
            <div className="icon-wrapper">
              <Move3D size={18} />
            </div>
            <div>
              <strong>Mover</strong>
              <span>Botão direito e arrastar</span>
            </div>
          </div>
          <div className="help-item">
            <div className="icon-wrapper">
              <ScanLine size={18} />
            </div>
            <div>
              <strong>Aproximar</strong>
              <span>Roda do rato (Scroll)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
