const express = require('express')
const adminController = require('../controllers/adminController')
const router = express.Router()
const auth = require('../middleware/auth')




//POST

//add tournament
router.post('/tournaments', adminController.addTournament)

//add team 
router.post('/teams', adminController.addTeam)

//add matches to tournament
router.post('/tournaments/:tournament_id/matches', adminController.addMatchesToTournament)
    
//select captain
// router.post('/:tournament/:match/:team/captain', adminController.selectCaptain)


//DELETE

//delete tournament
router.delete('/tournaments/:id', adminController.deleteTournament)

//delete team
router.delete('/teams/:id', adminController.deleteTeam)


//PATCH

//add team to tournament
router.patch('/tournaments/:tournament_id/teams/:team_id', adminController.addTeamToTournament)

//remove team from tournament
router.patch('/tournaments/:tournament_id/teams/:team_id/remove', adminController.removeTeamFromTournament)

//update match info
router.patch('/matches/:match_id', adminController.updateMatch)

// //update match details
router.post('/matches/:match_id/details', adminController.updateMatchDetails)


module.exports = router;

