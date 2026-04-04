import { Router } from "express";
import {
  getAvisos,
  getAvisoById,
  createAviso,
  deleteAviso,
} from "../controllers/avisosController.js";
import { protegerAdmin } from "../middlewares/adminAuth.js";
import { validate, validateId } from "../middlewares/validate.js";

const router = Router();

const schemaAviso = {
  titulo:      { required: true, maxLength: 255 },
  tipo:        { required: true, enum: ["evento", "prova", "feriado", "palestra"] },
  data_evento: { required: true, isDate: true },
  descricao:   { required: false, maxLength: 1000 },
};

router.get("/",            getAvisos);
router.get("/:id",         validateId, getAvisoById);
router.post("/",           protegerAdmin, validate(schemaAviso), createAviso);
router.delete("/:id",      protegerAdmin, validateId, deleteAviso);

export default router;