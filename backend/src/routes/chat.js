const express = require('express')
const router  = express.Router({ mergeParams: true })
const auth    = require('../middlewares/auth')
const ctrl    = require('../controllers/chatController')

// GET  /chat/:entulhoId/messages  → lista mensagens de um chat
router.get('/:entulhoId/messages', auth, ctrl.list)

// POST /chat/:entulhoId/messages  → envia uma nova mensagem
router.post('/:entulhoId/messages', auth, ctrl.send)

module.exports = router
