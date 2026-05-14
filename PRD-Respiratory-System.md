# PRD — Interactive Respiratory System Explorer (pt-PT)

**Platform brand:** `Corpus3D` (working name — domain purchase deferred post-MVP)
**Product / first module:** `Respira3D` — Sistema Respiratório
**Author:** José Antonio Luanda
**Date:** 2026-05-11
**Status:** Draft v1.2 — All MVP open questions resolved
**Target ship date:** 2026-05-25 (2 weeks from kickoff)
**MVP deployment:** Vercel preview URL (e.g. `corpus3d.vercel.app`) — custom domain deferred

---

## 1. Executive Summary

An interactive, web-based 3D educational application that teaches the human respiratory system to Portuguese (pt-PT) middle-school students (ages 11–14). Users explore a high-fidelity 3D model of the respiratory tract, learn each organ's structure and function through bite-sized educational text, watch physiological animations (breathing cycle, gas exchange), compare healthy lungs vs. smoker's lungs, and reinforce knowledge via a drag-and-drop assembly exercise.

The app ships as a **Progressive Web App** so it installs and runs offline on the Chromebooks, tablets, and desktops typical of Portuguese state schools (Escola Digital programme).

This is the first product in a planned series of K-12 anatomy/biology explorers (digestive, nervous, circulatory, etc.) sharing the same engine and shell — **the respiratory system is the pilot to validate the platform**.

---

## 2. Goals & Non-Goals

### 2.1 Goals (MVP)

| # | Goal | Success indicator |
|---|------|-------------------|
| G1 | Teach the 10 core structures of the respiratory system | User can name and locate each structure unaided after one session |
| G2 | Demonstrate the breathing mechanism and gas exchange visually | User can describe diaphragm role and O₂/CO₂ exchange in own words |
| G3 | Show the impact of smoking on lung tissue | User can articulate at least 2 differences between healthy and smoker's lung |
| G4 | Run smoothly on a mid-range Chromebook (Intel Celeron, 4 GB RAM) | 30 fps minimum in Explore mode, 24 fps minimum during animations |
| G5 | Work fully offline after first load | All assets cached; no network calls required after install |
| G6 | Be sellable to a Portuguese middle-school science teacher as-is | A teacher can run a 30-minute lesson with zero technical support |

### 2.2 Non-Goals (out of scope for MVP)

- User accounts, progress sync, teacher dashboards
- Multi-language (only pt-PT)
- Other body systems
- Voice narration / TTS
- Gamification (badges, XP, leaderboards)
- Multiplayer or classroom-mode
- Native iOS/Android apps
- Mobile phone layout (tablet is smallest supported form factor)
- Quiz types beyond drag-and-drop
- LMS integration (Google Classroom, Moodle)
- Analytics / telemetry collection
- Monetization, paywall, licensing

### 2.3 V2 candidates (planned, not committed)

- Voice narration (ElevenLabs pt-PT)
- Gamification (badges, XP, streaks)
- Teacher accounts + progress export
- Additional body systems
- LMS deep links
- pt-BR locale
- Mobile phone layout
- Multiple choice and labeling quizzes
- Classroom multiplayer (live drag-and-drop race)

---

## 3. Target Users & Personas

### 3.1 Primary user — "Inês, 12 anos"

- **Age band locked: 11–14 only** (no younger fallback in MVP)
- 6.º or 7.º ano student in a Portuguese state school
- Uses a school-issued Chromebook or family laptop
- Has touched 3D games (Roblox/Minecraft) — drag-and-rotate is intuitive
- Comfortable reading short paragraphs in pt-PT
- Engagement window: 5–15 minutes before switching tasks
- Cognitive load: prefers visual over textual; gets lost in dense diagrams
- Reading level target: **CEFR B1** — no jargon without inline explanation

### 3.2 Secondary user — "Professora Marta, 38 anos"

- Teaches Ciências Naturais to 6º/7º ano
- Has a smartboard or projector in the classroom
- Tech comfort: medium — uses Google Workspace, can install a PWA if instructions are clear
- Wants to run a 30–45 minute lesson with minimal prep
- Will eventually pay €5–15/month for the tool if it saves prep time (V2 monetization signal)
- Needs the content to align with the **Aprendizagens Essenciais — Ciências Naturais 6.º ano** national curriculum

### 3.3 Tertiary — "Pai/Encarregado de educação"

- Helps with homework
- Will use the same install
- Not the buyer for MVP but should not be confused by the UI

---

## 4. MVP Scope

### 4.1 P0 — Must ship

- 3D model of respiratory system, 10 named structures, click-to-select
- Explore Mode: left sidebar (component list), 3D canvas, right panel (educational text in pt-PT), bottom panel (real-world imagery)
- Cross-section / X-ray toggle
- Toolbar: Rotate / Isolate / Hide Others / Reset View
- Breathing animation (diaphragm + lung volume cycle)
- Gas exchange animation (alveolus inset view)
- Compare tool: Healthy lung vs. Smoker's lung (side-by-side)
- Exercise Mode toggle (top-right)
- Drag-and-drop assembly exercise with snap-to-zone, audio cues, hint-after-3-fails, completion celebration
- Full pt-PT localization (all UI strings + educational copy in JSON)
- PWA install + offline mode
- Responsive: desktop (1280px+), tablet (768px+)
- WCAG 2.1 AA conformance

### 4.2 P1 — Ship if time permits (likely cut in 2-week window)

