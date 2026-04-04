import multer from "multer";
import path from "path";

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];
 
const EXTENSOES_VALIDAS = [".jpg", ".jpeg", ".png", ".webp"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/uploads/"),

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
 
    const nome = `achado_${Date.now()}${ext}`;
    cb(null, nome);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const tipoValido     = TIPOS_PERMITIDOS.includes(file.mimetype);
  const extensaoValida = EXTENSOES_VALIDAS.includes(ext);

  if (tipoValido && extensaoValida) {
    cb(null, true);
  } else {
    cb(new Error("Apenas imagens JPEG, PNG ou WebP são permitidas."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },  
});

export default upload;