import db from "../config/db.js";

export const buscar = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ avisos: [], livros: [], achados: [], talentos: [] });
    }

    const termo = `%${q}%`;

    const [avisos] = await db.query(
      `SELECT id, titulo, tipo, data_evento as data, descricao
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
       FROM talentos
       WHERE status = 'aprovado'
         AND (nome LIKE ? OR habilidades LIKE ? OR curso LIKE ?)
       LIMIT 4`,
      [termo, termo, termo]
    );

    res.json({ avisos, livros, achados, talentos });
  } catch (error) {
    res.status(500).json({ erro: "Erro na busca", detalhe: error.message });
  }
};