- "Where it occurs" mini human-body locator inside right panel
- Idle micro-animation (gentle breathing while user reads)
- Onboarding tooltip overlay (first launch)
- Print-friendly worksheet export

### 4.3 P2 — Backlog

- Everything in 3.3 V2 candidates

---

## 5. Tech Stack

### 5.1 Confirmed stack

| Layer | Choice | Version (pin) | Why |
|-------|--------|---------------|-----|
| Scaffolding | **Vite** | ^5.4 | Fast HMR, SPA-first, no SSR overhead for WebGL |
| UI framework | **React** | ^18.3 | Component model, ecosystem |
| Language | **TypeScript** | ^5.5 | Type safety on the state shared between UI and 3D |
| 3D renderer | **three.js** | ^0.166 | Underlying WebGL engine |
| 3D React bindings | **@react-three/fiber** | ^8.17 | Declarative 3D in React |
| 3D helpers | **@react-three/drei** | ^9.114 | OrbitControls, Html overlays, useGLTF loader, environment |
| Post-processing | **@react-three/postprocessing** | ^2.16 | Outline effect on selected/highlighted parts |
| Gestures | **@use-gesture/react** | ^10.3 | Cross-device drag (mouse + touch) |
| State | **Zustand** | ^4.5 | Fast, hook-friendly, works inside R3F render loop |
| Styling | **Tailwind CSS** | ^3.4 | Rapid UI build, responsive utilities |
| PWA | **vite-plugin-pwa** | ^0.20 | Service worker, manifest, asset precaching |
| Icons | **lucide-react** | ^0.453 | Lightweight, consistent icon set |
| Audio | **howler.js** | ^2.2 | Reliable Web Audio for snap-success / snap-fail cues |
| Animation (2D) | **framer-motion** | ^11 | Panel transitions, score animations |
| Animation (3D) | **@react-spring/three** | ^9.7 | Smooth snap-into-place tweens for drag-and-drop |
| i18n | **i18next + react-i18next** | latest | Even though MVP is pt-PT only, sets up V2 multi-locale path with zero refactor |
| Routing | **react-router-dom** | ^6 | Two routes initially: `/explorar` and `/exercicio`, but ready to grow |
| Linting | ESLint + Prettier + typescript-eslint | latest | Standard hygiene |
| Testing | Vitest + Testing Library + Playwright | latest | Unit + E2E (smoke test for drag-and-drop) |

### 5.2 Build & deploy

- **Build target:** ES2020, modern browsers only (no IE11 fallback)
- **Hosting:** **Vercel** (free Hobby tier for MVP; static SPA, no SSR needed). Project linked via Vercel GitHub integration; automatic preview deployments per PR and production deployment on `main` push.
- **Domain (MVP):** Vercel's default subdomain (e.g. `corpus3d.vercel.app`). Custom domain (`corpus3d.pt` / `corpus3d.com` or similar) deferred until post-MVP demo round.
- **CI:** GitHub Actions: lint → typecheck → test → build. Deployments handled by Vercel's native GitHub integration (preview per PR, prod on `main`).

### 5.3 Browser & device support matrix

| Browser | Min version | Notes |
|---------|-------------|-------|
| Chrome / Edge / Brave (Chromium) | 110+ | Primary target — Chromebooks |
| Safari | 16+ | iPad target, PWA install via Add to Home Screen |
| Firefox | 115+ | Secondary |
| Samsung Internet | 22+ | Tertiary (Android tablets) |

**WebGL 2 required.** Show a friendly fallback page if unsupported.

**Min hardware**: 4 GB RAM, integrated GPU (Intel UHD 600 class). Target 30 fps@1080p.

---

## 6. Information Architecture

```
/
├── /explorar            (default route, Explore Mode)
│   └── ?parte=traqueia  (deep-linkable selection)
└── /exercicio           (Exercise Mode)
```

State boundary between routes is preserved (selected part, view mode, etc.) so toggling does not reset progress.

---

## 7. Content Model — Respiratory Structures

10 named structures + 2 disease-state variants. Each is a separate mesh in the GLB with a stable name.

| ID | Mesh name | pt-PT label | English (dev) | Notes |
|----|-----------|-------------|---------------|-------|
| 1 | `Cavidade_Nasal` | Cavidade Nasal | Nasal cavity | Includes nostrils, turbinates |
| 2 | `Faringe` | Faringe | Pharynx | Throat section |
| 3 | `Laringe` | Laringe | Larynx | Voice box; includes epiglottis as child |
| 4 | `Traqueia` | Traqueia | Trachea | Windpipe with cartilage rings visible |
| 5 | `Bronquio_Direito` | Brônquio Direito | Right bronchus | |
| 6 | `Bronquio_Esquerdo` | Brônquio Esquerdo | Left bronchus | |
| 7 | `Bronquiolos` | Bronquíolos | Bronchioles | Branching tree, simplified mesh |
| 8 | `Alveolos` | Alvéolos | Alveoli | Cluster mesh, also has detail close-up |
| 9 | `Pulmao_Direito` | Pulmão Direito | Right lung | 3 lobes — superior, médio, inferior |
| 10 | `Pulmao_Esquerdo` | Pulmão Esquerdo | Left lung | 2 lobes — superior, inferior |
| 11 | `Diafragma` | Diafragma | Diaphragm | Animates with breathing cycle |
| — | `Pulmao_Fumador` | (variante doente) | Smoker's lung | Same mesh as #9/#10, different material (dark patches, reduced volume) |

