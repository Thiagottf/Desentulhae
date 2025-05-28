// src/controllers/authController.js
const db     = require('../config/knex')
const bcrypt = require('bcrypt')
const jwt    = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'segredoDesentulhae' // fallback caso .env não esteja funcionando

// Registro
async function register(req, res) {
  const {
    cpf,
    nome_completo,
    apelido,
    data_nascimento,
    telefone,
    email,
    senha
  } = req.body

  try {
    // Verificações únicas
    const existente = await db('usuario')
      .where('cpf', cpf)
      .orWhere('email', email)
      .orWhere('telefone', telefone)
      .first()

    if (existente) {
      return res.status(400).json({
        error: 'Já existe um usuário com esse CPF, e-mail ou telefone'
      })
    }

    // Criptografa senha
    const senha_hash = await bcrypt.hash(senha, 10)

    // Insere novo usuário
    await db('usuario').insert({
      cpf,
      nome_completo,
      apelido,
      data_nascimento,
      telefone,
      email,
      senha_hash,
      data_registro: db.fn.now(),
      role: 'user'
    })


    return res.status(201).json({ message: 'Usuário cadastrado com sucesso' })
  } catch (err) {
    console.error('Erro no registro:', err)
    return res.status(500).json({ error: 'Erro interno do servidor', detalhes: err.message })
  }
}

// Login
async function login(req, res) {
  const { email, senha } = req.body

  try {
    if (!email || !senha) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' })
    }

    const user = await db('usuario')
      .where({ email })
      .first()

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' })
    }

    const senhaValida = await bcrypt.compare(senha, user.senha_hash)
    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha incorreta' })
    }

    const token = jwt.sign(
      {
        cpf: user.cpf,
        apelido: user.apelido,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    return res.json({ token })
  } catch (err) {
    console.error('Erro no login:', err)
    return res.status(500).json({ error: 'Erro interno do servidor', detalhes: err.message })
  }
}


module.exports = {
  register,
  login
}
