import db from "../config/db.js";
import { marked } from "marked";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const window  = new JSDOM("").window;
const purify  = DOMPurify(window);

function renderBio(bio) {
  if (!bio) return null;
  const html = marked.parse(bio);
  return purify.sanitize(html, {
    ALLOWED_TAGS: ["p","strong","em","ul","ol","li","a","br","h3","h4","blockquote","code"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

export const getTalentos = async (req, res) => {
  try {
    const { curso, habilidade } = req.query;
    let query  = "SELECT * FROM talentos WHERE status = 'aprovado'";
    const params = [];

    if (curso) {
      query += " AND curso = ?";
      params.push(curso);
    }
    if (habilidade) {
      query += " AND habilidades LIKE ?";
      params.push(`%${habilidade}%`);
    }

    query += " ORDER BY criado_em DESC";
    const [rows] = await db.query(query, params);

    const talentos = rows.map((t) => ({
      ...t,
      bio_html: renderBio(t.bio),
    }));

    res.json(talentos);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar talentos", detalhe: error.message });
  }
};

export const getTalentosAdmin = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM talentos ORDER BY criado_em DESC");
    const talentos = rows.map((t) => ({ ...t, bio_html: renderBio(t.bio) }));
    res.json(talentos);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar talentos", detalhe: error.message });
  }
};

export const createTalento = async (req, res) => {
  try {
    const { nome, curso, ano, habilidades, linkedin, github, email, instagram, bio } = req.body;

    if (!nome || !curso || !ano || !habilidades) {
      return res.status(400).json({ erro: "Campos obrigatórios faltando." });
    }

    const foto_url      = req.files?.foto?.[0]      ? `/uploads/fotos-perfil/${req.files.foto[0].filename}`   : null;
    const curriculo_url = req.files?.curriculo?.[0]  ? `/uploads/curriculos/${req.files.curriculo[0].filename}` : null;

    const [result] = await db.query(
      `INSERT INTO talentos
        (nome, curso, ano, habilidades, linkedin, github, email, instagram, bio, foto_url, curriculo_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, curso, ano, habilidades,
       linkedin ?? null, github ?? null,
       email ?? null, instagram ?? null,
       bio ?? null,
       foto_url, curriculo_url]
    );

    res.status(201).json({ mensagem: "Perfil enviado para aprovação!", id: result.insertId });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao cadastrar talento", detalhe: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id }     = req.params;
    const { status } = req.body;
    await db.query("UPDATE talentos SET status = ? WHERE id = ?", [status, id]);
    res.json({ mensagem: "Status atualizado!" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar status", detalhe: error.message });
  }
};

export const deleteTalento = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM talentos WHERE id = ?", [id]);
    res.json({ mensagem: "Perfil removido!" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao remover talento", detalhe: error.message });
  }
};