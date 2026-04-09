import db from "../config/db.js";
import { ok, badRequest } from "../utils/response.js";

export const buscar = async (req, res, next) => {
  try {
    const q = String(req.query.q ?? "").trim();

    if (q.length < 1) {
      return ok(res, { avisos: [], livros: [], achados: [], talentos: [], esportes: [] });
    }
 
    const termoBruto = q.slice(0, 100);
    const termo = `%${termoBruto}%`;

    const [avisos] = await db.query(
      `SELECT id, titulo, tipo, data_evento AS data, descricao
       FROM avisos WHERE titulo LIKE ? OR descricao LIKE ? LIMIT 4`,
      [termo, termo]
    );

    const [livros] = await db.query(
      `SELECT id, titulo, autor, categoria, disponivel
       FROM livros WHERE titulo LIKE ? OR autor LIKE ? OR categoria LIKE ? LIMIT 4`,
      [termo, termo, termo]
    );

    const [achados] = await db.query(
      `SELECT id, descricao, sala, retirado, foto_url
       FROM achados_perdidos WHERE descricao LIKE ? OR sala LIKE ? LIMIT 4`,
      [termo, termo]
    );

    const [talentos] = await db.query(
      `SELECT id, nome, curso, ano, habilidades, foto_url
       FROM talentos WHERE status = 'aprovado'
         AND (nome LIKE ? OR habilidades LIKE ? OR curso LIKE ?) LIMIT 4`,
      [termo, termo, termo]
    );

    const [esportes] = await db.query(
      `SELECT id, titulo, modalidade, medalha, data_evento, foto_url
       FROM esportes WHERE titulo LIKE ? OR modalidade LIKE ? OR resumo LIKE ? LIMIT 4`,
      [termo, termo, termo]
    );

    return ok(res, { avisos, livros, achados, talentos, esportes });
  } catch (err) {
    next(err);
  }
};