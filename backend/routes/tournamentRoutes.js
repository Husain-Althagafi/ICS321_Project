const express = require('express');
const tournamentController = require('../controllers/tournamentController');
const router = express.Router();


//GET
router.get('/', tournamentController.getTournaments)

router.get('/:id', tournamentController.getTournamentById)

router.get('/:id/players', tournamentController.getPlayersByTournamentId)

//get tournamnet matches
router.get('/:id/matches', tournamentController.getMatchesByTournamentId)

router.get('/:id/teams', tournamentController.getTeamsByTournamentId)

//POST

// router.post('/', tournamentController.addNewTournament)  this exists in admin route

//PUT

// router.put('/:id', tournamentController.updateTournamentById)

module.exports = router

//DELETE

// router.delete('/:id', tournamentController.deleteTournamentById)
