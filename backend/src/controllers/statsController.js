import db from "../config/db.js";
import { ok } from "../utils/response.js";

export const getStats = async (req, res, next) => {
  try {
 
    const [
      [[{ totalLivros }]],
      [[{ livrosDisponiveis }]],
      [[{ totalAchados }]],
      [[{ achadosPendentes }]],
      [[{ totalAvisos }]],
      [[{ totalCursos }]],
      [[{ totalProfessores }]],
    ] = await Promise.all([
      db.query("SELECT COUNT(*) AS totalLivros FROM livros"),
      db.query("SELECT COUNT(*) AS livrosDisponiveis FROM livros WHERE disponivel = 1"),
      db.query("SELECT COUNT(*) AS totalAchados FROM achados_perdidos"),
      db.query("SELECT COUNT(*) AS achadosPendentes FROM achados_perdidos WHERE retirado = 0"),
      db.query("SELECT COUNT(*) AS totalAvisos FROM avisos"),
      db.query("SELECT COUNT(*) AS totalCursos FROM cursos"),
      db.query("SELECT COUNT(*) AS totalProfessores FROM professores"),
    ]);

    return ok(res, {
      livros:  { total: totalLivros,    disponiveis: livrosDisponiveis },
      achados: { total: totalAchados,   pendentes:   achadosPendentes },
      avisos:  { total: totalAvisos },
      cursos:  { total: totalCursos,    professores: totalProfessores },
    });
  } catch (err) {
    next(err);
  }
};