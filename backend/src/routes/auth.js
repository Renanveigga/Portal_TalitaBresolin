import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ok, unauthorized, badRequest } from "../utils/response.js";

const router = express.Router();

 
router.post("/login", async (req, res, next) => {
  try {
    const { senha } = req.body;

    if (!senha || typeof senha !== "string" || senha.trim() === "") {
      return badRequest(res, "O campo 'senha' é obrigatório.");
    }
 
    if (senha.length > 128) {
      return badRequest(res, "Senha inválida.");
    }

    const senhaValida = await bcrypt.compare(senha, process.env.ADMIN_PASSWORD);

    if (!senhaValida) {
 
      return unauthorized(res, "Credenciais inválidas.");
    }

    const token = jwt.sign(
      { admin: true },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return ok(res, { token, tipo: "Bearer", expiresIn: "2h" });
  } catch (err) {
    next(err);
  }
});

export default router;