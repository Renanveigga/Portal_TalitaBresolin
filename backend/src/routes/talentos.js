import { Router } from "express";
import path from "path";
import multer from "multer";
import {
  getTalentos,
  getTalentosAdmin,
  createTalento,
  updateStatus,
  deleteTalento,
} from "../controllers/talentosController.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const pasta = file.fieldname === "foto" ? "fotos-perfil" : "curriculos";
    cb(null, `src/uploads/${pasta}/`);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "foto",      maxCount: 1 },
  { name: "curriculo", maxCount: 1 },
]);

const router = Router();
router.get("/",       getTalentos);
router.get("/admin",  getTalentosAdmin);
router.post("/",      upload, createTalento);
router.put("/:id",    updateStatus);
router.delete("/:id", deleteTalento);

export const getTalent = async (req, res) => {
  try {
    const { curso, habilidade, ordem } = req.query;
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

    if (ordem === "relevancia") {
      query += `
        ORDER BY
          (CASE WHEN curriculo_url IS NOT NULL THEN 3 ELSE 0 END +
           CASE WHEN linkedin    IS NOT NULL AND linkedin    != '' THEN 2 ELSE 0 END +
           CASE WHEN github      IS NOT NULL AND github      != '' THEN 2 ELSE 0 END +
           CASE WHEN bio         IS NOT NULL AND bio         != '' THEN 1 ELSE 0 END +
           CASE WHEN foto_url    IS NOT NULL THEN 1 ELSE 0 END
          ) DESC, criado_em DESC
      `;
    } else {
      query += " ORDER BY criado_em DESC";
    }

    const [rows] = await db.query(query, params);
    const talentos = rows.map((t) => ({ ...t, bio_html: renderBio(t.bio) }));
    res.json(talentos);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar talentos", detalhe: error.message });
  }
};

export default router;