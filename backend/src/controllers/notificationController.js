// src/controllers/notificationController.js
// const db = require('../config/db')

exports.index = async (req, res, next) => {
  try {
    res.json([]) // lista notificações
  } catch (err) { next(err) }
}

exports.markAsRead = async (req, res, next) => {
  try {
    res.json({ message: 'Notificação marcada como lida (stub)' })
  } catch (err) { next(err) }
}