### 7.1 Educational copy template (per structure)

Stored in `src/content/respiratory/pt-PT.json`. One entry per structure:

```json
{
  "traqueia": {
    "label": "Traqueia",
    "shortDescription": "Tubo que liga a laringe aos brônquios.",
    "size": "Aprox. 10–12 cm em adultos",
    "location": "No pescoço e parte superior do tórax",
    "primaryFunction": "Conduzir o ar até aos pulmões",
    "biologyNotes": "A traqueia é um tubo flexível reforçado por anéis de cartilagem em forma de C...",
    "funFact": "Sabias que os anéis de cartilagem da traqueia têm a forma de C (e não de O) para que o esófago, mesmo atrás dela, possa expandir-se quando engoles?",
    "whereItOccurs": "neck-upper-chest"
  }
}
```

All copy must be:
- Validated by a native pt-PT speaker (NOT pt-BR auto-translation)
- Aligned with the **Aprendizagens Essenciais – Ciências Naturais – 6.º ano** vocabulary
- Reading level: middle school (CEFR B1)
- Max 80 words for `biologyNotes`, max 30 words for `funFact`

---

## 8. UX / UI Specification

### 8.1 Global shell

- **Layout**: 4-region grid as per blueprint
  - Left sidebar: 280 px fixed
  - Right sidebar: 360 px fixed
  - Bottom panel: 180 px fixed
  - Center stage: fills remaining space
- **Tablet (768–1279 px)**: bottom panel collapses to icon strip; right sidebar slides over canvas on selection
- **Color palette**:
  - Background: `#0F172A` (slate-900) — dark, focuses attention on the model
  - Accent: `#0EA5E9` (sky-500) — interactive elements
  - Success: `#10B981` (emerald-500) — correct placement
  - Warning: `#F59E0B` (amber-500) — hints
  - Danger: `#EF4444` (red-500) — incorrect placement
  - Text primary: `#F1F5F9` (slate-100)
- **Typography**:
  - Headings: **Manrope** 600
  - Body: **Inter** 400/500
  - Sizes: H1 24/H2 20/H3 16/body 14/caption 12 px
- **Spacing**: Tailwind defaults (4 px base)

### 8.2 Explore Mode — left sidebar

- App logo + name at top (40 px)
- "Sistema Respiratório" header (the only system for MVP, but visually leaves room for the future picker)
- Scrollable list of 10 structures, each row:
  - 24 px colored icon (custom illustrations)
  - pt-PT label
  - Hover: light highlight + tooltip with short description
  - Selected: filled accent background + outline on the corresponding 3D mesh
- Footer: "Modo: Explorar" pill + toggle to Exercise

### 8.3 Explore Mode — center stage

- **Canvas**: full bleed inside center region
- **Lighting**: HDRI environment (drei `<Environment preset="studio">`) + 1 directional key light
- **Camera**: PerspectiveCamera, 50° FOV, initial position framing whole thorax, OrbitControls with damped rotation and pan
- **Interaction prompts** (auto-hide after 5 s or first interaction):
  - "Arrastar para rodar"
  - "Roda do rato para aproximar"
  - "Ctrl + arrastar para deslocar"
- **View toggle** (top of canvas): pill switch — "Vista Normal" / "Corte Transversal" / "Raio-X"
  - Normal: opaque materials
  - Corte: clipping plane through the model (slider to adjust depth)
  - Raio-X: 0.4 opacity + emissive blue tint on visible structures
- **Toolbar (bottom-center of canvas, floating bar)**:
  - Rodar (auto-rotate toggle)
  - Isolar (show only selected)
  - Esconder outros (semi-transparent everyone else)
  - Repor vista (reset camera to initial)
  - Respirar (play/pause breathing animation — diaphragm + lung volume cycle)
- **Selection feedback**: clicked mesh gets an outline post-process effect (cyan, 2 px) and a Drei `<Html>` floating label

### 8.4 Explore Mode — right sidebar

Card stack, top to bottom:

1. **Header card**: large pt-PT label + colored badge matching the left-sidebar icon
2. **Detalhes Rápidos**: 3-row mini table — Tamanho, Localização, Função principal
3. **Notas Biológicas**: scrollable paragraph (max-height 200 px)
4. **Facto Divertido!**: highlighted yellow card with the `funFact` copy
5. **Onde se encontra** (P1, may slip): small SVG of human body silhouette with the relevant region glowing

Empty state (no selection): "Clica numa parte do sistema respiratório para começares a aprender."

### 8.5 Explore Mode — bottom panel

- **Two tabs**: "Imagem Real" | "Comparar"
- **Imagem Real**: real medical imagery related to current selection
  - Trachea → bronchoscopy still + chest X-ray
  - Alveoli → SEM microscopy
  - Lungs → chest X-ray + CT cross-section
  - All images licensed CC-BY or public domain, attribution shown on hover
- **Comparar**: two-slot staging area
  - Slot A: defaults to "Pulmão Saudável"
  - Slot B: defaults to "Pulmão de Fumador"
  - Side-by-side 3D mini-viewports synced (rotating one rotates both)
  - Caption below each lists 2–3 key differences in pt-PT
- For MVP, only the lung healthy-vs-smoker comparison is required. Architecture must allow adding more pairs in V2.

### 8.6 Exercise Mode

