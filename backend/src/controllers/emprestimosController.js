import db from "../config/db.js";
import { ok, created, notFound, badRequest } from "../utils/response.js";
import { sanitize } from "../middlewares/validate.js";

export const getEmprestimos = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, l.titulo AS livro_titulo, l.autor AS livro_autor
      FROM emprestimos e
      JOIN livros l ON e.livro_id = l.id
      ORDER BY e.data_emprestimo DESC
    `);
    return ok(res, rows);
  } catch (err) {
    next(err);
  }
};

export const createEmprestimo = async (req, res, next) => {
  try {
    const livro_id      = Number(req.body.livro_id);
    const nome_aluno    = sanitize(req.body.nome_aluno);
    const turma         = req.body.turma ? sanitize(req.body.turma) : null;
    const data_devolucao = req.body.data_devolucao || null;
 
    const [[livro]] = await db.query(
      "SELECT id, disponivel FROM livros WHERE id = ?", [livro_id]
    );

    if (!livro) return notFound(res, "Livro não encontrado.");
    if (!livro.disponivel) {
      return badRequest(res, "Este livro já está emprestado e não está disponível.");
    }

    await db.query(
      "INSERT INTO emprestimos (livro_id, nome_aluno, turma, data_devolucao) VALUES (?, ?, ?, ?)",
      [livro_id, nome_aluno, turma, data_devolucao]
    );

    await db.query("UPDATE livros SET disponivel = 0 WHERE id = ?", [livro_id]);

    return created(res, { mensagem: "Empréstimo registrado com sucesso." });
  } catch (err) {
    next(err);
  }
};

export const devolverLivro = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[emp]] = await db.query(
      "SELECT livro_id, devolvido FROM emprestimos WHERE id = ?", [id]
    );

    if (!emp) return notFound(res, "Empréstimo não encontrado.");
    if (emp.devolvido) return badRequest(res, "Este livro já foi marcado como devolvido.");

    await db.query(
      "UPDATE emprestimos SET devolvido = 1, data_devolucao = CURDATE() WHERE id = ?",
      [id]
    );
    await db.query("UPDATE livros SET disponivel = 1 WHERE id = ?", [emp.livro_id]);

    return ok(res, { mensagem: "Livro devolvido com sucesso." });
  } catch (err) {
    next(err);
  }
};

export const deleteEmprestimo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [check] = await db.query("SELECT id FROM emprestimos WHERE id = ?", [id]);

    if (check.length === 0) return notFound(res, "Empréstimo não encontrado.");

    await db.query("DELETE FROM emprestimos WHERE id = ?", [id]);
    return ok(res, { mensagem: "Registro de empréstimo removido com sucesso." });
  } catch (err) {
    next(err);
  }
};