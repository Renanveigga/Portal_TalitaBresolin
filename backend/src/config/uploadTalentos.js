import multer from "multer";
import path from "path";

const storage = (pasta) => multer.diskStorage({
  destination: (req, file, cb) => cb(null, `src/uploads/${pasta}/`),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${pasta}_${Date.now()}${ext}`);
  },
});

const imagemFilter = (req, file, cb) => {
  const permitidos = ["image/jpeg", "image/png", "image/webp"];
  permitidos.includes(file.mimetype) ? cb(null, true) : cb(new Error("Apenas imagens."), false);
};

const pdfFilter = (req, file, cb) => {
  file.mimetype === "application/pdf" ? cb(null, true) : cb(new Error("Apenas PDF."), false);
};

export const uploadFoto     = multer({ storage: storage("fotos-perfil"), fileFilter: imagemFilter, limits: { fileSize: 3 * 1024 * 1024 } });
export const uploadCurriculo = multer({ storage: storage("curriculos"),   fileFilter: pdfFilter,    limits: { fileSize: 5 * 1024 * 1024 } });