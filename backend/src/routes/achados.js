import { Router } from "express";
import multer from "multer";
import {
  getAchados,
  getAchadoById,
  createAchado,
  updateAchado,
  deleteAchado,
} from "../controllers/achadosController.js";
import upload from "../config/upload.js";
import { protegerAdmin } from "../middlewares/adminAuth.js";
import { validateId } from "../middlewares/validate.js";

const router = Router();

router.get("/", getAchados);
router.get("/:id", validateId, getAchadoById);
 
router.post("/", protegerAdmin, (req, res, next) => {
  const multerUpload = upload.single("foto");

  multerUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
   
      console.error("[Multer Error]:", err);
      return res.status(400).json({ sucesso: false, erro: `Falha no ficheiro: ${err.message}` });
    } else if (err) {
     
      console.error("[Upload Error]:", err);
      return res.status(400).json({ sucesso: false, erro: err.message });
    }
     
    next();
  });
}, createAchado);

router.put("/:id", protegerAdmin, validateId, updateAchado);
router.delete("/:id", protegerAdmin, validateId, deleteAchado);

export default router;