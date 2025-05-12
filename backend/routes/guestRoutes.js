const express = require('express');
const guestController = require('../controllers/guestController');
const router = express.Router();

// Public guest routes
router.get('/teams', guestController.getTeams);
// Public guest tournaments route
router.get('/tournaments', guestController.getTournaments);

// Public guest players route
router.get('/players', guestController.getPlayers);

// Public guest yellow card events route
router.get('/cards/yellow', guestController.getYellowCards);

// Public guest red card events route
router.get('/cards/red', guestController.getRedCards);

// Public guest match results route
router.get('/matches', guestController.getMatches);
// Public guest venues route
router.get('/venues', guestController.getVenues);

// Public guest individual goal events route
router.get('/goal-events', guestController.getGoalEvents);

// Public guest aggregated match goals route
router.get('/match-goals', guestController.getMatchGoals);

// Public guest tournament teams route
router.get('/tournament-teams', guestController.getTournamentTeams);

// router.get('/:tournament/matches', guestController.getAllMatchesForTournament)

// router.get('/tournaments/best-scorer', guestController.getMostGoals)

// router.get('/teams/red-cards', guestController.getAllRedCards)

// router.get('/teams/members', guestController.getTeamMembers)

module.exports = router;
