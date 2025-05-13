// backend/controllers/userController.js
const bcrypt = require('bcrypt')
const jwt    = require('jsonwebtoken')
const User   = require('../models/userModel')

const SALT_ROUNDS = 10

module.exports = {
async signup(req, res, next) {
    try {
    const { cpf, nome_completo, apelido, data_nascimento, telefone, email, senha, role } = req.body
    const exists = await User.findByCpf(cpf) || await User.findByEmail(email)
    if (exists) return res.status(409).json({ error: 'Usuário já existe' })

    const hash = await bcrypt.hash(senha, SALT_ROUNDS)
    await User.create({
        cpf, nome_completo, apelido, data_nascimento,
        telefone, email, senha_hash: hash, role
    })
    res.status(201).json({ message: 'Usuário criado' })
    } catch(err) { next(err) }
},

async login(req, res, next) {
    try {
    const { email, senha } = req.body
    const user = await User.findByEmail(email)
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' })

    const match = await bcrypt.compare(senha, user.senha_hash)
    if (!match) return res.status(401).json({ error: 'Credenciais inválidas' })

    const token = jwt.sign({
        cpf:     user.cpf,
        apelido: user.apelido,
        role:    user.role
    }, process.env.JWT_SECRET, { expiresIn: '8h' })

    res.json({ token, user: { cpf: user.cpf, apelido: user.apelido, role: user.role } })
    } catch(err) { next(err) }
},

async me(req, res, next) {
    // requisição já passada pelo auth middleware
    res.json({ user: req.user })
}
}
