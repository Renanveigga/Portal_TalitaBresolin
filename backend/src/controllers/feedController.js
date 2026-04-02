import db from "../config/db.js";

export const getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [avisos] = await db.query(
      `SELECT id, titulo as titulo, descricao, tipo, data_evento as data,
              criado_em, 'aviso' as tipo_feed
       FROM avisos ORDER BY criado_em DESC LIMIT 5`
    );

    const [achados] = await db.query(
      `SELECT id, descricao as titulo, sala, foto_url,
              retirado, criado_em, 'achado' as tipo_feed
       FROM achados_perdidos
       WHERE retirado = false ORDER BY criado_em DESC LIMIT 5`
    );

    const [talentos] = await db.query(
      `SELECT id, nome as titulo, curso, ano, habilidades,
              foto_url, bio, criado_em, 'talento' as tipo_feed
       FROM talentos
       WHERE status = 'aprovado' ORDER BY criado_em DESC LIMIT 5`
    );

    const [livros] = await db.query(
      `SELECT id, titulo, autor, categoria, disponivel,
              criado_em, 'livro' as tipo_feed
       FROM livros ORDER BY criado_em DESC LIMIT 5`
    );

    const feed = [
      ...avisos,
      ...achados,
      ...talentos,
      ...livros,
    ].sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));

    const paginado = feed.slice(offset, offset + Number(limit));

    res.json({
      items: paginado,
      total: feed.length,
      page: Number(page),
      hasMore: offset + Number(limit) < feed.length,
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar feed", detalhe: error.message });
  }
};