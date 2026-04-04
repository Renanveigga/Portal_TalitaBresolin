import db from "../config/db.js";
import { ok, badRequest } from "../utils/response.js";

export const getFeed = async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10)); // máximo 50 por página
    const offset = (page - 1) * limit;

    const [avisos] = await db.query(
      `SELECT id, titulo, descricao, tipo, data_evento AS data,
              NULL AS foto_url, NULL AS sala, NULL AS curso,
              NULL AS habilidades, NULL AS modalidade, NULL AS medalha,
              criado_em, 'aviso' AS tipo_feed
       FROM avisos ORDER BY criado_em DESC LIMIT 6`
    );

    const [achados] = await db.query(
      `SELECT id, descricao AS titulo, NULL AS descricao, NULL AS tipo,
              NULL AS data, foto_url, sala, NULL AS curso,
              NULL AS habilidades, NULL AS modalidade, NULL AS medalha,
              criado_em, 'achado' AS tipo_feed
       FROM achados_perdidos WHERE retirado = 0
       ORDER BY criado_em DESC LIMIT 4`
    );

    const [talentos] = await db.query(
      `SELECT id, nome AS titulo, bio AS descricao, NULL AS tipo,
              NULL AS data, foto_url, NULL AS sala, curso,
              habilidades, NULL AS modalidade, NULL AS medalha,
              criado_em, 'talento' AS tipo_feed
       FROM talentos WHERE status = 'aprovado'
       ORDER BY criado_em DESC LIMIT 4`
    );

    const [livros] = await db.query(
      `SELECT id, titulo, autor AS descricao, NULL AS tipo,
              NULL AS data, NULL AS foto_url, NULL AS sala, NULL AS curso,
              NULL AS habilidades, categoria AS modalidade, NULL AS medalha,
              criado_em, 'livro' AS tipo_feed
       FROM livros ORDER BY criado_em DESC LIMIT 4`
    );

    const [esportes] = await db.query(
      `SELECT id, titulo, resumo AS descricao, NULL AS tipo,
              data_evento AS data, foto_url, NULL AS sala, NULL AS curso,
              NULL AS habilidades, modalidade, medalha,
              criado_em, 'esporte' AS tipo_feed
       FROM esportes ORDER BY criado_em DESC LIMIT 4`
    );

    const feed = [...avisos, ...achados, ...talentos, ...livros, ...esportes]
      .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));

    const paginado = feed.slice(offset, offset + limit);

    return ok(res, {
      items:   paginado,
      total:   feed.length,
      page,
      hasMore: offset + limit < feed.length,
    });
  } catch (err) {
    next(err);
  }
};