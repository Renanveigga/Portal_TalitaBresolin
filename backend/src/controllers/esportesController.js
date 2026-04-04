import db from "../config/db.js";
import { ok, created, notFound, badRequest } from "../utils/response.js";
import { sanitize } from "../middlewares/validate.js";

export const getEsportes = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM esportes ORDER BY data_evento DESC"
    );
    return ok(res, rows);
  } catch (err) {
    next(err);
  }
};

export const createEsporte = async (req, res, next) => {
  try {
    const titulo      = sanitize(req.body.titulo);
    const modalidade  = sanitize(req.body.modalidade);
    const resumo      = req.body.resumo ? sanitize(req.body.resumo) : null;
    const medalha     = sanitize(req.body.medalha ?? "participacao");
    const data_evento = sanitize(req.body.data_evento);
    const foto_url    = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.query(
      `INSERT INTO esportes (titulo, modalidade, resumo, medalha, data_evento, foto_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [titulo, modalidade, resumo, medalha, data_evento, foto_url]
    );

    return created(res, { id: result.insertId, mensagem: "Conquista esportiva cadastrada com sucesso." });
  } catch (err) {
    next(err);
  }
};

export const deleteEsporte = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [check] = await db.query("SELECT id FROM esportes WHERE id = ?", [id]);

    if (check.length === 0) return notFound(res, "Conquista esportiva não encontrada.");

    await db.query("DELETE FROM esportes WHERE id = ?", [id]);
    return ok(res, { mensagem: "Conquista esportiva removida com sucesso." });
  } catch (err) {
    next(err);
  }
};