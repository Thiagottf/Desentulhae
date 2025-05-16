const express = require('express')
const router  = express.Router()
const auth    = require('../middlewares/auth')
const ctrl    = require('../controllers/entulhoController')

// GET    /entulhos                → lista todos os entulhos
router.get('/',          ctrl.index)

// GET    /entulhos/:id            → detalhes de um entulho
router.get('/:id',       ctrl.show)

// POST   /entulhos               → cria um novo entulho
router.post('/',   auth, ctrl.create)

// PUT    /entulhos/:id            → atualiza um entulho existente
router.put('/:id', auth, ctrl.update)

// DELETE /entulhos/:id            → exclui um entulho
router.delete('/:id',auth, ctrl.remove)

module.exports = router
