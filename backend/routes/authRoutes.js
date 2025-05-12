const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/login/admin/', authController.loginAdmin)

router.post('/login/guest', authController.loginGuest)

router.post('/register/guest', authController.registerGuest)

router.post('/register/admin', authController.registerAdmin)

module.exports = router;