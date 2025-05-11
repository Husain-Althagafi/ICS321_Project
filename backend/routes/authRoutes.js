const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/login/admin/:adminId', authController.loginAdmin)

router.get('/login/guest/:guestId', authController.loginGuest)

router.post('/register/guest', authController.registerGuest)

router.post('/register/admin', authController.registerAdmin)

module.exports = router;