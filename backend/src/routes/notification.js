const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/notificationController');

router.get('/', auth, ctrl.listar);
router.patch('/:id/lida', auth, ctrl.marcarComoLida);

module.exports = router;
