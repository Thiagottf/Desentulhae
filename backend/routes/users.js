// backend/routes/users.js
const express = require('express')
const controller = require('../controllers/userController')
const auth = require('../middlewares/auth')
const router = express.Router()

router.post('/signup', controller.signup)
router.post('/login',  controller.login)
router.get('/me', auth, controller.me)

module.exports = router
