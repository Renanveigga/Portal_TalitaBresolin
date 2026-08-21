#  Portal Escolar — Colégio Talita Bresolin

Portal web institucional para um colégio estadual, desenvolvido como projeto de inovação. A plataforma centraliza avisos, biblioteca, achados e perdidos, cursos, história do colégio, cadastro de talentos dos alunos e resultados esportivos, com um painel administrativo completo para gestão de todo o conteúdo.

O projeto é dividido em duas aplicações independentes:

- **`inovation_project/`** — Frontend em React 
- **`backend/`** — API REST em Node.js/Express com banco de dados MySQL

---

##  Funcionalidades

### Área pública
- **Início** — feed com scroll infinito reunindo avisos, novidades da biblioteca, achados e perdidos e mais, além de cards de estatísticas gerais do colégio.
- **Biblioteca** — catálogo de livros pesquisável, organizado por categoria, com indicação de disponibilidade.
- **Achados e Perdidos** — listagem de itens encontrados no colégio, com fotos.
- **Cursos** — cursos oferecidos, com informações de professores.
- **História** — página institucional sobre a história do colégio.
- **Talentos** — vitrine de talentos dos alunos, com formulário público de cadastro (foto e currículo em PDF).
- **Esportes** — resultados e conquistas esportivas do colégio, com fotos e medalhas.
- **Busca global** — barra de pesquisa integrada que consulta os diferentes módulos do portal.
- **Tema claro/escuro** — alternância de tema persistida para o usuário.

### Área administrativa (`/admin`)
Protegida por login (senha de administrador + JWT), permite gerenciar:
- Avisos (eventos, provas, feriados, palestras)
- Livros e empréstimos da biblioteca (registro e devolução)
- Achados e perdidos
- Talentos cadastrados (aprovação/reprovação, download de currículos)
- Registros esportivos
- Estatísticas gerais do portal

---

## Tecnologias

### Frontend (`inovation_project/`)
| Tecnologia | Uso |
|---|---|
| React 19 | Biblioteca de UI |
| Vite | Build tool e dev server |
| React Router DOM 7 | Roteamento SPA |
| Axios | Consumo da API |
| react-bootstrap-icons | Ícones |
| marked | Renderização de conteúdo em Markdown |
| CSS Modules | Estilização por componente |
| ESLint | Padronização de código |

### Backend (`backend/`)
| Tecnologia | Uso |
|---|---|
| Node.js + Express 5 | Servidor e API REST |
| MySQL (mysql2) | Banco de dados relacional |
| JSON Web Token (jsonwebtoken) | Autenticação do painel admin |
| bcrypt | Hash da senha de administrador |
| Multer | Upload de arquivos (fotos e currículos) |
| Helmet | Cabeçalhos de segurança HTTP |
| express-rate-limit | Proteção contra abuso/força bruta |
| CORS | Controle de origens permitidas |
| DOMPurify + xss + jsdom | Sanitização de conteúdo enviado pelos usuários |
| dotenv | Variáveis de ambiente |
| nodemon | Reload automático em desenvolvimento |

---

##  Estrutura do projeto

```
Portal_TalitaBresolin/
├── inovation_project/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/         # Componentes reutilizáveis (Sidebar, Cards, SearchBar, telas Admin*...)
│   │   ├── pages/               # Páginas/rotas (Home, Library, Lost, Courses, History, Talentos, Esportes, Admin)
│   │   ├── services/             # Camada de integração com a API (Axios)
│   │   ├── hooks/                # Hooks customizados (ex.: useTheme)
│   │   ├── data/                  # Dados estáticos/mock e constantes
│   │   ├── styles/                # Estilos globais
│   │   └── App.jsx / main.jsx     # Ponto de entrada e definição de rotas
│   ├── public/
│   ├── vite.config.js
│   └── vercel.json                # Configuração de deploy (SPA rewrite)
│
└── backend/                    # API REST (Node.js + Express)
    └── src/
        ├── controllers/         # Regras de negócio de cada recurso
        ├── routes/               # Definição dos endpoints
        ├── middlewares/          # Autenticação admin, validação, tratamento de erros
        ├── config/               # Conexão com o banco (db.js) e configuração de upload
        ├── utils/                # Helpers (respostas padronizadas, caminhos de upload)
        ├── uploads/              # Arquivos enviados (fotos, currículos)
        └── index.js              # Ponto de entrada do servidor
```

---

## Endpoints principais da API

Todos os endpoints (exceto os públicos de leitura) exigem o header `Authorization: Bearer <token>` obtido em `/auth/login`.

| Recurso | Rota base | Descrição |
|---|---|---|
| Autenticação | `POST /auth/login` | Login do administrador (retorna token JWT) |
| Avisos | `/avisos` | CRUD de avisos e eventos |
| Livros | `/livros` | CRUD do acervo da biblioteca |
| Empréstimos | `/emprestimos` | Registro e devolução de empréstimos |
| Achados e Perdidos | `/achados` | CRUD de itens encontrados (com upload de foto) |
| Cursos | `/cursos` | Listagem de cursos/professores |
| Talentos | `/talentos` | Cadastro público e gestão de talentos (foto + currículo em PDF) |
| Esportes | `/esportes` | CRUD de registros esportivos (com upload de foto) |
| Feed | `/feed` | Feed paginado da página inicial |
| Busca | `/busca` | Busca global entre os módulos |
| Estatísticas | `/stats` | Números consolidados do portal |

---

 

 

##  Segurança

- Autenticação do painel administrativo via JWT (expiração de 2h).
- Senha de administrador armazenada como hash bcrypt.
- Rate limiting geral e específico para tentativas de login.
- Cabeçalhos de segurança com Helmet.
- Sanitização de conteúdo enviado pelos usuários (DOMPurify/xss) para prevenir XSS.
- Validação de payloads e uploads (tipo e tamanho de arquivo) em todas as rotas administrativas.

---

 

 
