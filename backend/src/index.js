import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { UPLOADS_DIR, ensureUploadsSubdir } from "./utils/uploadsPath.js";

import authRouter from "./routes/auth.js";
import avisosRouter from "./routes/avisos.js";
import livrosRouter from "./routes/livros.js";
import achadosRouter from "./routes/achados.js";
import cursosRouter from "./routes/cursos.js";
import statsRouter from "./routes/stats.js";
import buscaRouter from "./routes/busca.js";
import emprestimosRouter from "./routes/emprestimos.js";
import talentosRouter from "./routes/talentos.js";
import feedRouter from "./routes/feed.js";
import esportesRouter from "./routes/esportes.js";

import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

dotenv.config();
 
const ENV_REQUIRED = ["DB_HOST", "DB_USER", "DB_PASS", "DB_NAME", "JWT_SECRET", "ADMIN_PASSWORD"];
for (const varName of ENV_REQUIRED) {
  if (!process.env[varName]) {
    console.error(`[ERRO FATAL] Variável de ambiente '${varName}' não definida.`);
    process.exit(1);
  }
}
 
const uploadsDir = ensureUploadsSubdir();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);
 
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);
 
const allowedOrigins = [
  "https://portal-talita-bresolin.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CORS_ORIGIN,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
     
    if (!origin) return callback(null, true);

    const liberado =
      allowedOrigins.includes(origin) ||
      /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin); 

    if (liberado) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Origem bloqueada: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};
 
app.use(cors(corsOptions));
 
 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "development" ? 1000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { sucesso: false, erro: "Muitas requisições. Tente novamente em alguns minutos." },
});
app.use(limiter);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { sucesso: false, erro: "Muitas tentativas de login. Aguarde 15 minutos." },
});
 
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
 
app.use(
  "/uploads",
  express.static(uploadsDir, {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);
 
app.get("/", (req, res) => {
  res.json({
    sucesso: true,
    dados: { mensagem: "API do Portal Escolar funcionando!", versao: "2.0.0" },
  });
});
  
app.use("/auth", loginLimiter, authRouter);
app.use("/avisos", avisosRouter);
app.use("/livros", livrosRouter);
app.use("/achados", achadosRouter);
app.use("/cursos", cursosRouter);
app.use("/stats", statsRouter);
app.use("/busca", buscaRouter);
app.use("/emprestimos", emprestimosRouter);
app.use("/talentos", talentosRouter);
app.use("/feed", feedRouter);
app.use("/esportes", esportesRouter);
 
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Servidor rodando na porta ${PORT}`);
});