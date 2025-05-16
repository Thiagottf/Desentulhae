const express = require('express')
const router  = express.Router()
const auth    = require('../middlewares/auth')
const ctrl    = require('../controllers/userController')

// GET    /users          → lista todos os usuários
router.get('/',        auth, ctrl.list)

// GET    /users/:cpf     → detalhes de um usuário
router.get('/:cpf',    auth, ctrl.get)

// PUT    /users/:cpf     → atualiza dados de um usuário
router.put('/:cpf',    auth, ctrl.update)

// DELETE /users/:cpf     → remove um usuário
router.delete('/:cpf', auth, ctrl.remove)

module.exports = router
