const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/chatController');

// GET /chats/:entulhoId → lista mensagens
router.get('/:entulhoId', auth, ctrl.list);

// POST /chats/:entulhoId → envia nova mensagem
router.post('/:entulhoId', auth, ctrl.send);

module.exports = router;
