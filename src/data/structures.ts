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

export type ViewMode = 'normal' | 'section' | 'xray';

export interface Structure {
  id: PartId;
  label: string;
  model: string;
  image: string;
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
    color: '#d98264',
    shortDescription: 'Entrada do ar, onde este e filtrado, aquecido e humedecido.',
    size: 'Cerca de 7 cm de profundidade',
    location: 'Interior do nariz e parte superior da face',
    primaryFunction: 'Preparar o ar antes de chegar aos pulmoes',
    biologyNotes:
      'A cavidade nasal tem pequenos pelos e muco que prendem poeiras e microrganismos. Tambem aquece e humedece o ar, protegendo as vias respiratorias mais profundas.',
    funFact: 'Respirar pelo nariz ajuda o corpo a defender-se melhor do ar frio, seco ou com particulas.',
    position: [0, 2.9, 0],
    scale: 0.34
  },
  {
    id: 'pharynx',
    label: 'Faringe',
    model: '/models/Pharynx.glb',
    image: '/images/anatomy/Pharynx.png',
    color: '#c85e64',
    shortDescription: 'Passagem comum ao ar e aos alimentos, situada atras da boca e do nariz.',
    size: 'Aprox. 12 a 14 cm',
    location: 'Garganta',
    primaryFunction: 'Conduzir o ar ate a laringe',
    biologyNotes:
      'A faringe funciona como uma zona de passagem. Quando respiramos, o ar segue para a laringe; quando engolimos, os alimentos seguem para o esofago.',
    funFact: 'A faringe participa na respiracao, na degluticao e ate na producao de alguns sons.',
    position: [0, 2.0, 0],
    scale: 0.45
  },
  {
    id: 'larynx',
    label: 'Laringe',
    model: '/models/larynx.glb',
    image: '/images/anatomy/RespiratorySystem02.png',
    color: '#dec293',
    shortDescription: 'Estrutura onde se encontram as cordas vocais.',
    size: 'Aprox. 4 a 5 cm',
    location: 'Pescoço, por cima da traqueia',
    primaryFunction: 'Proteger a via respiratoria e produzir voz',
    biologyNotes:
      'A laringe deixa o ar passar para a traqueia e contem as cordas vocais. Uma pequena tampa, a epiglote, ajuda a impedir que comida entre nas vias respiratorias.',
    funFact: 'A tua voz muda porque as cordas vocais vibram de formas diferentes.',
    position: [0, 1.35, 0],
    scale: 0.42
  },
  {
    id: 'trachea',
    label: 'Traqueia',
    model: '/models/Trachea.glb',
    image: '/images/anatomy/RespiratorySystem02.png',
    color: '#89b8d0',
    shortDescription: 'Tubo que liga a laringe aos bronquios.',
    size: 'Aprox. 10 a 12 cm em adultos',
    location: 'Pescoço e parte superior do torax',
    primaryFunction: 'Conduzir o ar ate aos pulmoes',
    biologyNotes:
      'A traqueia e um tubo flexivel reforcado por aneis de cartilagem. Esses aneis impedem que a traqueia feche quando o ar entra e sai.',
    funFact: 'Os aneis da traqueia parecem a letra C para o esofago poder expandir quando engoles.',
    position: [0, 0.58, 0],
    scale: 0.47
  },
  {
    id: 'main-bronchi',
    label: 'Bronquios Principais',
    model: '/models/MainBronchi.glb',
    image: '/images/anatomy/MainBronchi.png',
    color: '#73bfb1',
    shortDescription: 'Dois tubos que levam o ar da traqueia para cada pulmao.',
    size: 'Alguns centimetros cada',
    location: 'Entrada dos pulmoes',
    primaryFunction: 'Dividir o fluxo de ar pelos dois pulmoes',
    biologyNotes:
      'Os bronquios principais ramificam-se a partir da traqueia. Um segue para o pulmao direito e outro para o pulmao esquerdo, como dois ramos de uma arvore.',
    funFact: 'O bronquio direito e normalmente mais largo e vertical do que o esquerdo.',
    position: [0, -0.18, 0.02],
    scale: 0.48
  },
  {
    id: 'bronchioles',
    label: 'Bronquiolos',
    model: '/models/Bronchioles.glb',
    image: '/images/anatomy/Bronchioles.png',
    color: '#d9b85f',
    shortDescription: 'Ramificacoes muito finas dentro dos pulmoes.',
    size: 'Menos de 1 mm de diametro nos ramos pequenos',
    location: 'Interior dos pulmoes',
    primaryFunction: 'Distribuir o ar ate aos alveolos',
    biologyNotes:
      'Os bronquiolos sao tubos cada vez mais pequenos. Levam o ar ate zonas profundas dos pulmoes, onde se encontram os alveolos.',
    funFact: 'O seu desenho lembra uma arvore invertida dentro do peito.',
    position: [0, -0.75, 0.02],
    scale: 0.52
  },
  {
    id: 'alveoli',
    label: 'Alveolos',
    model: '/models/Alvioli.glb',
    image: '/images/anatomy/Alvioli.png',
    color: '#c76893',
    shortDescription: 'Pequenos sacos onde o oxigenio entra no sangue.',
    size: 'Muito pequenos; existem milhoes',
    location: 'Fim dos bronquiolos',
    primaryFunction: 'Trocar oxigenio e dioxido de carbono',
    biologyNotes:
      'Nos alveolos, o oxigenio passa do ar para o sangue. Ao mesmo tempo, o dioxido de carbono sai do sangue para ser expirado.',
    funFact: 'Se todos os alveolos fossem esticados, cobririam uma area enorme.',
    position: [0.92, -1.0, 0.2],
    scale: 0.28
  },
  {
    id: 'right-lung',
    label: 'Pulmao Direito',
    model: '/models/RightLung.glb',
    image: '/images/anatomy/RightLung.png',
    color: '#d97979',
    shortDescription: 'Pulmao com tres lobos, situado do lado direito do torax.',
    size: 'Maior do que o pulmao esquerdo',
    location: 'Lado direito da caixa toracica',
    primaryFunction: 'Realizar trocas gasosas',
    biologyNotes:
      'O pulmao direito recebe ar pelos bronquios e contem muitos alveolos. Tem tres lobos e trabalha em conjunto com o pulmao esquerdo.',
    funFact: 'O pulmao direito tem mais espaco porque o coracao fica ligeiramente para a esquerda.',
    position: [-0.72, -0.62, -0.08],
    rotation: [0, 0.1, 0],
    scale: 0.62
  },
  {
    id: 'left-lung',
    label: 'Pulmao Esquerdo',
    model: '/models/LeftLung.glb',
    image: '/images/anatomy/LeftLung.png',
    color: '#d97979',
    shortDescription: 'Pulmao com dois lobos, junto ao coracao.',
    size: 'Um pouco menor do que o direito',
    location: 'Lado esquerdo da caixa toracica',
    primaryFunction: 'Realizar trocas gasosas',
    biologyNotes:
      'O pulmao esquerdo tem dois lobos e uma zona onde o coracao encaixa. Tal como o direito, enche-se e esvazia-se durante a respiracao.',
    funFact: 'O pulmao esquerdo deixa uma pequena “marca” de espaco para o coracao.',
    position: [0.72, -0.62, -0.08],
    rotation: [0, -0.1, 0],
    scale: 0.62
  },
  {
    id: 'diaphragm',
    label: 'Diafragma',
    model: '/models/Dyaphragm.glb',
    image: '/images/anatomy/Dyaphragm.png',
    color: '#c95742',
    shortDescription: 'Musculo principal da respiracao.',
    size: 'Forma de cupula sob os pulmoes',
    location: 'Base do torax',
    primaryFunction: 'Ajudar o ar a entrar e sair dos pulmoes',
    biologyNotes:
      'Quando o diafragma contrai, desce e aumenta o espaco no torax, ajudando o ar a entrar. Quando relaxa, sobe e ajuda o ar a sair.',
    funFact: 'O soluco acontece quando o diafragma contrai de forma involuntaria.',
    position: [0, -1.92, 0],
    scale: 0.56
  }
];

export const getStructure = (id: PartId | null) =>
  structures.find((part) => part.id === id) ?? null;
