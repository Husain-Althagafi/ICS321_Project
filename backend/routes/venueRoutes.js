const express = require('express');
const venueController = require('../controllers/venueController');
const router = express.Router();

//GET

//get all venues
router.get('/', venueController.getAllVenues)


//POST

//add new venue
router.post('/', venueController.addNewVenue)


//PATCH

//update venue
router.patch('/:venue_id', venueController.editVenue)


//DELETE

//delete a venue
router.delete('/:venue_id', venueController.deleteVenue)

module.exports = router