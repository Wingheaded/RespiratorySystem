import { Html, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { Activity } from 'lucide-react';
import { Suspense, useMemo, useRef } from 'react';
import { DoubleSide, Group, Mesh, MeshStandardMaterial, Object3D } from 'three';
import { PartId, Structure, ViewMode, structures } from '../data/structures';

interface SceneProps {
  selected: PartId | null;
  hovered: PartId | null;
  onSelect: (id: PartId | null) => void;
  onHover: (id: PartId | null) => void;
  viewMode: ViewMode;
  isolate: boolean;
  ghost: boolean;
  autoRotate: boolean;
  breathing: boolean;
}

function cloneWithMaterial(scene: Object3D, part: Structure, active: boolean, viewMode: ViewMode, muted: boolean) {
  const clone = scene.clone(true);
  clone.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mesh = child as Mesh;
      if (viewMode === 'normal' && !muted && !active) {
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((material) => material.clone());
        } else {
          mesh.material = mesh.material.clone();
        }
      } else {
        const opacity = (viewMode as any) === 'xray' ? 0.28 : muted ? 0.14 : 0.96;
        mesh.material = new MeshStandardMaterial({
          color: active ? '#f8fafc' : part.color,
          emissive: (viewMode as any) === 'xray' || active ? part.color : '#000000',
          emissiveIntensity: active ? 0.12 : (viewMode as any) === 'xray' ? 0.24 : 0,
          roughness: 0.46,
          metalness: 0,
          side: DoubleSide,
          transparent: opacity < 1,
          opacity
        });
      }
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });
  return clone;
}

function FullTexturedModel({
  selected,
  hovered,
  onSelect,
  onHover,
  autoRotate,
  breathing
}: {
  selected: PartId | null;
  hovered: PartId | null;
  onSelect: (id: PartId) => void;
  onHover: (id: PartId | null) => void;
  autoRotate: boolean;
  breathing: boolean;
}) {
  const group = useRef<Group>(null);
  const baseScale = 2.57;
  const { scene } = useGLTF('/models/RespiratorySystem.glb');
  const clone = useMemo(() => {
    const next = scene.clone(true);
    next.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((material) => material.clone());
        } else {
          mesh.material = mesh.material.clone();
        }
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    console.log("GLB Nodes:", next.children.map(c => c.name).join(", "));
    return next;
  }, [scene]);

  const selectedLabel = structures.find((part) => part.id === selected)?.label;
  const hoveredPart = structures.find((part) => part.id === hovered);
  const hotspotPositions: Record<PartId, [number, number, number]> = {
    nasal: [-0.090, 0.370, 0.000],
    pharynx: [0.040, 0.300, 0.000],
    larynx: [-0.015, 0.200, 0.050],
    trachea: [0.030, 0.09, 0.065],
    'main-bronchi': [-0.0, 0.01, 0.080],
    bronchioles: [0.200, -0.250, 0.100],
    'right-lung': [-0.200, -0.100, 0.120],
    'left-lung': [0.230, -0.100, 0.120],
    alveoli: [0.150, -0.190, 0.120],
    diaphragm: [-0.180, -0.350, 0.150]
  };

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    if (autoRotate) group.current.rotation.y += delta * 0.22;
    if (breathing) {
      const breath = Math.sin(clock.elapsedTime * 1.55) * 0.025;
      group.current.scale.set(baseScale + breath, baseScale + breath * 0.5, baseScale + breath);
    }
  });

  return (
    <group ref={group} position={[0, -0.05, 0]} scale={baseScale}>
      <primitive object={clone} />
      {structures.map((part) => {
        const isHovered = hovered === part.id;
        const isSelected = selected === part.id;
        const isActive = isHovered || isSelected;
        
        // Only hide other dots when actively hovering over one
        const hasHoveredElement = hovered !== null;
        
        const isRight = hotspotPositions[part.id][0] >= 0;
        const sideClass = isRight ? 'right' : 'left';

        const opacity = !hasHoveredElement || isHovered ? 1 : 0;
        const pointerEvents = !hasHoveredElement || isHovered ? 'auto' : 'none';

        return (
          <group key={part.id} position={hotspotPositions[part.id]}>
            <Html center zIndexRange={isActive ? [200, 150] : [100, 0]}>
              <div
                className="anatomy-hotspot-container"
                onMouseEnter={() => onHover(part.id)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onSelect(part.id)}
                style={{ 
                  cursor: 'pointer', 
                  opacity, 
                  pointerEvents: pointerEvents as any,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <div className={`anatomy-dot ${isActive ? 'hovered' : ''}`}></div>

                {isActive && (
                  <div className={`anatomy-card ${sideClass}`}>
                    <div className="anatomy-card-header">
                      <div className="anatomy-card-icon">
                        <Activity size={20} />
                      </div>
                      <h4 className="anatomy-card-title">{part.label}</h4>
                    </div>
                    <p className="anatomy-card-desc">{part.shortDescription}</p>
                  </div>
                )}
              </div>
            </Html>
          </group>
        );
      })}
      {!hoveredPart && selectedLabel && (
        <Html position={[0, 1.32, 0]} center className="scene-label" zIndexRange={[50, 0]}>
          {selectedLabel}
        </Html>
      )}
    </group>
  );
}

function AnatomyPart({
  part,
  selected,
  onSelect,
  viewMode,
  isolate,
  ghost,
  breathing
}: {
  part: Structure;
  selected: PartId | null;
  onSelect: (id: PartId) => void;
  viewMode: ViewMode;
  isolate: boolean;
  ghost: boolean;
  breathing: boolean;
}) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(part.model);
  const active = selected === part.id;
  const muted = Boolean(selected && selected !== part.id && (ghost || isolate));
  const visible = !isolate || active || !selected;
  const clone = useMemo(
    () => cloneWithMaterial(scene, part, active, viewMode, muted),
    [scene, part, active, viewMode, muted]
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    const breath = breathing ? Math.sin(clock.elapsedTime * 1.55) : 0;
    if (part.id.includes('lung')) {
      const pulse = 1 + breath * 0.035;
      group.current.scale.setScalar(part.scale * pulse);
    }
    if (part.id === 'diaphragm') {
      group.current.position.y = part.position[1] - breath * 0.08;
    }
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(part.id);
  };

  return (
    <group
      ref={group}
      visible={visible}
      position={part.position}
      rotation={part.rotation ?? [0, 0, 0]}
      scale={part.scale * 1.21}
      onClick={handleClick}
    >
      <primitive object={clone} />
      {active && (
        <Html position={[0, 0.76, 0]} center className="scene-label">
          {part.label}
        </Html>
      )}
    </group>
  );
}