- **Toggle** at top right of header: animated switch "Explorar / Exercício"
- **Left panel — Banco de Componentes**:
  - 10 structures listed in *randomized* order each session
  - Each row shows a small 3D thumbnail (rendered via off-screen R3F instance into a `<canvas>` snapshot at first load) + label
  - Once correctly placed, the row is greyed out with a checkmark
- **Center stage — Blueprint**:
  - Translucent wireframe silhouette of the upper torso (single GLB, separate from main model)
  - 10 glowing "drop zones" — invisible mesh colliders at each correct position
  - Drop zones pulse gently when hovered during drag (using @react-spring)
- **Right panel — Score & Feedback**:
  - Score: "0 / 10 corretos"
  - Progress bar (Tailwind, gradient sky → emerald)
  - Mistakes counter (per component)
  - Hint button (greyed out until 3 fails on the same component, then glows)
  - Latest feedback line (e.g., "Excelente! O estômago…" — except respiratory, so "Excelente! A traqueia conduz o ar até aos pulmões.")
- **Drag mechanics**:
  - `@use-gesture/react` for pointer + touch
  - During drag, the dragged component is rendered both in screen-space (cursor follower thumbnail) AND optionally raycast-projected into the 3D scene for snap detection
  - Snap radius: 80 px from drop-zone center in screen space
  - On correct drop:
    - Spring tween into final position (300 ms, ease-out)
    - Opaque material applied
    - Success chime via howler (use existing CC0 sound — `success-chime.mp3`)
    - Right panel: green flash + celebratory pt-PT message
  - On incorrect drop:
    - 200 ms shake tween
    - Soft "boop" sound
    - Component returns to bank
    - Mistake counter increments
- **Completion**:
  - All 10 placed: model fully opaque, breathing animation auto-plays, big "Sistema Respiratório Reconstruído!" overlay (framer-motion fade-in)
  - Restart button + "Voltar a Explorar" button
- **Reset**: button in header to shuffle and restart

### 8.7 Animations

| Animation | Trigger | Implementation |
|-----------|---------|----------------|
| Breathing cycle | Toolbar "Respirar" button or Exercise completion | Morph targets on lung mesh + diaphragm Y-translation, 4 s loop |
| Gas exchange (alveolus close-up) | Click on Alvéolos when at high zoom OR dedicated "Ver troca gasosa" button on the alvéolos card | Modal R3F inset: instanced spheres (red = O₂, blue = CO₂) traveling across the alveolar wall, 6 s loop |
| Snap-into-place | Correct drop in exercise | @react-spring tween, 300 ms |
| Shake (wrong drop) | Incorrect drop | @react-spring keyframe, 200 ms |
| Idle micro-rotation | When nothing selected for 10 s | Slow Y rotation, 0.1 rad/s (P1) |

### 8.8 Audio

- **Snap-correct chime**: 0.3 s, soft mallet, +6 LUFS
- **Snap-incorrect boop**: 0.2 s, low woodblock
- **Completion fanfare**: 1.5 s, soft brass + chime stack
- Master volume toggle in header. Default ON; respect Reduce Motion / system "silenced" hints.

---

## 9. Functional Requirements (numbered)

### FR-1 — Component selection
**FR-1.1** Clicking a structure in the 3D canvas selects it and updates the right sidebar.
**FR-1.2** Clicking a row in the left sidebar selects the same structure and highlights it in the 3D canvas.
**FR-1.3** Selection state survives view-mode changes.
**FR-1.4** Deep-link `?parte=traqueia` opens the app with that structure selected.

### FR-2 — View modes
**FR-2.1** Toggle between Vista Normal, Corte Transversal, Raio-X.
**FR-2.2** Cross-section uses a draggable plane slider (left-right) to control cut depth.
**FR-2.3** All view modes preserve current selection.

### FR-3 — Toolbar
**FR-3.1** Rotate (auto-rotate around vertical axis at 0.2 rad/s).
**FR-3.2** Isolate (hide all non-selected meshes).
**FR-3.3** Hide Others (set non-selected to 0.25 opacity).
**FR-3.4** Reset View (camera + state to initial pose).
**FR-3.5** Respirar (play/pause breathing animation).

### FR-4 — Educational content
**FR-4.1** Every structure has all 6 content fields populated.
**FR-4.2** Content is loaded from a single JSON file at build time.
**FR-4.3** Right sidebar updates within 50 ms of selection change.

### FR-5 — Compare tool
**FR-5.1** Bottom panel "Comparar" tab loads two synchronized R3F viewports.
**FR-5.2** Camera rotation is mirrored between A and B.
**FR-5.3** Predefined pair available at MVP: Healthy vs. Smoker's lung.

### FR-6 — Exercise mode (drag-and-drop)
**FR-6.1** Toggle from header switches route and resets exercise state.
**FR-6.2** All 10 structures must be placeable. Order is randomized per session.
**FR-6.3** Snap radius is 80 px; configurable in code.
**FR-6.4** Hint button unlocks after 3 incorrect drops of the same component.
**FR-6.5** Hint highlights the correct drop zone for 2 s with a pulsing emerald glow.
**FR-6.6** Audio cues fire on every drop event (correct/incorrect).
**FR-6.7** Completion triggers celebration overlay and unlocks restart.

### FR-7 — PWA / offline
**FR-7.1** Service worker pre-caches: app shell, all GLB models, all real-world images, audio files, pt-PT JSON.
**FR-7.2** Total precache budget: ≤ 35 MB.
**FR-7.3** App launches and runs identically when offline.
**FR-7.4** Update prompt appears on next launch when a new SW is available.

