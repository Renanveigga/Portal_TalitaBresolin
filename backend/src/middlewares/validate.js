import { badRequest } from "../utils/response.js";
import xss from "xss";
 
export const validate = (schema) => (req, res, next) => {
  const erros = [];
  const fonte = req.method === "GET" ? req.query : req.body;

  for (const [campo, regras] of Object.entries(schema)) {
    const valor = fonte[campo];
    const vazio = valor === undefined || valor === null || String(valor).trim() === "";

    if (regras.required && vazio) {
      erros.push(`O campo '${campo}' é obrigatório.`);
      continue;
    }
    if (vazio) continue;  

    const valorStr = String(valor).trim();

    if (regras.maxLength && valorStr.length > regras.maxLength) {
      erros.push(`'${campo}' deve ter no máximo ${regras.maxLength} caracteres.`);
    }
    if (regras.minLength && valorStr.length < regras.minLength) {
      erros.push(`'${campo}' deve ter no mínimo ${regras.minLength} caracteres.`);
    }
    if (regras.enum && !regras.enum.includes(valorStr)) {
      erros.push(`'${campo}' deve ser um dos valores: ${regras.enum.join(", ")}.`);
    }
    if (regras.isDate && isNaN(Date.parse(valorStr))) {
      erros.push(`'${campo}' deve ser uma data válida (AAAA-MM-DD).`);
    }
    if (regras.isInt && !Number.isInteger(Number(valorStr))) {
      erros.push(`'${campo}' deve ser um número inteiro.`);
    }
    if (regras.isPositive && Number(valorStr) <= 0) {
      erros.push(`'${campo}' deve ser um número positivo.`);
    }
  }

  if (erros.length > 0) {
    return badRequest(res, erros.join(" | "));
  }

  next();
};
 
export const validateId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return badRequest(res, "ID inválido: deve ser um número inteiro positivo.");
  }
  next();
};
 
export const sanitize = (valor) => {
  if (typeof valor !== "string") return valor;
  return xss(valor);
};