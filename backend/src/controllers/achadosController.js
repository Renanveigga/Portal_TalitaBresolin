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
      "SELECT * FROM achados_perdidos WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return notFound(res, "Item não encontrado.");
    }

    return ok(res, rows[0]);
  } catch (err) {
    next(err);
  }
};

export const createAchado = async (req, res, next) => {
  try {
    const descRaw = req.body.descricao || req.body.titulo || "";
    const salaRaw = req.body.sala || req.body.local || "";

    const descricao = sanitize(descRaw);
    const sala = sanitize(salaRaw);

    if (!descricao || !sala) {
      return badRequest(
        res,
        "Campos 'descricao' e 'sala' são obrigatórios."
      );
    }

    let arquivo = null;
 
    if (req.file) {
      arquivo = req.file;
    }
 
    if (!arquivo && req.files?.foto?.length) {
      arquivo = req.files.foto[0];
    }

    let foto_url = null;

    if (arquivo?.filename) {
      foto_url = `/uploads/${arquivo.filename}`;
    }

    const dataHoje = new Date().toISOString().slice(0, 10);

    const [result] = await db.query(
      `INSERT INTO achados_perdidos
      (descricao, sala, foto_url, retirado, encontrado_em)
      VALUES (?, ?, ?, 0, ?)`,
      [descricao, sala, foto_url, dataHoje]
    );

    return created(res, {
      id: result.insertId,
      mensagem: "Item cadastrado com sucesso.",
    });
  } catch (err) {
    console.error("Erro ao cadastrar achado:", err);
    next(err);
  }
};

export const updateAchado = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [check] = await db.query(
      "SELECT id FROM achados_perdidos WHERE id = ?",
      [id]
    );

    if (check.length === 0) {
      return notFound(res, "Item não encontrado.");
    }

    const retirado =
      req.body.retirado === true ||
      req.body.retirado === "true" ||
      req.body.retirado == 1
        ? 1
        : 0;

    await db.query(
      "UPDATE achados_perdidos SET retirado = ? WHERE id = ?",
      [retirado, id]
    );

    return ok(res, {
      mensagem: "Status atualizado com sucesso.",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAchado = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [check] = await db.query(
      "SELECT id FROM achados_perdidos WHERE id = ?",
      [id]
    );

    if (check.length === 0) {
      return notFound(res, "Item não encontrado.");
    }

    await db.query(
      "DELETE FROM achados_perdidos WHERE id = ?",
      [id]
    );

    return ok(res, {
      mensagem: "Item removido com sucesso.",
    });
  } catch (err) {
    next(err);
  }
};