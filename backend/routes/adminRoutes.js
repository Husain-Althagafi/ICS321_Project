const express = require('express')
const adminController = require('../controllers/adminController')
const router = express.Router()
const auth = require('../middleware/auth')


//POST

//add tournament
router.post('/tournaments', adminController.addTournament)

//add team 
router.post('/teams', adminController.addTeam)

//add team to tournament
router.post('/teams/:id', adminController.addTeamToTournament)
    
//select captain
router.post('/:tournament/:match/:team/captain', adminController.selectCaptain)

//add player to team
router.post('/:team/:player', adminController.approvePlayerToTeam)



//DELETE

//delete tournament
router.delete('/tournaments/:id', adminController.deleteTournament)

//delete team
router.delete('/teams/:id', adminController.deleteTeam)


module.exports = router;

