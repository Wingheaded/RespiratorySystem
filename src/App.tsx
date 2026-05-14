import {
  AudioLines,
  Check,
  Eye,
  EyeOff,
  Info,
  Move3D,
  RefreshCcw,
  RotateCcw,
  ScanLine,
  Sparkles,
  Volume2,
  X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import RespiratoryScene from './components/RespiratoryScene';
import { PartId, ViewMode, getStructure, structures } from './data/structures';

type Mode = 'explore' | 'exercise';
type LegalPage = 'aviso-legal' | 'creditos' | 'privacidade';
type DisplayMode = 'atlas' | 'image';

const shuffled = () => [...structures].sort(() => Math.random() - 0.5);

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
  const [mode, setMode] = useState<Mode>(path === '/exercicio' ? 'exercise' : 'explore');
  const [selected, setSelected] = useState<PartId | null>(
    structures.some((part) => part.id === initialPart) ? initialPart : null
  );
  const [hovered, setHovered] = useState<PartId | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('normal');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('atlas');
  const [autoRotate, setAutoRotate] = useState(false);
  const [isolate, setIsolate] = useState(false);
  const [ghost, setGhost] = useState(false);
  const [breathing, setBreathing] = useState(true);
  const [bottomTab, setBottomTab] = useState<'real' | 'compare'>('real');
  const [accepted, setAccepted] = useState(
    () => localStorage.getItem('corpus3d.disclaimerAccepted') === 'true'
  );
  const [bank, setBank] = useState(shuffled);
  const [placed, setPlaced] = useState<Set<PartId>>(new Set());
  const [dragging, setDragging] = useState<PartId | null>(null);
  const [feedback, setFeedback] = useState('Arrasta uma estrutura para a zona correta.');
  const [mistakes, setMistakes] = useState<Record<string, number>>({});
  const active = getStructure(hovered ?? selected);
  const legal = path.slice(1) as LegalPage;

  useEffect(() => {
    setMode(path === '/exercicio' ? 'exercise' : 'explore');
  }, [path]);

  const selectPart = (id: PartId) => {
    setSelected(id);
    if (mode === 'explore') window.history.replaceState({}, '', `/explorar?parte=${id}`);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    navigate(next === 'exercise' ? '/exercicio' : '/explorar');
  };

  const resetExercise = () => {
    setBank(shuffled());
    setPlaced(new Set());
    setDragging(null);
    setMistakes({});
    setFeedback('Nova ronda iniciada. Escolhe uma estrutura.');
  };

  const attemptDrop = (zoneId: PartId) => {
    if (!dragging) return;
    if (zoneId === dragging) {
      const part = getStructure(dragging);
      setPlaced((prev) => new Set(prev).add(dragging));
      setFeedback(`Excelente! ${part?.label} ficou no lugar certo.`);
    } else {
      setMistakes((prev) => ({ ...prev, [dragging]: (prev[dragging] ?? 0) + 1 }));
      setFeedback('Ainda nao e esse lugar. Observa a forma e tenta novamente.');
    }
    setDragging(null);
  };

  if (['/aviso-legal', '/creditos', '/privacidade'].includes(path)) {
    return <LegalPageView page={legal} onBack={() => navigate('/explorar')} />;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => navigate('/explorar')} aria-label="Ir para explorar">
          <span className="brand-mark">R3D</span>
          <span>
            <strong>Respira3D</strong>
            <small>Corpus3D</small>
          </span>
        </button>
        <div className="topbar-actions">
          <button className={mode === 'explore' ? 'seg active' : 'seg'} onClick={() => switchMode('explore')}>
            Explorar
          </button>
          <button className={mode === 'exercise' ? 'seg active' : 'seg'} onClick={() => switchMode('exercise')}>
            Exercicio
          </button>
          <button className="icon-button" aria-label="Som">
            <Volume2 size={18} />
          </button>
        </div>
      </header>

      <aside className="left-panel">
        {mode === 'explore' ? (
          <>
            <PanelTitle title="Sistema Respiratorio" subtitle="10 estruturas principais" />
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
        ) : (
          <ExerciseBank bank={bank} placed={placed} dragging={dragging} onDrag={setDragging} />
        )}
      </aside>

      <main className="stage">
        {mode === 'explore' ? (
          <>
            <div className="view-switch">
              <button
                className={displayMode === 'atlas' && viewMode === 'normal' ? 'seg active' : 'seg'}
                onClick={() => {
                  setDisplayMode('atlas');
                  setViewMode('normal');
                }}
              >
                Atlas
              </button>
              <button
                className={displayMode === 'image' ? 'seg active' : 'seg'}
                onClick={() => {
                  setDisplayMode('image');
                  setViewMode('normal');
                }}
              >
                Imagem
              </button>
              {(['section', 'xray'] as ViewMode[]).map((modeKey) => (
                <button
                  key={modeKey}
                  className={displayMode === 'atlas' && viewMode === modeKey ? 'seg active' : 'seg'}
                  onClick={() => {
                    setDisplayMode('atlas');
                    setViewMode(modeKey);
                  }}
                >
                  {modeKey === 'section' ? 'Corte' : 'Raio-X'}
                </button>
              ))}
            </div>
            {displayMode === 'image' ? (
              <AtlasPlate selected={selected} onSelect={selectPart} />
            ) : (
              <>
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
                />
                <div className="hint-strip">
                  <Move3D size={16} /> Arrastar para rodar
                  <ScanLine size={16} /> Roda do rato para aproximar
                </div>
                <Toolbar
                  autoRotate={autoRotate}
                  setAutoRotate={setAutoRotate}
                  isolate={isolate}
                  setIsolate={setIsolate}
                  ghost={ghost}
                  setGhost={setGhost}
                  breathing={breathing}
                  setBreathing={setBreathing}
                />
              </>
            )}
          </>
        ) : (
          <ExerciseStage placed={placed} dragging={dragging} onDrop={attemptDrop} onSelect={selectPart} />
        )}
      </main>

      <aside className="right-panel">
        {mode === 'explore' ? <InfoPanel active={active} /> : <ScorePanel placed={placed} mistakes={mistakes} feedback={feedback} onReset={resetExercise} dragging={dragging} />}
      </aside>

      {mode === 'explore' && (
        <section className="bottom-panel">
          <div className="tabs">
            <button className={bottomTab === 'real' ? 'tab active' : 'tab'} onClick={() => setBottomTab('real')}>
              Imagem Real
            </button>
            <button className={bottomTab === 'compare' ? 'tab active' : 'tab'} onClick={() => setBottomTab('compare')}>
              Comparar
            </button>
          </div>
          {bottomTab === 'real' ? <RealWorld active={active} /> : <ComparePanel />}
        </section>
      )}

      <footer className="footer">
        <button onClick={() => navigate('/aviso-legal')}>Aviso Legal</button>
        <span>·</span>
        <button onClick={() => navigate('/creditos')}>Creditos</button>
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
    return <div className="empty-card">Clica numa parte do sistema respiratorio para comecares.</div>;
  }
  return (
    <div className="info-stack">
      <div className="title-card">
        <img className="detail-figure" src={active.image} alt="" />
        <span className="badge" style={{ background: active.color }} />
        <h1>{active.label}</h1>
        <p>{active.shortDescription}</p>
      </div>
      <div className="data-card">
        <Info size={18} />
        <dl>
          <dt>Tamanho</dt>
          <dd>{active.size}</dd>
          <dt>Localizacao</dt>
          <dd>{active.location}</dd>
          <dt>Funcao principal</dt>
          <dd>{active.primaryFunction}</dd>
        </dl>
      </div>
      <section className="text-card">
        <h3>Notas Biologicas</h3>
        <p>{active.biologyNotes}</p>
      </section>
      <section className="fun-card">
        <Sparkles size={18} />
        <div>
          <h3>Facto divertido</h3>
          <p>{active.funFact}</p>
        </div>
      </section>
    </div>
  );
}

