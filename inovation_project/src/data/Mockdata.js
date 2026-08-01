import {
  House,
  Grid,
  QuestionCircle,
  JournalBookmark,
  ClockHistory,
  PersonGear,
  Stars,
  TrophyFill,
  CircleFill,
  ArrowRepeat,
  DiamondFill,
  Building,
  Award,
  Flag,
  BookHalf,
  MortarboardFill,
  PersonBadgeFill,
  CalendarCheck,
  PeopleFill,
  HouseDoor
} from 'react-bootstrap-icons';

export const NAV_ITEMS = [
  { id: "home", label: "Início", icon: House },
  { id: "library", label: "Biblioteca", icon: Grid },
  { id: "lost", label: "Achados e Perdidos", icon: QuestionCircle },
  { id: "courses", label: "Cursos Técnicos", icon: JournalBookmark },
  { id: "history", label: "Nossa História", icon: ClockHistory },
  { id: "admin", label: "Admin", icon: PersonGear },
  { id: "talentos", label: "Banco de Talentos", icon: Stars },
  { id: "esportes", label: "Esportes", icon: TrophyFill },
];

export const AVISOS = [
  {
    id: 1,
    tipo: "evento",
    titulo: "Feira de Ciências 2025",
    data: "15/04/2025",
    desc: "Apresentações abertas ao público no ginásio.",
  },
  {
    id: 2,
    tipo: "prova",
    titulo: "Provas Trimestrais – 1º Trimestre",
    data: "22/04/2025",
    desc: "Calendário disponível na coordenação.",
  },
  {
    id: 3,
    tipo: "feriado",
    titulo: "Feriado – Tiradentes",
    data: "21/04/2025",
    desc: "Não haverá aula nesta data.",
  },
  {
    id: 4,
    tipo: "palestra",
    titulo: "Palestra: Mercado de TI",
    data: "10/04/2025",
    desc: "Auditório, às 14h. Aberta a todos os alunos.",
  },
];

export const BOOKS = [
  { id: 1, titulo: "Dom Casmurro", autor: "Machado de Assis", cat: "Literatura", disp: true },
  { id: 2, titulo: "O Cortiço", autor: "Aluísio Azevedo", cat: "Literatura", disp: true },
  { id: 3, titulo: "Sapiens", autor: "Yuval Noah Harari", cat: "História", disp: false },
  { id: 4, titulo: "Matemática Financeira", autor: "José Roberto Securato", cat: "Exatas", disp: true },
  { id: 5, titulo: "Redes de Computadores", autor: "Andrew Tanenbaum", cat: "Tecnologia", disp: true },
  { id: 6, titulo: "A Arte da Guerra", autor: "Sun Tzu", cat: "Filosofia", disp: false },
];

export const ACHADOS = [
  { id: 1, desc: "Mochila azul com zíper amarelo", sala: "Coord. 01", data: "28/03/2025", retirado: false },
  { id: 2, desc: "Óculos de grau armação preta", sala: "Coord. 02", data: "27/03/2025", retirado: true },
  { id: 3, desc: "Garrafa térmica cinza 500ml", sala: "Coord. 01", data: "26/03/2025", retirado: false },
  { id: 4, desc: "Estojo verde com lápis de cor", sala: "Coord. 02", data: "25/03/2025", retirado: true },
];

export const CURSOS = [
  {
    id: 1,
    sigla: "TI",
    nome: "Técnico em Informática",
    cor: "#2E86C1",
    desc: "Formação em desenvolvimento de sistemas, redes e banco de dados.",
    professores: [
      { nome: "Prof. Carlos Souza", materia: "Programação & Algoritmos", form: "Ciência da Computação – USP" },
      { nome: "Profa. Ana Lima", materia: "Banco de Dados & Redes", form: "Eng. de Computação – UNICAMP" },
    ],
  },
  {
    id: 2,
    sigla: "ADM",
    nome: "Técnico em Administração",
    cor: "#F39C12",
    desc: "Formação em gestão empresarial, contabilidade e recursos humanos.",
    professores: [
      { nome: "Prof. Roberto Neves", materia: "Gestão Empresarial", form: "Administração – FGV" },
      { nome: "Profa. Fernanda Costa", materia: "Contabilidade & Finanças", form: "Ciências Contábeis – PUC" },
    ],
  },
];

export const TALITA_BIO = {
  nome: "Talita Bresolin",
  periodo: "1944 — 1965",
  texto:
    "Nascida em Osório (RS) em 18 de julho de 1944, Talita mudou-se com a família para Apucarana, onde se formou professora primária em dezembro de 1963. Em 1964 assumiu a cadeira no Grupo Escolar de Califórnia e, pouco depois, passou a atuar na Inspetoria Regional de Ensino. Filiada à Organização Caritativa de Luzia Marilac, dedicava-se a levar mantimentos e medicamentos a famílias carentes da região. Foi numa dessas visitas, no distrito de Vila Reis, que morreu em um acidente de jipe, em 24 de abril de 1965, aos 20 anos. Pela dedicação à comunidade, seu nome foi dado à instituição pelo Decreto nº 3.720, de 19 de janeiro de 1967: Ginásio Estadual Talita Bresolin.",
};

