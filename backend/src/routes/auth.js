const express = require('express')
const router  = express.Router()
const ctrl    = require('../controllers/authController')

// POST /auth/register
router.post('/register', ctrl.register)

// POST /auth/login
router.post('/login',    ctrl.login)

module.exports = router
