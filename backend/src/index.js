import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import authRouter from "./routes/auth.js";

import avisosRouter  from "./routes/avisos.js";
import livrosRouter  from "./routes/livros.js";
import achadosRouter from "./routes/achados.js";
import cursosRouter  from "./routes/cursos.js";
import statsRouter from "./routes/stats.js";
import buscaRouter from "./routes/busca.js";
import emprestimosRoutes from "./routes/emprestimos.js";
import talentosRouter from "./routes/talentos.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/avisos",  avisosRouter);
app.use("/livros",  livrosRouter);
app.use("/achados", achadosRouter);
app.use("/cursos",  cursosRouter);
app.use("/stats", statsRouter);
app.use("/busca", buscaRouter);
app.use("/emprestimos", emprestimosRoutes);
app.use("/talentos", talentosRouter);

app.get("/", (req, res) => {
  res.json({ mensagem: "API do Portal Escolar funcionando!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});