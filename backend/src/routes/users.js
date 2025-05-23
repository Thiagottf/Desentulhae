const express = require('express')
const router  = express.Router()
const auth    = require('../middlewares/auth')
const ctrl    = require('../controllers/userController')

// GET /users → lista todos (talvez só admin depois)
router.get('/', auth, ctrl.list)

// GET /users/me → dados do próprio usuário
router.get('/me', auth, (req, res) => {
res.json({
    message: 'Usuário autenticado',
    user: req.user
})
})

// GET /users/:cpf → detalhes de um usuário (apenas se for o próprio)
router.get('/:cpf', auth, (req, res, next) => {
if (req.user.cpf !== req.params.cpf) {
    return res.status(403).json({ error: 'Acesso negado' })
}
ctrl.get(req, res, next)
})

// PUT /users/:cpf → atualizar dados (apenas se for o próprio)
router.put('/:cpf', auth, (req, res, next) => {
if (req.user.cpf !== req.params.cpf) {
    return res.status(403).json({ error: 'Acesso negado' })
}
ctrl.update(req, res, next)
})

// DELETE /users/:cpf → excluir conta (apenas se for o próprio)
router.delete('/:cpf', auth, (req, res, next) => {
if (req.user.cpf !== req.params.cpf) {
    return res.status(403).json({ error: 'Acesso negado' })
}
ctrl.remove(req, res, next)
})

// GET /users/me/entulhos → lista os entulhos do usuário logado
router.get('/me/entulhos', auth, ctrl.listarEntulhosDoUsuario);


module.exports = router
