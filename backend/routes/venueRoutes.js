const express = require('express');
const venueController = require('../controllers/venueController');
const router = express.Router();

router.get('/', venueController.getAllVenues)

module.exports = router