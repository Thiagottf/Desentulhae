// backend/middlewares/auth.js
const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
const authHeader = req.headers.authorization
if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' })

const [, token] = authHeader.split(' ')
try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload  // { cpf, role, apelido, etc. }
    next()
} catch {
    return res.status(401).json({ error: 'Token inválido' })
}
}
