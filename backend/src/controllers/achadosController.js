import db from "../config/db.js";
import { ok, created, notFound, badRequest } from "../utils/response.js";
import { sanitize } from "../middlewares/validate.js";

export const getAchados = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM achados_perdidos ORDER BY criado_em DESC"
    );
    return ok(res, rows);
  } catch (err) {
    next(err);
  }
};

export const getAchadoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM achados_perdidos WHERE id = ?", [id]
    );
    if (rows.length === 0) return notFound(res, "Item não encontrado.");
    return ok(res, rows[0]);
  } catch (err) {
    next(err);
  }
};

export const createAchado = async (req, res, next) => {
  try {
    const descricao = sanitize(req.body.descricao);
    const sala      = sanitize(req.body.sala);
    const foto_url  = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.query(
      "INSERT INTO achados_perdidos (descricao, sala, foto_url) VALUES (?, ?, ?)",
      [descricao, sala, foto_url]
    );

    return created(res, { id: result.insertId, mensagem: "Item cadastrado com sucesso." });
  } catch (err) {
    next(err);
  }
};

export const updateAchado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [check] = await db.query("SELECT id FROM achados_perdidos WHERE id = ?", [id]);

    if (check.length === 0) return notFound(res, "Item não encontrado.");

    const retirado = req.body.retirado === true || req.body.retirado === "true" ? 1 : 0;
    await db.query(
      "UPDATE achados_perdidos SET retirado = ? WHERE id = ?", [retirado, id]
    );
    return ok(res, { mensagem: "Status atualizado com sucesso." });
  } catch (err) {
    next(err);
  }
};

export const deleteAchado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [check] = await db.query("SELECT id FROM achados_perdidos WHERE id = ?", [id]);

    if (check.length === 0) return notFound(res, "Item não encontrado.");

    await db.query("DELETE FROM achados_perdidos WHERE id = ?", [id]);
    return ok(res, { mensagem: "Item removido com sucesso." });
  } catch (err) {
    next(err);
  }
};