### FR-8 — Accessibility
**FR-8.1** WCAG 2.1 AA conformance for all UI controls.
**FR-8.2** Keyboard navigation: Tab cycles all controls; Space/Enter activates.
**FR-8.3** All non-decorative images have alt text in pt-PT.
**FR-8.4** Color contrast ≥ 4.5:1 for text on background.
**FR-8.5** Focus rings visible (2 px sky-400 ring + offset).
**FR-8.6** Respects `prefers-reduced-motion`: disables auto-rotate, idle micro-animation, shake; replaces snap tween with instant placement.
**FR-8.7** Screen-reader: ARIA labels on all interactive 3D handles; live region announces drop results in exercise mode.
**FR-8.8** Drag-and-drop has a keyboard fallback: focus a bank item, press Enter to "pick up", arrow keys to cycle drop zones, Enter to drop.

### FR-9 — Internationalization plumbing
**FR-9.1** All user-facing strings live in `src/locales/pt-PT/*.json`.
**FR-9.2** No hardcoded user-facing strings anywhere in `.tsx` / `.ts`.
**FR-9.3** i18next initialized with pt-PT only; structure ready for future locales.

### FR-10 — Performance
**FR-10.1** 30 fps minimum on baseline hardware (Intel Celeron N4500, 4 GB RAM, integrated graphics).
**FR-10.2** First Contentful Paint < 2.5 s on a 10 Mbps connection.
**FR-10.3** Time to Interactive < 5 s.
**FR-10.4** Bundle (gzipped JS) < 600 KB; total assets < 35 MB.
**FR-10.5** No memory leak across 30-minute session (heap stable ± 10%).

---

## 10. Architecture Overview

### 10.1 Directory layout

```
src/
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   └── PwaUpdatePrompt.tsx
├── shell/
│   ├── LeftSidebar.tsx
│   ├── RightSidebar.tsx
│   ├── BottomPanel.tsx
│   ├── Header.tsx
│   └── ModeToggle.tsx
├── explore/
│   ├── ExploreScene.tsx
│   ├── RespiratoryModel.tsx
│   ├── ViewModeToggle.tsx
│   ├── Toolbar.tsx
│   └── BreathingAnimation.tsx
├── exercise/
│   ├── ExerciseScene.tsx
│   ├── ComponentBank.tsx
│   ├── Blueprint.tsx
│   ├── DropZones.tsx
│   ├── DragController.ts
│   ├── ScorePanel.tsx
│   └── CompletionOverlay.tsx
├── three/
│   ├── loaders.ts          // useGLTF wrappers, KTX2 setup
│   ├── materials.ts
│   ├── outlineEffect.tsx
│   └── camera.ts
├── state/
│   ├── exploreStore.ts     // Zustand: selection, viewMode, toolbar
│   ├── exerciseStore.ts    // Zustand: placed, mistakes, hintsUsed
│   └── audioStore.ts
├── content/
│   └── respiratory/
│       ├── pt-PT.json
│       └── realImages.json
├── locales/
│   └── pt-PT/
│       ├── common.json
│       └── exercise.json
├── components/             // generic UI atoms
├── hooks/
├── styles/
│   └── index.css
├── main.tsx
└── vite-env.d.ts

public/
├── models/
│   ├── respiratory.glb            // 5–8 MB target, draco-compressed
│   ├── respiratory-smoker.glb     // delta for compare tool
│   └── blueprint-torso.glb
├── images/
│   └── real/                      // X-rays, MRIs, microscopy
├── audio/
│   ├── snap-correct.mp3
│   ├── snap-wrong.mp3
│   └── completion.mp3
├── icons/                         // PWA + UI
└── manifest.webmanifest
```

### 10.2 State management — Zustand stores

```ts
// exploreStore
interface ExploreState {
  selectedPartId: string | null;
  viewMode: 'normal' | 'cross-section' | 'xray';
  isolateMode: boolean;
  hideOthers: boolean;
  autoRotate: boolean;
  breathing: boolean;
  crossSectionDepth: number; // 0..1
  compareTab: 'real' | 'compare';

  setSelected(id: string | null): void;
  setViewMode(mode: ExploreState['viewMode']): void;
  toggleIsolate(): void;
  // ...
}

// exerciseStore
interface ExerciseState {
  bank: string[];                     // ordered list of remaining IDs
  placed: Record<string, boolean>;    // partId -> placed correctly
  mistakes: Record<string, number>;   // partId -> # wrong attempts
  hintsUsedFor: Set<string>;
  draggingId: string | null;
  completed: boolean;
  startedAt: number;

  pickUp(id: string): void;
  attemptDrop(id: string, zoneId: string): { correct: boolean };
  useHint(id: string): void;
  reset(): void;
}
```

**Rule:** R3F render-loop subscribers use `useStore` selectors with shallow equality. UI components use the same store via standard hooks. No prop drilling for state shared between 2D and 3D.

### 10.3 3D asset pipeline

1. **Source**: 1 GLB containing the full respiratory model with named children matching §7.
2. **Required mesh names** must be exact — pipeline validates at build time via a script (`scripts/validate-glb.mjs`) that fails the build if any expected name is missing.
3. **Compression**: Draco geometry compression + KTX2 textures (Basis-Universal). Target full model ≤ 8 MB.
4. **Coordinate system**: Y-up, scale 1 unit = 1 cm.
5. **Origin**: thoracic centroid at world origin so that camera reset is trivial.
6. **Drop zones (exercise)**: stored in a JSON next to the blueprint GLB:
   ```json
   { "Traqueia": { "position": [0, 12, 0], "radius": 6 } }
   ```

