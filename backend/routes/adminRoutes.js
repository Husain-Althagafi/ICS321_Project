const express = require('express')
const {
  addTournament,
  deleteTournament,
  getTournaments
} = require('../controllers/adminController');
const router = express.Router()
// const auth = require('../middleware/auth')


router.post('/tournaments', addTournament)

// List all tournaments
router.get('/tournaments', getTournaments);

// Delete a specific tournament
router.delete('/tournaments/:id', deleteTournament);

// router.post('/teams', adminController.addTeamToTournament)

// router.post('/:tournament/:match/:team/captain', adminController.selectCaptain)

// router.post('/:team/:player', adminController.approvePlayerToTeam)

// router.delete('/tournament', adminController.deleteTournament)

module.exports = router;
