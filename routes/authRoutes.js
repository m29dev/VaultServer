const express = require('express')
const { postSignIn, postSignUp } = require('../controllers/authController')
const router = express.Router()

// Route for currency exchange
router.post('/api/auth/login', postSignIn)
router.post('/api/auth/register', postSignUp)

module.exports = router
