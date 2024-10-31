const express = require('express')
const authController = require('../controllers/auth.controller')
const router = express.Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/update-password', authController.protect, authController.updatePassword)

module.exports = router