function RealWorld({ active }: { active: ReturnType<typeof getStructure> }) {
  return (
    <div className="real-grid">
      <img src={active?.image ?? '/images/anatomy/RespiratorySystem02.png'} alt="" />
      <div>
        <strong>{active ? active.label : 'Sistema respiratorio'}</strong>
        <p>
          Imagem de referencia em estilo atlas para distinguir melhor a forma e os detalhes visuais desta estrutura.
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
        <strong>Pulmao saudavel</strong>
        <p>Cor mais clara, tecido elastico e boa capacidade de expansao.</p>
      </div>
      <div className="compare-item smoker">
        <img src="/images/anatomy/LeftLung.png" alt="" />
        <strong>Pulmao de fumador</strong>
        <p>Representacao educativa: manchas escuras, menor elasticidade e trocas gasosas menos eficientes.</p>
      </div>
    </div>
  );
}

function AtlasPlate({ selected, onSelect }: { selected: PartId | null; onSelect: (id: PartId) => void }) {
  const hotspots: Record<PartId, { left: string; top: string }> = {
    nasal: { left: '47%', top: '14%' },
    pharynx: { left: '50%', top: '23%' },
    larynx: { left: '51%', top: '31%' },
    trachea: { left: '51%', top: '42%' },
    'main-bronchi': { left: '51%', top: '53%' },
    bronchioles: { left: '56%', top: '66%' },
    alveoli: { left: '62%', top: '74%' },
    'right-lung': { left: '38%', top: '67%' },
    'left-lung': { left: '64%', top: '67%' },
    diaphragm: { left: '51%', top: '88%' }
  };

  return (
    <div className="atlas-stage">
      <div className="atlas-figure">
        <img className="atlas-image" src="/images/anatomy/RespiratorySystem02.png" alt="Sistema respiratorio ilustrado" />
        {structures.map((part) => (
          <button
            key={part.id}
            className={selected === part.id ? 'atlas-hotspot active' : 'atlas-hotspot'}
            style={{
              left: hotspots[part.id].left,
              top: hotspots[part.id].top,
              borderColor: part.color
            }}
            onClick={() => onSelect(part.id)}
            aria-label={part.label}
            title={part.label}
          />
        ))}
      </div>
    </div>
  );
}

