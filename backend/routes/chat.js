// backend/routes/chat.js
const express = require('express')
const ctrl    = require('../controllers/chatController')
const auth    = require('../middlewares/auth')
const router  = express.Router({ mergeParams: true })

// Rotas: /api/chat/:entulhoId/messages
router.get('/:entulhoId/messages', auth, ctrl.list)
router.post('/:entulhoId/messages', auth, ctrl.send)

module.exports = router
