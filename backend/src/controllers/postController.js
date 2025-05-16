// backend/controllers/postController.js
const Post = require('../models/postModel')

module.exports = {
async index(req, res, next) {
    try {
    const posts = await Post.all()
    res.json(posts)
    } catch(err){ next(err) }
},

async show(req, res, next) {
    try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ error: 'Post não encontrado' })
    res.json(post)
    } catch(err){ next(err) }
},

async create(req, res, next) {
    try {
    const autor_cpf = req.user.cpf
    const { title, excerpt, content, image_url } = req.body
    const [newPost] = await Post.create({ autor_cpf, title, excerpt, content, image_url })
    res.status(201).json(newPost)
    } catch(err){ next(err) }
},

async update(req, res, next) {
    try {
    const changes = req.body
    await Post.update(req.params.id, changes)
    res.json({ message: 'Atualizado' })
    } catch(err){ next(err) }
},

async remove(req, res, next) {
    try {
    await Post.remove(req.params.id)
    res.status(204).end()
    } catch(err){ next(err) }
}
}
