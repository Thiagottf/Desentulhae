const express = require('express')
const router  = express.Router()
const auth    = require('../middlewares/auth')
const ctrl    = require('../controllers/blogController')

// GET    /blog           → lista todos os posts
router.get('/',       ctrl.index)

// GET    /blog/:id       → detalhes de um post
router.get('/:id',    ctrl.show)

// POST   /blog           → cria um post (precisa estar logado)
router.post('/', auth, ctrl.create)

// PUT    /blog/:id       → atualiza um post
router.put('/:id', auth, ctrl.update)

// DELETE /blog/:id       → remove um post
router.delete('/:id', auth, ctrl.remove)

module.exports = router
