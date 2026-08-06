import multer from "multer";
import path from "path";
import { ensureUploadsSubdir } from "../utils/uploadsPath.js";

const uploadDir = ensureUploadsSubdir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const original = file?.originalname || "imagem.jpg";
    const ext = path.extname(original).toLowerCase() || ".jpg";
    const nome = `achado_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, nome);
  },
});

const fileFilter = (req, file, cb) => {
  if (file && file.mimetype && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Apenas ficheiros de imagem são permitidos."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;