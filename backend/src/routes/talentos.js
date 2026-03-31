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
export default router;