export const HISTORIAS = [
  {
    era: "1965",
    cor: "#5D6D7E",
    icon: Flag,
    titulo: "Criação do Ginásio Estadual de Califórnia",
    texto:
      "A instituição nasce pelo Decreto nº 19.550, assinado pelo governador Ney Braga e publicado em 27/09/1965. A construção do prédio contou com o empenho da comunidade, do prefeito Adelino Cndeo e do primeiro vigário de Califórnia, Pe. Severino Cerutti.",
  },
  {
    era: "1966",
    cor: "#5D6D7E",
    icon: HouseDoor,
    titulo: "Primeiras turmas",
    texto:
      "As atividades começam no Grupo Escolar de Califórnia, com turmas de 1ª à 4ª série e Curso de Admissão, nos períodos da manhã e da tarde. Pe. Agostinho Cola torna-se o primeiro diretor da instituição.",
  },
  {
    era: "1967",
    cor: "#C0392B",
    icon: Award,
    titulo: "Homenagem a Talita Bresolin",
    texto:
      "Pelo Decreto nº 3.720, o Ginásio passa a se chamar Ginásio Estadual Talita Bresolin, em memória da jovem professora falecida em 1965, reconhecida pela dedicação a causas comunitárias.",
  },
  {
    era: "1969 – 1971",
    cor: "#2E86C1",
    icon: Building,
    titulo: "Ensino de 2º grau e prédio próprio",
    texto:
      "Concluída a primeira turma de 8ª série, é criado o Colégio Comercial Estadual da Califórnia. Em janeiro de 1971 é inaugurado o prédio próprio, como Escola Estadual Talita Bresolin – Ensino de 1º Grau.",
  },
  {
    era: "1979 – 1982",
    cor: "#2E86C1",
    icon: BookHalf,
    titulo: "Ampliação e reorganização",
    texto:
      "Novos laboratórios de ciências, química, física e biologia são construídos. Sucessivas resoluções reorganizam a rede local até formar o Colégio Talita Bresolin – Ensino de 1º e 2º Graus, com as habilitações Magistério e Básico em Comércio.",
  },
  {
    era: "1986 – 1997",
    cor: "#2E86C1",
    icon: MortarboardFill,
    titulo: "Habilitação técnica e Ensino Médio",
    texto:
      "É autorizada e depois reconhecida a Habilitação Técnico em Contabilidade. Em 1997 é autorizado o Curso de 2º Grau – Educação Geral, reconhecido como Ensino Médio em 2002.",
  },
  {
    era: "1988 – 2019",
    cor: "#7D6608",
    icon: PeopleFill,
    titulo: "Espaço compartilhado",
    texto:
      "Com a municipalização do Ensino Fundamental – Anos Iniciais, o colégio divide o espaço físico e equipamentos com a Escola Municipal Sueli Bisconcini Viana por mais de três décadas.",
  },
  {
    era: "2020",
    cor: "#F39C12",
    icon: ArrowRepeat,
    titulo: "Nova configuração de ensino",
    texto:
      "O colégio passa a atender exclusivamente os anos finais do Ensino Fundamental (6º ao 9º), o Ensino Médio e a Educação de Jovens e Adultos (EJA).",
  },
  {
    era: "2022 – 2024",
    cor: "#F39C12",
    icon: CalendarCheck,
    titulo: "Novo Ensino Médio",
    texto:
      "A implantação do Novo Ensino Médio (NEM) ocorre de forma gradativa: 1ª série em 2022, 2ª série em 2023 e 3ª série em 2024, completando o ciclo de reformulação curricular.",
  },
  {
    era: "2023",
    cor: "#F39C12",
    icon: Stars,
    titulo: "Ensino em Tempo Integral",
    texto:
      "O colégio é contemplado com o programa Integral Mais, passando a oferecer Educação em Tempo Integral para as turmas de Ensino Fundamental em turno único.",
  },
  {
    era: "2026",
    cor: "#DAA520",
    icon: DiamondFill,
    titulo: "Nova denominação",
    texto:
      "Pela Resolução nº 239/2026 – GS/SEED, publicada em 23/01/2026, a instituição passa a se chamar Colégio Estadual Talita Bresolin – Ensino Fundamental em Tempo Integral, Médio e Profissional.",
  },
  {
    era: "Hoje",
    cor: "#229954",
    icon: CircleFill,
    titulo: "O colégio atualmente",
    texto:
      "São 13 salas de aula e cerca de 800 alunos atendidos em três turnos: manhã e tarde em tempo integral, e noite regular — seguindo a mesma missão que deu origem à escola em 1965.",
  },
];

export const DIRETORES = [
  { periodo: "1966 – 1969", nome: "Pe. Agostinho Cola" },
  { periodo: "1969 – 1979", nome: "Luiz Fernando Palú" },
  { periodo: "1980 – 1982", nome: "Maria Carreira de Oliveira" },
  { periodo: "1983", nome: "Luiz Bachete" },
  { periodo: "1983 – 1985", nome: "Pedro Kazmierczak" },
  { periodo: "1986 – 1987", nome: "Eugênio Morais Neto" },
  { periodo: "1989", nome: "Maria Hilda Fernandes", nota: "diretora interina" },
  { periodo: "1989 – 1992", nome: "Eugênio Morais Neto" },
  { periodo: "1992 – 1995", nome: "Luiz Bachete" },
  { periodo: "1996 – 1998", nome: "Mário Ferreira de Souza" },
  { periodo: "1999 – 2001", nome: "Ana Maria Pereira de Oliveira" },
  { periodo: "2002 – 2003", nome: "Rosemary Nandi" },
  { periodo: "2004 – 2007", nome: "José Paulo Voltareli" },
  { periodo: "2008 – 2015", nome: "Silene Aparecida Nascimento dos Santos" },
  { periodo: "2016 – 2024", nome: "Maria de Fátima Ferreira Domingues", nota: "três mandatos" },
  { periodo: "2025 – 2026", nome: "Eduarda Sandy Ribeiro da Silva Martins" },
];