export const NAV_ITEMS = [
  { id: "home",    label: "Início",             icon: "⌂" },
  { id: "library", label: "Biblioteca",          icon: "⊞" },
  { id: "lost",    label: "Achados e Perdidos",  icon: "◎" },
  { id: "courses", label: "Cursos Técnicos",     icon: "✦" },
  { id: "history", label: "Nossa História",      icon: "◈" },
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
  { id: 1, titulo: "Dom Casmurro",          autor: "Machado de Assis",      cat: "Literatura",  disp: true  },
  { id: 2, titulo: "O Cortiço",             autor: "Aluísio Azevedo",       cat: "Literatura",  disp: true  },
  { id: 3, titulo: "Sapiens",               autor: "Yuval Noah Harari",     cat: "História",    disp: false },
  { id: 4, titulo: "Matemática Financeira", autor: "José Roberto Securato", cat: "Exatas",      disp: true  },
  { id: 5, titulo: "Redes de Computadores", autor: "Andrew Tanenbaum",      cat: "Tecnologia",  disp: true  },
  { id: 6, titulo: "A Arte da Guerra",      autor: "Sun Tzu",               cat: "Filosofia",   disp: false },
];

export const ACHADOS = [
  { id: 1, desc: "Mochila azul com zíper amarelo", sala: "Coord. 01", data: "28/03/2025", retirado: false },
  { id: 2, desc: "Óculos de grau armação preta",   sala: "Coord. 02", data: "27/03/2025", retirado: true  },
  { id: 3, desc: "Garrafa térmica cinza 500ml",     sala: "Coord. 01", data: "26/03/2025", retirado: false },
  { id: 4, desc: "Estojo verde com lápis de cor",   sala: "Coord. 02", data: "25/03/2025", retirado: true  },
];

export const CURSOS = [
  {
    id: 1,
    sigla: "TI",
    nome: "Técnico em Informática",
    cor: "#2E86C1",
    desc: "Formação em desenvolvimento de sistemas, redes e banco de dados.",
    professores: [
      { nome: "Prof. Carlos Souza",   materia: "Programação & Algoritmos", form: "Ciência da Computação – USP"   },
      { nome: "Profa. Ana Lima",      materia: "Banco de Dados & Redes",   form: "Eng. de Computação – UNICAMP" },
    ],
  },
  {
    id: 2,
    sigla: "ADM",
    nome: "Técnico em Administração",
    cor: "#F39C12",
    desc: "Formação em gestão empresarial, contabilidade e recursos humanos.",
    professores: [
      { nome: "Prof. Roberto Neves",   materia: "Gestão Empresarial",       form: "Administração – FGV"         },
      { nome: "Profa. Fernanda Costa", materia: "Contabilidade & Finanças", form: "Ciências Contábeis – PUC"    },
    ],
  },
];

export const HISTORIAS = [
  {
    era: "Passado",
    cor: "#5D6D7E",
    icon: "◴",
    titulo: "As Origens",
    texto:
      "Fundado com a missão de levar educação de qualidade à comunidade, o colégio cresceu a partir do esforço conjunto de professores dedicados e famílias comprometidas.",
  },
  {
    era: "Presente",
    cor: "#2E86C1",
    icon: "◉",
    titulo: "Hoje",
    texto:
      "Com dois cursos técnicos reconhecidos, biblioteca completa e corpo docente altamente qualificado, o colégio é referência regional em educação técnica e cidadania.",
  },
  {
    era: "Futuro",
    cor: "#F39C12",
    icon: "◈",
    titulo: "O que vem por aí",
    texto:
      "Você, aluno de hoje, é o protagonista de amanhã. A escola investe continuamente em tecnologia e projetos inovadores para preparar as próximas gerações.",
  },
];