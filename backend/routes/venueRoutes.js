const express = require('express');
const venueController = require('../controllers/venueController');
const router = express.Router();

//GET

//get all venues
router.get('/', venueController.getAllVenues)


//POST

//add new venue
router.post('/', venueController.addNewVenue)

module.exports = router