function SceneContent(props: SceneProps) {
  const root = useRef<Group>(null);
  useFrame((_, delta) => {
    if (root.current && props.autoRotate) root.current.rotation.y += delta * 0.22;
  });

  return (
    <>
      <ambientLight intensity={1.6} />
      <hemisphereLight args={['#fff8f2', '#b9d6df', 1.5]} />
      <directionalLight position={[3.5, 5, 6]} intensity={2.8} castShadow />
      <directionalLight position={[-4, 1.6, 3]} intensity={1.2} color="#fff0e5" />
      <pointLight position={[0, 2.5, 4]} color="#ffffff" intensity={1.1} />
      {(props.viewMode as any) === 'normal' ? (
        <FullTexturedModel
          selected={props.selected}
          hovered={props.hovered}
          onSelect={props.onSelect}
          onHover={props.onHover}
          autoRotate={props.autoRotate}
          breathing={props.breathing}
        />
      ) : (
        <group ref={root} position={[0, -0.55, 0]}>
          {structures.map((part) => (
            <AnatomyPart
              key={part.id}
              part={part}
              selected={props.selected}
              onSelect={props.onSelect}
              viewMode={props.viewMode}
              isolate={props.isolate}
              ghost={props.ghost}
              breathing={props.breathing}
            />
          ))}
        </group>
      )}
      <OrbitControls makeDefault enableDamping minDistance={1.8} maxDistance={9.4} target={[0, 0, 0]} />
    </>
  );
}

export default function RespiratoryScene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.08, 4.6], fov: 36 }}
      shadows
      dpr={[1, 1.5]}
      onPointerMissed={() => props.onSelect(null)}
    >
      <color attach="background" args={['#000000']} />
      <Suspense
        fallback={
          <Html center className="loader">
            A carregar modelos 3D...
          </Html>
        }
      >
        <SceneContent {...props} />
      </Suspense>
    </Canvas>
  );
}
