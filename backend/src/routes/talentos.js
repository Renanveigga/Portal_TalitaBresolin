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
import { protegerAdmin } from "../middlewares/adminAuth.js";
import { validate, validateId } from "../middlewares/validate.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const pasta = file.fieldname === "foto" ? "fotos-perfil" : "curriculos";
    cb(null, `src/uploads/${pasta}/`);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}_${Date.now()}${ext}`);
  },
});

const imagemFilter = (req, file, cb) => {
  if (file.fieldname === "foto") {
    const permitidos = ["image/jpeg", "image/png", "image/webp"];
    return permitidos.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Apenas imagens."), false);
  }
  if (file.fieldname === "curriculo") {
    return file.mimetype === "application/pdf"
      ? cb(null, true)
      : cb(new Error("Apenas PDF."), false);
  }
  cb(new Error("Campo de arquivo inesperado."), false);
};

const upload = multer({
  storage,
  fileFilter: imagemFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "foto",      maxCount: 1 },
  { name: "curriculo", maxCount: 1 },
]);

const schemaTalento = {
  nome:        { required: true, maxLength: 255 },
  curso:       { required: true, enum: ["TI", "ADM"] },
  ano:         { required: true, enum: ["1º", "2º", "3º"] },
  habilidades: { required: true, maxLength: 1000 },
};

const schemaStatus = {
  status: { required: true, enum: ["aprovado", "reprovado", "pendente"] },
};

const router = Router();
router.get("/",       getTalentos);
router.get("/admin",  protegerAdmin, getTalentosAdmin);
router.post("/",      upload, validate(schemaTalento), createTalento);
router.put("/:id",    protegerAdmin, validateId, validate(schemaStatus), updateStatus);
router.delete("/:id", protegerAdmin, validateId, deleteTalento);

export default router;