import { Router } from "express";
import multer from "multer";
import path from "path";
import { getEsportes, createEsporte, deleteEsporte } from "../controllers/esportesController.js";
import { protegerAdmin } from "../middlewares/adminAuth.js";
import { validate, validateId } from "../middlewares/validate.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/uploads/"),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `esporte_${Date.now()}${ext}`);
  },
});

const imagemFilter = (req, file, cb) => {
  const permitidos = ["image/jpeg", "image/png", "image/webp"];
  if (permitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Apenas imagens JPEG, PNG ou WebP são permitidas."), false);
  }
};

const upload = multer({
  storage,
  fileFilter: imagemFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const schemaEsporte = {
  titulo:      { required: true, maxLength: 255 },
  modalidade:  { required: true, maxLength: 100 },
  data_evento: { required: true, isDate: true },
  medalha:     { required: false, enum: ["ouro", "prata", "bronze", "participacao"] },
  resumo:      { required: false, maxLength: 1000 },
};

const router = Router();
router.get("/",        getEsportes);
router.post("/",       protegerAdmin, upload.single("foto"), validate(schemaEsporte), createEsporte);
router.delete("/:id",  protegerAdmin, validateId, deleteEsporte);

export default router;