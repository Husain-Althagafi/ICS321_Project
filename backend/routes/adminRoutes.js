const express = require('express')
const adminController = require('../controllers/adminController')
const router = express.Router()
const auth = require('../middleware/auth')


router.post('/tournaments', adminController.addTournament)

router.post('/teams', adminController.addTeamToTournament)

router.post('/:tournament/:match/:team/captain', adminController.selectCaptain)

router.post('/:team/:player', adminController.approvePlayerToTeam)

// router.delete('/tournament', adminController.deleteTournament)

module.exports = router;

