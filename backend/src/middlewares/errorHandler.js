
export function errorHandler(err, req, res, next) {

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ sucesso: false, erro: "JSON inválido no corpo da requisição." });
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ sucesso: false, erro: "Arquivo muito grande. Limite excedido." });
  }
  if (err.message === "Apenas imagens." || err.message === "Apenas PDF.") {
    return res.status(400).json({ sucesso: false, erro: err.message });
  }
 
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ sucesso: false, erro: "Registro duplicado." });
  }
  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({ sucesso: false, erro: "Referência inválida: registro relacionado não encontrado." });
  }
 
  console.error(`[${new Date().toISOString()}] ERRO NÃO TRATADO:`, {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  return res.status(500).json({ sucesso: false, erro: "Erro interno do servidor." });
}
 
export function notFoundHandler(req, res) {
  res.status(404).json({ sucesso: false, erro: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
}