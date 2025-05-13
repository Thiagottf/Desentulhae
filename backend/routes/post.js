// backend/routes/post.js
const express = require('express')
const ctrl    = require('../controllers/postController')
const auth    = require('../middlewares/auth')
const router  = express.Router()

router.get('/',       ctrl.index)
router.get('/:id',    ctrl.show)
router.post('/', auth, ctrl.create)
router.put('/:id', auth, ctrl.update)
router.delete('/:id', auth, ctrl.remove)

module.exports = router
