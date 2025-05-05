const express = require('express')
const adminController = require('../controllers/adminController')
const router = express.Router()
const auth = require('../middleware/auth')


router.post('/tournaments', adminController.addTournament)

//add new team 
router.post('/teams/', adminController.addTeam)

//add team to tournament
router.post('/teams/:id', adminController.addTeamToTournament)

router.post('/:tournament/:match/:team/captain', adminController.selectCaptain)

router.post('/:team/:player', adminController.approvePlayerToTeam)

// router.delete('/tournament', adminController.deleteTournament)

module.exports = router;

