import { PartId, structures } from '../data/structures';

type ExercisePhase = 'parts' | 'review' | 'labels' | 'complete';
type DragItem = { kind: 'part' | 'label'; id: PartId } | null;

interface ExerciseSceneProps {
  phase: ExercisePhase;
  placedParts: Set<PartId>;
  placedLabels: Set<PartId>;
  dragging: DragItem;
  highlightedId: PartId | null;
  onDrop: (zoneId: PartId) => void;
  onSelectTarget: (zoneId: PartId) => void;
}

const worksheetTargets: Record<
  PartId,
  { slotX: number; slotY: number; pointX: number; pointY: number; side: 'left' | 'right' }
> = {
  nasal: { slotX: 21, slotY: 8, pointX: 45, pointY: 23, side: 'right' },
  pharynx: { slotX: 85, slotY: 10, pointX: 52, pointY: 29, side: 'left' },
  larynx: { slotX: 86, slotY: 29, pointX: 51, pointY: 35, side: 'right' },
  trachea: { slotX: 20, slotY: 27, pointX: 50, pointY: 43, side: 'left' },
  'main-bronchi': { slotX: 86, slotY: 71, pointX: 51, pointY: 52, side: 'right' },
  bronchioles: { slotX: 24, slotY: 67, pointX: 43, pointY: 66, side: 'left' },
  alveoli: { slotX: 76, slotY: 90, pointX: 61, pointY: 67, side: 'right' },
  'right-lung': { slotX: 16, slotY: 46, pointX: 40, pointY: 57, side: 'left' },
  'left-lung': { slotX: 86, slotY: 49, pointX: 59, pointY: 50, side: 'right' },
  diaphragm: { slotX: 30, slotY: 91, pointX: 50, pointY: 77, side: 'left' }
};

export default function ExerciseScene({
  phase,
  placedParts,
  placedLabels,
  dragging,
  highlightedId,
  onDrop,
  onSelectTarget
}: ExerciseSceneProps) {
  const showPartTargets = phase === 'parts' || phase === 'review';
  const showLabelTargets = phase === 'labels' || phase === 'complete';

  return (
    <div className="exercise-scene static-exercise-scene">
      <div className="worksheet-board">
        <img
          className={phase === 'parts' ? 'worksheet-atlas silhouette' : 'worksheet-atlas confirmed'}
          src="/images/anatomy/RespiratorySystem02.png"
          alt="Sistema respiratorio com zonas de exercicio"
        />

        <svg className="worksheet-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {structures.map((part) => {
            const target = worksheetTargets[part.id];
            return (
              <line
                key={part.id}
                x1={target.slotX}
                y1={target.slotY}
                x2={target.pointX}
                y2={target.pointY}
                style={{ stroke: part.color }}
              />
            );
          })}
        </svg>

        {structures.map((part) => {
          const target = worksheetTargets[part.id];
          return (
            <span
              key={part.id}
              className="worksheet-pin"
              style={{ left: `${target.pointX}%`, top: `${target.pointY}%`, borderColor: part.color }}
            />
          );
        })}

        {showPartTargets &&
          structures.map((part) => {
            const target = worksheetTargets[part.id];
            const isPlaced = placedParts.has(part.id);
            return (
              <button
                key={part.id}
                className={[
                  'image-drop-target',
                  target.side,
                  dragging?.kind === 'part' ? 'ready' : '',
                  isPlaced ? 'placed' : '',
                  highlightedId === part.id ? 'hinted' : ''
                ].join(' ')}
                style={{
                  left: `${target.slotX}%`,
                  top: `${target.slotY}%`,
                  borderColor: part.color
                }}
                disabled={isPlaced}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => onDrop(part.id)}
                onClick={() => onSelectTarget(part.id)}
                aria-label={`Zona da estrutura ${part.label}`}
              >
                {isPlaced ? (
                  <img src={part.image} alt="" />
                ) : (
                  <>
                    <span className="placeholder-plus" />
                    <span>Solta a imagem aqui</span>
                  </>
                )}
              </button>
            );
          })}

        {showLabelTargets &&
          structures.map((part) => {
            const target = worksheetTargets[part.id];
            const isPlaced = placedLabels.has(part.id);
            return (
              <button
                key={part.id}
                className={[
                  'label-drop-target',
                  target.side,
                  dragging?.kind === 'label' ? 'ready' : '',
                  isPlaced ? 'placed' : '',
                  highlightedId === part.id ? 'hinted' : ''
                ].join(' ')}
                style={{
                  left: `${target.slotX}%`,
                  top: `${target.slotY}%`,
                  borderColor: part.color
                }}
                disabled={isPlaced}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => onDrop(part.id)}
                onClick={() => onSelectTarget(part.id)}
                aria-label={`Etiqueta de ${part.label}`}
              >
                <span className="label-anchor" style={{ background: part.color }} />
                <span>{isPlaced ? part.label : 'Solta o nome aqui'}</span>
              </button>
            );
          })}
      </div>
    </div>
  );
}
