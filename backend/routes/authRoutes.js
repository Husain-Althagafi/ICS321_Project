const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const auth = require('../middleware/auth')

router.post('/login', authController.login)

router.get('/logged', auth)
// router.post('/logout', authController.logout)

module.exports = router;