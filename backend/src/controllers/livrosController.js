import db from "../config/db.js";
import { ok, created, notFound } from "../utils/response.js";
import { sanitize } from "../middlewares/validate.js";

export const getLivros = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM livros ORDER BY titulo ASC");
    return ok(res, rows);
  } catch (err) {
    next(err);
  }
};

export const getLivroById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM livros WHERE id = ?", [id]);

    if (rows.length === 0) return notFound(res, "Livro não encontrado.");
    return ok(res, rows[0]);
  } catch (err) {
    next(err);
  }
};

export const createLivro = async (req, res, next) => {
  try {
    const titulo     = sanitize(req.body.titulo);
    const autor      = sanitize(req.body.autor);
    const categoria  = sanitize(req.body.categoria);
  
    const disponivel = req.body.disponivel === true || req.body.disponivel === "true" ? 1 : 0;

    const [result] = await db.query(
      "INSERT INTO livros (titulo, autor, categoria, disponivel) VALUES (?, ?, ?, ?)",
      [titulo, autor, categoria, disponivel]
    );

    return created(res, { id: result.insertId, mensagem: "Livro cadastrado com sucesso." });
  } catch (err) {
    next(err);
  }
};

export const updateLivro = async (req, res, next) => {
  try {
    const { id } = req.params;
 
    const cleanId = parseInt(id);

    const [check] = await db.query("SELECT id FROM livros WHERE id = ?", [cleanId]);
    if (check.length === 0) return notFound(res, "Livro não encontrado.");
 
    const disponivel = (req.body.disponivel === true || req.body.disponivel === "true") ? 1 : 0;

    await db.query("UPDATE livros SET disponivel = ? WHERE id = ?", [disponivel, cleanId]);

    return ok(res, { mensagem: "Status atualizado com sucesso!", novoStatus: disponivel });
  } catch (err) {
    next(err);
  }
};

export const deleteLivro = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [check] = await db.query("SELECT id FROM livros WHERE id = ?", [id]);

    if (check.length === 0) return notFound(res, "Livro não encontrado.");

    await db.query("DELETE FROM livros WHERE id = ?", [id]);
    return ok(res, { mensagem: "Livro removido com sucesso." });
  } catch (err) {
    next(err);
  }
};