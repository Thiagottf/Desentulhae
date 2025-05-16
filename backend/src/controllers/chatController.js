// src/controllers/chatController.js
// const db = require('../config/db')

exports.list = async (req, res, next) => {
  try {
    res.json([]) // lista mensagens
  } catch (err) { next(err) }
}

exports.send = async (req, res, next) => {
  try {
    res.status(201).json({ id: 1, texto: req.body.texto }) // stub
  } catch (err) { next(err) }
}
