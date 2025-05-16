// src/middlewares/auth.js
module.exports = (req, res, next) => {
  // Exemplo bem simples só pra ilustrar:
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Sem token' })
  }
  // você validaria o JWT aqui e colocaria o usuário em req.user
  next()
}
