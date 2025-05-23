const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/auth');
const ctrl    = require('../controllers/entulhoController');

// Rotas públicas
// GET    /entulhos          → lista todos os entulhos
// GET    /entulhos/:id      → detalhes de um entulho
router.get('/',    ctrl.index);
router.get('/:id', ctrl.show);

// Middleware de autenticação para rotas protegidas
router.use(auth);

// POST   /entulhos          → cria um novo entulho
// PUT    /entulhos/:id      → atualiza um entulho existente
// DELETE /entulhos/:id      → exclui um entulho
// POST   /entulhos/:id/solicitar → solicita a compra/doação
router.post('/',            ctrl.create);
router.put('/:id',          ctrl.update);
router.delete('/:id',       ctrl.remove);
router.post('/:id/solicitar', ctrl.solicitar); // ✅ nova rota aqui

module.exports = router;
