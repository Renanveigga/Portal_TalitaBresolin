import express    from "express";
import cors       from "cors";
import dotenv     from "dotenv";
import helmet     from "helmet";
import rateLimit  from "express-rate-limit";
import path       from "path";
import { fileURLToPath } from "url";
 
import authRouter       from "./routes/auth.js";
import avisosRouter     from "./routes/avisos.js";
import livrosRouter     from "./routes/livros.js";
import achadosRouter    from "./routes/achados.js";
import cursosRouter     from "./routes/cursos.js";
import statsRouter      from "./routes/stats.js";
import buscaRouter      from "./routes/busca.js";
import emprestimosRouter from "./routes/emprestimos.js";
import talentosRouter   from "./routes/talentos.js";
import feedRouter       from "./routes/feed.js";
import esportesRouter   from "./routes/esportes.js";
 
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

dotenv.config();
 
const ENV_REQUIRED = ["DB_HOST", "DB_USER", "DB_PASS", "DB_NAME", "JWT_SECRET", "ADMIN_PASSWORD"];
for (const varName of ENV_REQUIRED) {
  if (!process.env[varName]) {
    console.error(`[ERRO FATAL] Variável de ambiente '${varName}' não definida.`);
    process.exit(1);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3000;
 
app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "development" ? 1000 : 100, // 1000 no dev, 100 no prod
  standardHeaders: true,
  legacyHeaders: false,
  message: { sucesso: false, erro: "Muitas requisições. Tente novamente em alguns minutos." },
});
app.use(limiter);
 
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { sucesso: false, erro: "Muitas tentativas de login. Aguarde 15 minutos." },
});
 
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
 
app.get("/", (req, res) => {
  res.json({ sucesso: true, dados: { mensagem: "API do Portal Escolar funcionando!", versao: "2.0.0" } });
});
 
app.use("/auth",        loginLimiter, authRouter);
app.use("/avisos",      avisosRouter);
app.use("/livros",      livrosRouter);
app.use("/achados",     achadosRouter);
app.use("/cursos",      cursosRouter);
app.use("/stats",       statsRouter);
app.use("/busca",       buscaRouter);
app.use("/emprestimos", emprestimosRouter);
app.use("/talentos",    talentosRouter);
app.use("/feed",        feedRouter);
app.use("/esportes",    esportesRouter);
 
app.use(notFoundHandler);
app.use(errorHandler);
 
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Servidor rodando em http://localhost:${PORT}`);
});