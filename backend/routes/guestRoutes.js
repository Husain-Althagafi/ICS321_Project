const express = require('express');
const guestController = require('../controllers/guestController');
const router = express.Router();

router.get('/:tournament/matches', guestController.getAllMatchesForTournament)

router.get('/tournaments/best-scorer', guestController.getMostGoals)

router.get('/teams/red-cards', guestController.getAllRedCards)

router.get('/teams/members', guestController.getTeamMembers)

module.exports = router;
