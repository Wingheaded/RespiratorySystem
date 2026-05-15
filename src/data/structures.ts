export type PartId =
  | 'nasal'
  | 'pharynx'
  | 'larynx'
  | 'trachea'
  | 'main-bronchi'
  | 'bronchioles'
  | 'alveoli'
  | 'right-lung'
  | 'left-lung'
  | 'diaphragm';

export type ViewMode = 'normal' | 'xray' | 'section';

export interface Structure {
  id: PartId;
  label: string;
  model: string;
  image: string;
  audio?: string;
  color: string;
  shortDescription: string;
  size: string;
  location: string;
  primaryFunction: string;
  biologyNotes: string;
  funFact: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: number;
}

export const structures: Structure[] = [
  {
    id: 'nasal',
    label: 'Cavidade Nasal',
    model: '/models/nasalCavity.glb',
    image: '/images/anatomy/NasalCavity.png',
    audio: '/audio/NasalCavity.wav',
    color: '#d98264',
    shortDescription: 'Entrada do ar, onde este é filtrado, aquecido e humedecido.',
    size: 'Cerca de 7 cm de profundidade',
    location: 'Interior do nariz e parte superior da face',
    primaryFunction: 'Preparar o ar antes de chegar aos pulmões',
    biologyNotes:
      'A cavidade nasal tem pequenos pelos e muco que prendem poeiras e microrganismos. Também aquece e humedece o ar, protegendo as vias respiratórias mais profundas.',
    funFact: 'Respirar pelo nariz ajuda o corpo a defender-se melhor do ar frio, seco ou com partículas.',
    position: [0, 2.9, 0],
    scale: 0.34
  },
  {
    id: 'pharynx',
    label: 'Faringe',
    model: '/models/Pharynx.glb',
    image: '/images/anatomy/Pharynx.png',
    audio: '/audio/Pharynx.wav',
    color: '#c85e64',
    shortDescription: 'Passagem comum ao ar e aos alimentos, situada atrás da boca e do nariz.',
    size: 'Aprox. 12 a 14 cm',
    location: 'Garganta',
    primaryFunction: 'Conduzir o ar até à laringe',
    biologyNotes:
      'A faringe funciona como uma zona de passagem. Quando respiramos, o ar segue para a laringe; quando engolimos, os alimentos seguem para o esófago.',
    funFact: 'A faringe participa na respiração, na deglutição e até na produção de alguns sons.',
    position: [0, 2.0, 0],
    scale: 0.45
  },
  {
    id: 'larynx',
    label: 'Laringe',
    model: '/models/larynx.glb',
    image: '/images/anatomy/larynx.png',
    audio: '/audio/Larynx.wav',
    color: '#dec293',
    shortDescription: 'Estrutura onde se encontram as cordas vocais.',
    size: 'Aprox. 4 a 5 cm',
    location: 'Pescoço, por cima da traqueia',
    primaryFunction: 'Proteger a via respiratória e produzir voz',
    biologyNotes:
      'A laringe deixa o ar passar para a traqueia e contém as cordas vocais. Uma pequena tampa, a epiglote, ajuda a impedir que comida entre nas vias respiratórias.',
    funFact: 'A tua voz muda porque as cordas vocais vibram de formas diferentes.',
    position: [0, 1.35, 0],
    scale: 0.42
  },
  {
    id: 'trachea',
    label: 'Traqueia',
    model: '/models/Trachea.glb',
    image: '/images/anatomy/trachea.png',
    audio: '/audio/Trachea.wav',
    color: '#89b8d0',
    shortDescription: 'Tubo que liga a laringe aos brônquios.',
    size: 'Aprox. 10 a 12 cm em adultos',
    location: 'Pescoço e parte superior do tórax',
    primaryFunction: 'Conduzir o ar até aos pulmões',
    biologyNotes:
      'A traqueia é um tubo flexível reforçado por anéis de cartilagem. Esses anéis impedem que a traqueia feche quando o ar entra e sai.',
    funFact: 'Os anéis da traqueia parecem a letra C para o esófago poder expandir quando engoles.',
    position: [0, 0.58, 0],
    scale: 0.47
  },
  {
    id: 'main-bronchi',
    label: 'Brônquios Principais',
    model: '/models/MainBronchi.glb',
    image: '/images/anatomy/MainBronchi.png',
    audio: '/audio/MainBronchi.wav',
    color: '#73bfb1',
    shortDescription: 'Dois tubos que levam o ar da traqueia para cada pulmão.',
    size: 'Alguns centímetros cada',
    location: 'Entrada dos pulmões',
    primaryFunction: 'Dividir o fluxo de ar pelos dois pulmões',
    biologyNotes:
      'Os brônquios principais ramificam-se a partir da traqueia. Um segue para o pulmão direito e outro para o pulmão esquerdo, como dois ramos de uma árvore.',
    funFact: 'O brônquio direito é normalmente mais largo e vertical do que o esquerdo.',
    position: [0, -0.18, 0.02],
    scale: 0.48
  },
  {
    id: 'bronchioles',
    label: 'Bronquíolos',
    model: '/models/Bronchioles.glb',
    image: '/images/anatomy/Bronchioles.png',
    audio: '/audio/Bronchioles.wav',
    color: '#d9b85f',
    shortDescription: 'Ramificações muito finas dentro dos pulmões.',
    size: 'Menos de 1 mm de diâmetro nos ramos pequenos',
    location: 'Interior dos pulmões',
    primaryFunction: 'Distribuir o ar até aos alvéolos',
    biologyNotes:
      'Os bronquíolos são tubos cada vez mais pequenos. Levam o ar até zonas profundas dos pulmões, onde se encontram os alvéolos.',
    funFact: 'O seu desenho lembra uma árvore invertida dentro do peito.',
    position: [0, -0.75, 0.02],
    scale: 0.52
  },
  {
    id: 'alveoli',
    label: 'Alvéolos',
    model: '/models/Alvioli.glb',
    image: '/images/anatomy/Alvioli.png',
    audio: '/audio/Alvioli.wav',
    color: '#c76893',
    shortDescription: 'Pequenos sacos onde o oxigénio entra no sangue.',
    size: 'Muito pequenos; existem milhões',
    location: 'Fim dos bronquíolos',
    primaryFunction: 'Trocar oxigénio e dióxido de carbono',
    biologyNotes:
      'Nos alvéolos, o oxigénio passa do ar para o sangue. Ao mesmo tempo, o dióxido de carbono sai do sangue para ser expirado.',
    funFact: 'Se todos os alvéolos fossem esticados, cobririam uma área enorme.',
    position: [0.92, -1.0, 0.2],
    scale: 0.28
  },
  {
    id: 'right-lung',
    label: 'Pulmão Direito',
    model: '/models/RightLung.glb',
    image: '/images/anatomy/RightLung.png',
    audio: '/audio/RightLung.wav',
    color: '#d97979',
    shortDescription: 'Pulmão com três lobos, situado do lado direito do tórax.',
    size: 'Maior do que o pulmão esquerdo',
    location: 'Lado direito da caixa torácica',
    primaryFunction: 'Realizar trocas gasosas',
    biologyNotes:
      'O pulmão direito recebe ar pelos brônquios e contém muitos alvéolos. Tem três lobos e trabalha em conjunto com o pulmão esquerdo.',
    funFact: 'O pulmão direito tem mais espaço porque o coração fica ligeiramente para a esquerda.',
    position: [-0.72, -0.62, -0.08],
    rotation: [0, 0.1, 0],
    scale: 0.62
  },
  {
    id: 'left-lung',
    label: 'Pulmão Esquerdo',
    model: '/models/LeftLung.glb',
    image: '/images/anatomy/LeftLung.png',
    audio: '/audio/LeftLung.wav',
    color: '#d97979',
    shortDescription: 'Pulmão com dois lobos, junto ao coração.',
    size: 'Um pouco menor do que o direito',
    location: 'Lado esquerdo da caixa torácica',
    primaryFunction: 'Realizar trocas gasosas',
    biologyNotes:
      'O pulmão esquerdo tem dois lobos e uma zona onde o coração encaixa. Tal como o direito, enche-se e esvazia-se durante a respiração.',
    funFact: 'O pulmão esquerdo deixa uma pequena “marca” de espaço para o coração.',
    position: [0.72, -0.62, -0.08],
    rotation: [0, -0.1, 0],
    scale: 0.62
  },
  {
    id: 'diaphragm',
    label: 'Diafragma',
    model: '/models/Dyaphragm.glb',
    image: '/images/anatomy/Dyaphragm.png',
    audio: '/audio/Dyaphragm.wav',
    color: '#c95742',
    shortDescription: 'Músculo principal da respiração.',
    size: 'Forma de cúpula sob os pulmões',
    location: 'Base do tórax',
    primaryFunction: 'Ajudar o ar a entrar e sair dos pulmões',
    biologyNotes:
      'Quando o diafragma contrai, desce e aumenta o espaço no tórax, ajudando o ar a entrar. Quando relaxa, sobe e ajuda o ar a sair.',
    funFact: 'O soluço acontece quando o diafragma contrai de forma involuntária.',
    position: [0, -1.92, 0],
    scale: 0.56
  }
];

export const getStructure = (id: PartId | null) =>
  structures.find((part) => part.id === id) ?? null;
