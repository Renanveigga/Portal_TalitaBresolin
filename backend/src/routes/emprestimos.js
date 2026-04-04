import { Router } from "express";
import {
  getEmprestimos,
  createEmprestimo,
  devolverLivro,
  deleteEmprestimo,
} from "../controllers/emprestimosController.js";
import { protegerAdmin } from "../middlewares/adminAuth.js";
import { validate, validateId } from "../middlewares/validate.js";

const router = Router();

const schemaEmprestimo = {
  livro_id:   { required: true, isInt: true, isPositive: true },
  nome_aluno: { required: true, maxLength: 255 },
  turma:      { required: false, maxLength: 50 },
};

router.get("/",        protegerAdmin, getEmprestimos);
router.post("/",       protegerAdmin, validate(schemaEmprestimo), createEmprestimo);
router.put("/:id",     protegerAdmin, validateId, devolverLivro);
router.delete("/:id",  protegerAdmin, validateId, deleteEmprestimo);

export default router;