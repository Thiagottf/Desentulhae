// src/controllers/authController.js
const db     = require('../config/knex')
const bcrypt = require('bcrypt')
const jwt    = require('jsonwebtoken')

exports.register = async (req, res, next) => {
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
    // 1) Veja se já existe usuário com esse CPF ou e-mail
    const existe = await db('usuario')
      .where('cpf', cpf)
      .orWhere('email', email)
      .first()
    if (existe) {
      return res.status(400).json({ error: 'CPF ou e-mail já cadastrado' })
    }

    // 2) Gere o hash da senha
    const senha_hash = await bcrypt.hash(senha, 10)

    // 3) Insira no banco
    await db('usuario').insert({
      cpf,
      nome_completo,
      apelido,
      data_nascimento,
      telefone,
      email,
      senha_hash,          // coluna no seu schema
      data_registro: db.fn.now(),
      role: 'cliente'      // padrão, ou receba no body
    })

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.login = async (req, res, next) => {
  const { cpf, senha } = req.body

  try {
    // 1) Busque o usuário pelo CPF
    const user = await db('usuario')
      .where('cpf', cpf)
      .first()

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    // 2) Compare a senha enviada com o hash do banco
    const senhaValida = await bcrypt.compare(senha, user.senha_hash)
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    // 3) Gere o token JWT (coloque as claims que quiser)
    const payload = {
      cpf:    user.cpf,
      apelido:user.apelido,
      role:   user.role
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })

    return res.json({ token })
  } catch (err) {
    next(err)
  }
}
