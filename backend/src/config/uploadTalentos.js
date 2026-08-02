import multer from "multer";
import path from "path";
import fs from "fs";
 
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage = (pasta) => multer.diskStorage({
  destination: (req, file, cb) => {
    const destinoFinal = path.resolve(`src/uploads/${pasta}`);
    ensureDirExists(destinoFinal);
    cb(null, destinoFinal);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}_${Date.now()}${ext}`);
  },
});

const imagemFilter = (req, file, cb) => {
  const permitidos = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/jfif"];
  const isExtValid = /\.(jpg|jpeg|png|webp|jfif)$/i.test(file.originalname);
  
  if (permitidos.includes(file.mimetype) || isExtValid) {
    cb(null, true);
  } else {
    cb(new Error("Apenas imagens (JPEG, PNG, WEBP)."), false);
  }
};

const pdfFilter = (req, file, cb) => {
  const isPdf = file.mimetype === "application/pdf" || /\.pdf$/i.test(file.originalname);
  if (isPdf) {
    cb(null, true);
  } else {
    cb(new Error("Apenas arquivos PDF."), false);
  }
};

export const uploadFoto = multer({ 
  storage: storage("fotos-perfil"), 
  fileFilter: imagemFilter, 
  limits: { fileSize: 3 * 1024 * 1024 } 
});

export const uploadCurriculo = multer({ 
  storage: storage("curriculos"),   
  fileFilter: pdfFilter,    
  limits: { fileSize: 5 * 1024 * 1024 } 
});