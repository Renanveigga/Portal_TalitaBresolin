import { Router } from "express";
import {
  getLivros,
  getLivroById,
  createLivro,
  updateLivro,
  deleteLivro,
} from "../controllers/livrosController.js";
import { protegerAdmin } from "../middlewares/adminAuth.js";
import { validate, validateId } from "../middlewares/validate.js";

const router = Router();

const schemaLivro = {
  titulo:    { required: true, maxLength: 255 },
  autor:     { required: true, maxLength: 255 },
  categoria: { required: true, maxLength: 100 },
};

router.get("/",        getLivros);
router.get("/:id",     validateId, getLivroById);
router.post("/",       protegerAdmin, validate(schemaLivro), createLivro);
router.put("/:id",     protegerAdmin, validateId, updateLivro);
router.delete("/:id",  protegerAdmin, validateId, deleteLivro);

export default router;