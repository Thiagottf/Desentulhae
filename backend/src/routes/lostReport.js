const express = require('express')
const router  = express.Router()
const auth    = require('../middlewares/auth')
const ctrl    = require('../controllers/lostReportController')

// GET    /reports             → lista todos os lost reports
router.get('/',       auth, ctrl.index)

// GET    /reports/:id         → detalhes de um lost report
router.get('/:id',    auth, ctrl.show)

// POST   /reports             → cria um novo lost report
router.post('/',      auth, ctrl.create)

// PUT    /reports/:id         → atualiza um lost report
router.put('/:id',    auth, ctrl.update)

// DELETE /reports/:id         → exclui um lost report
router.delete('/:id', auth, ctrl.remove)

module.exports = router
