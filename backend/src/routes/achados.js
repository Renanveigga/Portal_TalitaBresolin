import { Router } from "express";
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
 
router.post("/", protegerAdmin, upload.single("foto"), createAchado);

router.put("/:id", protegerAdmin, validateId, updateAchado);
router.delete("/:id", protegerAdmin, validateId, deleteAchado);

export default router;