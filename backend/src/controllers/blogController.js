// src/controllers/blogController.js
// const db = require('../config/db')

exports.index = async (req, res, next) => {
  try {
    res.json([]) // lista posts
  } catch (err) { next(err) }
}

exports.show = async (req, res, next) => {
  try {
    res.json({ id: req.params.id }) // detalhes
  } catch (err) { next(err) }
}

exports.create = async (req, res, next) => {
  try {
    res.status(201).json({ message: 'Post criado (stub)' })
  } catch (err) { next(err) }
}

exports.update = async (req, res, next) => {
  try {
    res.json({ message: 'Post atualizado (stub)' })
  } catch (err) { next(err) }
}

exports.remove = async (req, res, next) => {
  try {
    res.status(204).end()
  } catch (err) { next(err) }
}
