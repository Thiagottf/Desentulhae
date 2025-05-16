const express = require('express')
const router  = express.Router()
const auth    = require('../middlewares/auth')
const ctrl    = require('../controllers/notificationController')

// GET    /notificacoes           → lista todas as notificações do usuário
router.get('/',      auth, ctrl.index)

// PUT    /notificacoes/:id       → marca notificação como lida
router.put('/:id',   auth, ctrl.markAsRead)

module.exports = router
