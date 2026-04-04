import db from "../config/db.js";
import { ok, created, notFound, serverError } from "../utils/response.js";
import { sanitize } from "../middlewares/validate.js";

export const getAvisos = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM avisos ORDER BY data_evento ASC"
    );
    return ok(res, rows);
  } catch (err) {
    next(err);
  }
};

export const getAvisoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM avisos WHERE id = ?", [id]);

    if (rows.length === 0) {
      return notFound(res, "Aviso não encontrado.");
    }
    return ok(res, rows[0]);
  } catch (err) {
    next(err);
  }
};

export const createAviso = async (req, res, next) => {
  try {
    const titulo     = sanitize(req.body.titulo);
    const descricao  = sanitize(req.body.descricao ?? "");
    const tipo       = sanitize(req.body.tipo);
    const dataEvento = sanitize(req.body.data_evento);

    const [result] = await db.query(
      "INSERT INTO avisos (titulo, descricao, tipo, data_evento) VALUES (?, ?, ?, ?)",
      [titulo, descricao, tipo, dataEvento]
    );

    return created(res, { id: result.insertId, mensagem: "Aviso criado com sucesso." });
  } catch (err) {
    next(err);
  }
};

export const deleteAviso = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [check] = await db.query("SELECT id FROM avisos WHERE id = ?", [id]);

    if (check.length === 0) {
      return notFound(res, "Aviso não encontrado.");
    }

    await db.query("DELETE FROM avisos WHERE id = ?", [id]);
    return ok(res, { mensagem: "Aviso removido com sucesso." });
  } catch (err) {
    next(err);
  }
};