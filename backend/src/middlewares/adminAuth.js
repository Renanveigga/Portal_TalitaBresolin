import jwt from "jsonwebtoken";
import { unauthorized, forbidden } from "../utils/response.js";
 
export function protegerAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return unauthorized(res, "Token não fornecido ou formato inválido. Use: Bearer <token>");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.admin) {
      return forbidden(res, "Acesso negado: privilégios insuficientes");
    }

    req.admin = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return unauthorized(res, "Token expirado. Faça login novamente.");
    }
    return unauthorized(res, "Token inválido.");
  }
}