function ExerciseBank({
  bank,
  placed,
  dragging,
  onDrag
}: {
  bank: typeof structures;
  placed: Set<PartId>;
  dragging: PartId | null;
  onDrag: (id: PartId | null) => void;
}) {
  return (
    <>
      <PanelTitle title="Banco de Componentes" subtitle="Monta o sistema" />
      <div className="part-list">
        {bank.map((part) => (
          <button
            key={part.id}
            className={dragging === part.id ? 'part-row active' : placed.has(part.id) ? 'part-row done' : 'part-row'}
            disabled={placed.has(part.id)}
            draggable={!placed.has(part.id)}
            onDragStart={() => onDrag(part.id)}
            onClick={() => onDrag(part.id)}
          >
            <img className="part-thumb" src={part.image} alt="" />
            <span>{part.label}</span>
            {placed.has(part.id) && <Check size={16} />}
          </button>
        ))}
      </div>
    </>
  );
}

function ExerciseStage({
  placed,
  dragging,
  onDrop,
  onSelect
}: {
  placed: Set<PartId>;
  dragging: PartId | null;
  onDrop: (id: PartId) => void;
  onSelect: (id: PartId) => void;
}) {
  return (
    <div className="exercise-stage">
      <div className="blueprint">
        {structures.map((part) => (
          <button
            key={part.id}
            className={placed.has(part.id) ? 'drop-zone placed' : dragging ? 'drop-zone ready' : 'drop-zone'}
            style={{
              left: `${50 + part.position[0] * 20}%`,
              top: `${48 - part.position[1] * 14}%`,
              borderColor: part.color
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => onDrop(part.id)}
            onClick={() => (dragging ? onDrop(part.id) : onSelect(part.id))}
            aria-label={`Zona ${part.label}`}
          >
            {placed.has(part.id) ? <Check size={16} /> : ''}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScorePanel({
  placed,
  mistakes,
  feedback,
  onReset,
  dragging
}: {
  placed: Set<PartId>;
  mistakes: Record<string, number>;
  feedback: string;
  onReset: () => void;
  dragging: PartId | null;
}) {
  const score = placed.size;
  const totalMistakes = Object.values(mistakes).reduce((sum, value) => sum + value, 0);
  const activeMistakes = dragging ? mistakes[dragging] ?? 0 : 0;
  const complete = score === structures.length;
  return (
    <div className="info-stack">
      <div className="title-card">
        <h1>{score} / {structures.length} corretos</h1>
        <div className="progress">
          <span style={{ width: `${(score / structures.length) * 100}%` }} />
        </div>
        <p aria-live="polite">{complete ? 'Sistema Respiratorio Reconstruido!' : feedback}</p>
      </div>
      <div className="data-card">
        <dl>
          <dt>Erros</dt>
          <dd>{totalMistakes}</dd>
          <dt>Hint</dt>
          <dd>{activeMistakes >= 3 ? 'Disponivel: procura a zona a pulsar.' : 'Desbloqueia apos 3 tentativas.'}</dd>
        </dl>
      </div>
      <button className="primary-action" onClick={onReset}>Reiniciar exercicio</button>
    </div>
  );
}

function Disclaimer({ onAccept, onLegal }: { onAccept: () => void; onLegal: () => void }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Bem-vindo(a) ao Corpus3D</h2>
        <p>
          Esta aplicacao destina-se a alunos dos 11 aos 14 anos e tem fins exclusivamente educativos. Os modelos 3D e imagens
          ajudam a aprender anatomia, mas nao substituem aconselhamento medico.
        </p>
        <p>Algumas comparacoes mostram efeitos do tabagismo nos pulmoes com objetivo educativo.</p>
        <div className="modal-actions">
          <button className="secondary-action" onClick={onLegal}>Ler aviso completo</button>
          <button className="primary-action" onClick={onAccept}>Compreendi, vamos comecar</button>
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
          'O Corpus3D e uma aplicacao educativa para alunos do 2.º e 3.º ciclos do ensino basico.',
          'A informacao apresentada nao constitui aconselhamento medico, diagnostico ou tratamento.',
          'Para questoes de saude, consulta sempre um profissional qualificado.'
        ]
      };
    }
    if (page === 'creditos') {
      return {
        title: 'Creditos e Atribuicoes',
        body: [
          'Modelos 3D: gerados por IA para este projeto por Jose Antonio Luanda. Sem licencas externas necessarias.',
          'Video local: fornecido na pasta Assets do projeto.',
          'Software: React, Vite, Three.js, React Three Fiber, Drei e Lucide.'
        ]
      };
    }
    return {
      title: 'Politica de Privacidade',
      body: [
        'Esta aplicacao nao recolhe, armazena nem transmite dados pessoais.',
        'As preferencias de utilizacao ficam apenas no armazenamento local do navegador.',
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
        {content.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <small>Ultima atualizacao: 14/05/2026 · Versao da aplicacao: 0.1.0</small>
      </article>
    </main>
  );
}
