import db from "../config/db.js";
import { marked } from "marked";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import { ok, created, notFound, badRequest } from "../utils/response.js";
import { sanitize } from "../middlewares/validate.js";

const { window } = new JSDOM("");
const purify     = DOMPurify(window);
 
marked.setOptions({ gfm: true, breaks: true });

function renderBio(bio) {
  if (!bio) return null;
  const html = marked.parse(bio);
  return purify.sanitize(html, {
    ALLOWED_TAGS: ["p","strong","em","ul","ol","li","a","br","h3","h4","blockquote","code"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

export const getTalentos = async (req, res, next) => {
  try {
    const { curso, habilidade, ordem } = req.query;
    const params = [];
 
let query = "SELECT id, nome, curso, ano, habilidades, foto_url, bio, criado_em FROM talentos WHERE 1=1";

    if (curso && ["TI", "ADM"].includes(curso)) {
      query += " AND curso = ?";
      params.push(curso);
    }
    if (habilidade) {
 
      query += " AND habilidades LIKE ?";
      params.push(`%${String(habilidade).slice(0, 100)}%`);
    }

    if (ordem === "relevancia") {
      query += `
        ORDER BY (
          CASE WHEN curriculo_url IS NOT NULL THEN 3 ELSE 0 END +
          CASE WHEN linkedin IS NOT NULL AND linkedin != '' THEN 2 ELSE 0 END +
          CASE WHEN github IS NOT NULL AND github != '' THEN 2 ELSE 0 END +
          CASE WHEN bio IS NOT NULL AND bio != '' THEN 1 ELSE 0 END +
          CASE WHEN foto_url IS NOT NULL THEN 1 ELSE 0 END
        ) DESC, criado_em DESC
      `;
    } else {
      query += " ORDER BY criado_em DESC";
    }

    const [rows] = await db.query(query, params);
    const talentos = rows.map((t) => ({ ...t, bio_html: renderBio(t.bio) }));
    return ok(res, talentos);
  } catch (err) {
    next(err);
  }
};

export const getTalentosAdmin = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM talentos ORDER BY criado_em DESC");
    const talentos = rows.map((t) => ({ ...t, bio_html: renderBio(t.bio) }));
    return ok(res, talentos);
  } catch (err) {
    next(err);
  }
};

 export const createTalento = async (req, res, next) => {
  try {
 
    console.log("Dados recebidos no Body:", req.body);
    console.log("Arquivos recebidos:", req.files);

 
    const nome = sanitize(req.body.nome || "");
    const curso = sanitize(req.body.curso || "");
    const ano = sanitize(req.body.ano || "");
    const habilidades = sanitize(req.body.habilidades || "");
 
    const linkedin = req.body.linkedin ? sanitize(req.body.linkedin) : null;
    const github = req.body.github ? sanitize(req.body.github) : null;
    const instagram = req.body.instagram ? sanitize(req.body.instagram) : null;
    const email = req.body.email ? sanitize(req.body.email) : null;
    const bio = req.body.bio ? String(req.body.bio).slice(0, 5000) : null;
 
    const foto_url = req.files?.foto?.[0] 
      ? `/uploads/fotos-perfil/${req.files.foto[0].filename}` 
      : null;
      
    const curriculo_url = req.files?.curriculo?.[0] 
      ? `/uploads/curriculos/${req.files.curriculo[0].filename}` 
      : null;
 
    const query = `
      INSERT INTO talentos 
      (nome, curso, ano, habilidades, linkedin, github, email, instagram, bio, foto_url, curriculo_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      nome, curso, ano, habilidades, linkedin, github, email, instagram, bio, foto_url, curriculo_url
    ]);

    return created(res, { id: result.insertId, mensagem: "Perfil enviado com sucesso!" });

  } catch (err) {
 
    console.error("ERRO CRÍTICO NO BACKEND:", err);
    
  
    if (err.code === 'ER_BAD_FIELD_ERROR') {
        return res.status(500).json({ mensagem: "Erro na estrutura do banco de dados." });
    }
    
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id }     = req.params;
    const { status } = req.body;

    const validos = ["aprovado", "reprovado", "pendente"];
    if (!validos.includes(status)) {
      return badRequest(res, `Status inválido. Use: ${validos.join(", ")}.`);
    }

    const [check] = await db.query("SELECT id FROM talentos WHERE id = ?", [id]);
    if (check.length === 0) return notFound(res, "Talento não encontrado.");

    await db.query("UPDATE talentos SET status = ? WHERE id = ?", [status, id]);
    return ok(res, { mensagem: "Status atualizado com sucesso." });
  } catch (err) {
    next(err);
  }
};

export const deleteTalento = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [check] = await db.query("SELECT id FROM talentos WHERE id = ?", [id]);

    if (check.length === 0) return notFound(res, "Talento não encontrado.");

    await db.query("DELETE FROM talentos WHERE id = ?", [id]);
    return ok(res, { mensagem: "Perfil removido com sucesso." });
  } catch (err) {
    next(err);
  }
};