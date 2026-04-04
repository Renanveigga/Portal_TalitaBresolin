 

export const ok = (res, dados, status = 200) =>
  res.status(status).json({ sucesso: true, dados });

export const created = (res, dados) =>
  res.status(201).json({ sucesso: true, dados });

export const noContent = (res) =>
  res.status(204).send();

export const badRequest = (res, erro) =>
  res.status(400).json({ sucesso: false, erro });

export const unauthorized = (res, erro = "Não autorizado") =>
  res.status(401).json({ sucesso: false, erro });

export const forbidden = (res, erro = "Acesso negado") =>
  res.status(403).json({ sucesso: false, erro });

export const notFound = (res, erro = "Recurso não encontrado") =>
  res.status(404).json({ sucesso: false, erro });

export const serverError = (res, erro = "Erro interno do servidor") =>
  res.status(500).json({ sucesso: false, erro });