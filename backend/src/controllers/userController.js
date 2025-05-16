// src/controllers/userController.js
// const db = require('../config/db')

exports.list = async (req, res, next) => {
  try {
    res.json([]) // retornar todos os usuários (stub)
  } catch (err) { next(err) }
}

exports.get = async (req, res, next) => {
  try {
    res.json({ cpf: req.params.cpf }) // detalhes (stub)
  } catch (err) { next(err) }
}

exports.update = async (req, res, next) => {
  try {
    res.json({ message: 'Usuário atualizado (stub)' })
  } catch (err) { next(err) }
}

exports.remove = async (req, res, next) => {
  try {
    res.status(204).end()
  } catch (err) { next(err) }
}
