const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'segredoDesentulhae'

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido ou mal formatado' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded // contém { cpf, apelido, role, ... }
    next()
  } catch (err) {
    console.error('Erro ao verificar token:', err)
    return res.status(401).json({ error: 'Token inválido ou expirado' })
  }
}
