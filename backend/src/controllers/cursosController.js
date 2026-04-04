import db from "../config/db.js";
import { ok, notFound } from "../utils/response.js";

export const getCursos = async (req, res, next) => {
  try {
    const [cursos] = await db.query("SELECT * FROM cursos");

    const cursosComProfessores = await Promise.all(
      cursos.map(async (curso) => {
        const [professores] = await db.query(
          "SELECT * FROM professores WHERE curso_id = ?", [curso.id]
        );
        return { ...curso, professores };
      })
    );

    return ok(res, cursosComProfessores);
  } catch (err) {
    next(err);
  }
};

export const getCursoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [cursos] = await db.query("SELECT * FROM cursos WHERE id = ?", [id]);

    if (cursos.length === 0) {
      return notFound(res, "Curso não encontrado.");
    }

    const [professores] = await db.query(
      "SELECT * FROM professores WHERE curso_id = ?", [id]
    );

    return ok(res, { ...cursos[0], professores });
  } catch (err) {
    next(err);
  }
};