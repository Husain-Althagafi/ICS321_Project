const express = require('express');
const tournamentController = require('../controllers/tournamentController');
const router = express.Router();

router.get('/', tournamentController.getTournaments)


module.exports = router