### 10.4 Service worker strategy (vite-plugin-pwa)

- **Strategy**: `injectManifest` with custom Workbox config
- **Precache**: app shell, GLB models, real images, audio, locale JSON
- **Runtime cache**: fonts (CacheFirst, 1 year), Cloudflare-hosted thumbnails (StaleWhileRevalidate, 30 days)
- **Update flow**: on new SW available, show a non-blocking toast with "Atualizar" button

---

## 11. 3D Model Production Plan (Free CC-BY / Public Domain workflow)

**Decision (locked 2026-05-11):** Skip AI-generation services for MVP. Use free public-domain and CC-BY anatomical models from established repositories. Saves €20–40/month in subscriptions, eliminates anatomical-accuracy risk, gives bulletproof commercial licensing.

### 11.1 Asset sourcing — order of preference

1. **NIH 3D Print Exchange** ([3d.nih.gov/library](https://3d.nih.gov/library)) — public domain anatomical models authored by clinicians. ✅ Cleanest license (CC0). First search.
2. **Sketchfab** filtered: `Downloadable` + `Commercial use allowed` + license `CC-BY`. ✅ Commercial use OK with attribution.
3. **Wikimedia Commons 3D** — variable quality, per-file license check required.
4. **BodyParts3D** — **reference only, do NOT ship**. CC-BY-SA share-alike clause would force open-licensing of derivative GLBs. Use it open in Blender as anatomical reference while modeling, then discard.

**Hard rule:** any asset with `CC-BY-NC` or `CC-BY-NC-SA` is **rejected** — Corpus3D will eventually be commercial.

Every accepted asset is logged in [docs/asset-license-log.md](asset-license-log.md) at download time. No exceptions.

### 11.2 Cleanup workflow in Blender (free)

1. Import sourced model (OBJ/STL/GLB)
2. Re-center to origin (Y-up, scale 1 unit = 1 cm)
3. Re-topologize if poly count > 50k per organ
4. **Separate into named children matching §7** — this is critical for click-picking and drag-snap-zones; the build-time validator script `scripts/validate-glb.mjs` will fail if names are missing
5. Apply standard PBR materials in the PRD color palette with emissive masks for X-ray mode (this is also where multiple sources get unified visually)
6. Add morph targets for breathing animation (lungs expanded/contracted shape keys)
7. Add diaphragm bone for the breathing animation
8. Decimate to target poly count (full model ≤ 200k tris)
9. Bake textures to 1024×1024 KTX2
10. Draco-compress geometry on export → Blender → File → Export → glTF 2.0 → enable Draco
11. Validate: run `scripts/validate-glb.mjs`

**Time budget:** 4–8 hours total for the full respiratory model + blueprint silhouette + smoker's lung variant.

### 11.3 Smoker's-lung variant

Same base mesh as the healthy lung. Variant is achieved by:

- Darker material with patchy black/brown emissive map (representing tar deposits)
- Slightly reduced volume morph target (representing emphysema)
- Different file: `respiratory-smoker.glb`

No separate sourcing needed.

### 11.4 Real-world imagery sourcing

| Asset | Source | License |
|-------|--------|---------|
| Chest X-ray (frontal) | NIH ChestX-ray14 dataset | Public domain |
| Bronchoscopy still | Wikimedia Commons | CC-BY-SA |
| Alveoli SEM | Wikimedia Commons (multiple contributors) | CC-BY-SA |
| Smoker's lung gross pathology | CDC public domain image library | Public domain |
| CT chest cross-section | Radiopaedia (selected cases marked CC-BY-NC-SA — verify per image) | CC-BY-NC-SA |

All images stored in `public/images/real/` with attribution in `realImages.json`.

---

## 12. Localization

- **MVP locale**: pt-PT only. en-GB is **deferred to v1.1**, not the MVP.
- **Plumbing now, content later**: i18next + JSON-per-locale architecture is in place from day 1 so v1.1 is a content-only effort (no refactor). All strings in `src/locales/pt-PT/*.json`; NO hardcoded user-facing copy anywhere in `.tsx`/`.ts`.
- **Validation owner**: José (native pt-PT, project author). Doubles as content writer and reviewer for the MVP.
- **Self-review risk mitigation** (recommended, not required): one 30-minute read-through by an independent reader with kids in the 11–14 band before launch, to catch tone/age-appropriateness issues that the writer is too close to see. Free, optional.
- **Critical**: do NOT auto-translate from pt-BR or English. Vocabulary differences (e.g., pt-BR "trato respiratório" vs pt-PT "aparelho respiratório") will be flagged by teachers.
- **Number formatting**: pt-PT uses comma as decimal separator.
- **Curriculum alignment**: terminology cross-checked against **DGE — Aprendizagens Essenciais, Ciências Naturais, 6.º ano e 7.º ano**.
- **Locale detection (forward compatibility)**: even in MVP, set `<html lang="pt-PT">` and initialize i18next with explicit `lng: 'pt-PT'` so adding `en-GB` in v1.1 is a config flip, not a rewrite.

---

## 13. Accessibility — Detailed checklist

| Criterion | Requirement | Verification |
|-----------|-------------|--------------|
| 1.1.1 Non-text content | Alt text on all images | Manual audit |
| 1.4.3 Contrast | ≥ 4.5:1 body, ≥ 3:1 large text | axe-core scan |
| 1.4.11 Non-text contrast | ≥ 3:1 for UI components and focus rings | axe-core |
| 2.1.1 Keyboard | All functionality keyboard-accessible | Manual test |
| 2.1.2 No keyboard trap | Tab cycles cleanly | Manual test |
| 2.4.7 Focus visible | 2 px ring + offset | CSS audit |
| 2.5.1 Pointer gestures | Drag-and-drop has keyboard alternative (FR-8.8) | Manual test |
| 2.5.7 Dragging movements | Single-pointer alternative exists | Manual test |
| 3.1.1 Language of page | `<html lang="pt-PT">` | HTML audit |
| 3.3.1 Error identification | Wrong drops announced via aria-live | Screen reader test |
| 4.1.3 Status messages | Score updates and drops use aria-live="polite" | Screen reader test |

Pre-launch run: axe-core CLI + manual NVDA pass.

---

## 14. Performance Budget

| Metric | Budget | Tool |
|--------|--------|------|
| JS bundle (gzipped, initial) | ≤ 600 KB | rollup-plugin-visualizer |
| Total assets precached | ≤ 35 MB | SW manifest size check |
| FCP | ≤ 2.5 s | Lighthouse on baseline hardware |
| TTI | ≤ 5 s | Lighthouse |
| Frame rate (Explore) | ≥ 30 fps | Stats.js in dev |
| Frame rate (animations) | ≥ 24 fps | Stats.js in dev |
| Memory (30 min session) | Heap stable ± 10% | Chrome DevTools |

Optimizations applied:
- Code splitting per route
- Lazy-load Exercise route
- KTX2 textures, Draco geometry
- `<Suspense>` boundaries with progress UI on first load
- Instanced meshes for alveoli cluster
- Frustum culling on by default in R3F

---

## 15. Privacy, Security, Compliance

- **No personal data collection** in MVP
- **No analytics / telemetry** in MVP
- **No third-party requests** at runtime after install (everything cached)
- **GDPR**: app handles no personal data → minimal exposure, but a short privacy notice page (pt-PT) explaining this still required because target users are minors. Full text in [legal-pages-pt-PT.md §4](legal-pages-pt-PT.md).
- **Legal surface** (locked at v1.2):
  - First-launch dismissable modal (`localStorage` key `corpus3d.disclaimerAccepted`) — text in [legal-pages-pt-PT.md §1](legal-pages-pt-PT.md)
  - `/aviso-legal` route — full disclaimer
  - `/creditos` route — attributions, generated from `docs/asset-license-log.md`
  - `/privacidade` route — privacy notice
  - Footer link visible on every screen: `Aviso Legal · Créditos · Privacidade`
- **Pathology-imagery softening** (P0): smoker's-lung gross-pathology photo is hidden behind a "Ver imagem real" toggle in the Compare tool; the default view shows the stylized 3D variant. Age-appropriateness for the 11-year-old end of the range.
- **CSP header** (via Vercel `headers()` in `vercel.json`): default-src 'self', script-src 'self', no inline scripts except hashed
- **Subresource Integrity** on any external script (there should be none in MVP)
- **No service worker scope leak**: limit SW scope to app origin only

---

## 16. Testing Strategy

| Layer | Tooling | Coverage target |
|-------|---------|-----------------|
| Unit (state, pure logic) | Vitest | ≥ 80% on stores and drop-detection logic |
| Component | React Testing Library | Critical UI atoms |
| E2E smoke | Playwright | 1 happy-path script: open → select → toggle exercise → complete → see completion overlay |
| Visual regression | (V2 — skip MVP) | — |
| Accessibility | axe-core (Playwright integration) | 0 violations |
| Manual | Real Chromebook + iPad device test | Sign-off before ship |

---

## 17. Timeline — 2 Weeks

This is aggressive. Listing realistically:

### Week 1 — Foundation + Explore Mode

| Day | Deliverable |
|-----|-------------|
| D1 | Vite + R3F + Tailwind + Zustand scaffold; PWA plugin configured; Vercel project linked; CI green |
| D2 | App shell layout (4 regions), routing, header, mode toggle (visual only). **In parallel**: download candidate 3D models from NIH 3D Print Exchange |
| D3 | First-pass 3D model loaded, camera + OrbitControls, click-to-select with outline. **In parallel**: start Blender cleanup (mesh naming, materials) |
| D4 | Left sidebar list, right sidebar content cards, pt-PT copy file with all 10 entries drafted (José authoring) |
| D5 | View modes (normal / cross-section / X-ray), toolbar (rotate/isolate/hide/reset). **Final model lands in repo** — replaces placeholder |
| D6 | Breathing animation, gas exchange close-up. Legal pages routes (`/aviso-legal`, `/creditos`, `/privacidade`) wired in from [legal-pages-pt-PT.md](legal-pages-pt-PT.md) |
| D7 | Bottom panel — real images tab + compare tab (with healthy + smoker variant). First-launch disclaimer modal |

### Week 2 — Exercise Mode + Polish

| Day | Deliverable |
|-----|-------------|
| D8 | Exercise route shell, component bank, blueprint silhouette mesh, drop-zone metadata |
| D9 | Drag controller (mouse + touch), snap detection, success/failure feedback, audio cues |
| D10 | Score panel, hints, completion overlay |
| D11 | PWA offline test on Chromebook, accessibility pass with axe. Pathology-image softening toggle implemented |
| D12 | Smoker's-lung variant material/shape keys finalized. José completes self-review of pt-PT copy |
| D13 | E2E test, performance pass, bundle audit. [asset-license-log.md](asset-license-log.md) populated with final asset list |
| D14 | Buffer / bug fixes / optional 30-min independent reader pass on copy / teacher walkthrough demo |

### Critical-path risks

1. **3D model production** (was #1 risk under AI route — substantially reduced under the free-asset route). Watch: anatomical separability of downloaded models. If a single GLB can't be cleanly separated into the 10 named children, source piecewise across NIH + Sketchfab and recombine. Hard deadline D5.
2. **pt-PT copy review**: José is both writer and reviewer. Risk = blind spots. Mitigation = the optional D14 independent reader pass.
3. **Drop-zone calibration**: budget half a day for tuning positions and radii against the silhouette.
4. **Legal page integration**: usually a Day-13 afterthought that slips — folded into D6 explicitly to prevent this.

---

## 18. Open Questions / Decisions Resolved

### All MVP decisions locked (2026-05-11)

| # | Question | Decision |
|---|----------|----------|
| RES-1 | Hosting | **Vercel** (Hobby tier; native GitHub integration) |
| RES-2 | Age band | **11–14 only** (6.º and 7.º ano focus); no younger fallback |
| RES-3 | Locale strategy for MVP | **pt-PT only**. i18n plumbing in place; English added in v1.1 post-launch |
| RES-4 | Custom domain for MVP | **Deferred** — use Vercel default subdomain (e.g. `corpus3d.vercel.app`) for MVP demo round. Buy `corpus3d.pt`/`.com` post-MVP when ready for public launch |
| RES-5 | Brand / platform name | **Corpus3D** (platform). First module: **Respira3D — Sistema Respiratório**. Logo commission deferred until post-MVP; placeholder typographic logo in MVP |
| RES-6 | pt-PT content reviewer | **José himself** (native pt-PT, project author). Recommended free mitigation: 30-min independent read-through by someone with kids 11–14 before launch |
| RES-7 | Medical-imagery / legal disclaimer | **Approved and drafted** in [legal-pages-pt-PT.md](legal-pages-pt-PT.md): first-launch modal + `/aviso-legal` + `/creditos` + `/privacidade` routes |
| RES-8 | 3D model licensing strategy | **Free public-domain / CC-BY route only.** NIH 3D Print Exchange first, Sketchfab CC-BY fallback. AI generation services rejected for MVP (cost + accuracy risk). All assets tracked in [asset-license-log.md](asset-license-log.md) |

### Deferred to v1.1 / post-MVP

- Custom domain purchase (Corpus3D platform brand)
- Logo commission (Fiverr or similar, ~€80, post-MVP)
- English (en-GB) locale + language toggle UI
- Independent pt-PT review by a Ciências Naturais teacher (in advance of paid B2B sales to teachers)

---

## 19. Future Roadmap (post-MVP)

- **v1.1** — English (en-GB) locale + language toggle in header; "Where it Occurs" mini locator; idle micro-animation; print worksheet export. Target effort: ~1 week post-launch (≈3–5 days content + ~2 days QA across both locales).
- **v1.2** — Additional comparison pairs (asthmatic vs healthy bronchi, COVID-affected lung)
- **v2.0** — Gamification (XP, badges, streaks), accounts, teacher dashboard
- **v2.1** — Voice narration (pt-PT + en-GB, ElevenLabs)
- **v2.2** — Additional body systems sharing the same engine: digestive, circulatory, nervous
- **v2.3** — Classroom multiplayer mode
- **v2.4** — pt-BR locale, then es-ES
- **v3.0** — Native iOS/Android wrappers via Capacitor if PWA limits hit on iOS

### v1.1 language-toggle implementation notes (placeholder for now)

- UI: pill toggle in the header (right of mode toggle), `PT | EN` with current locale highlighted
- Persists choice to `localStorage` (`respira3d.locale`)
- Default locale on first launch: detect from `navigator.language` → fall back to pt-PT if no match
- All `src/locales/pt-PT/*.json` mirrored under `src/locales/en-GB/*.json`
- Content review owner: native en-GB reviewer (TBD at v1.1 kickoff)

---

## 20. Appendix A — Sample pt-PT copy (for tone calibration)

> **Traqueia**
> A traqueia é um tubo flexível que liga a laringe aos brônquios. Está reforçada por cerca de 16 a 20 anéis de cartilagem em forma de C, que a impedem de fechar quando respiras. A face de trás é mole, para que o esófago — que passa por trás — se possa expandir quando engoles.
>
> **Facto Divertido!**
> Se esticasses a tua traqueia, ela teria mais ou menos o comprimento de uma régua escolar.

> **Alvéolos**
> Os alvéolos são pequenos sacos no fim dos bronquíolos onde acontece a magia: é aqui que o oxigénio passa para o sangue e o dióxido de carbono sai do sangue para o ar. Cada pulmão tem cerca de 300 milhões deles.
>
> **Facto Divertido!**
> Se abrisses todos os alvéolos de um adulto e os pusesses lado a lado, cobririam um campo de ténis.

---

**End of PRD v1.0**
