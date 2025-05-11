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

//update tournament info
router.patch('/tournaments/:tournament_id', adminController.updateTournament)


// //update match details
// router.post('/matches/:match_id/details', adminController.updateMatchDetails)



// Goal events
router.post('/goal-events', adminController.addGoalEvent);
router.get('/goal-events', adminController.getGoalEvents);
router.delete('/goal-events', adminController.deleteGoalEvent);

// Match goals (aggregated per player)
router.post('/match-goals', adminController.addMatchGoals);
router.get('/match-goals', adminController.getMatchGoals);
router.patch('/match-goals', adminController.updateMatchGoals);
router.delete('/match-goals/player/:player_id', adminController.deletePlayerMatchGoals);


// Cards

router.get('/red-cards/:match_id', adminController.getRedCardsForMatch)

// router.post('/red-cards')

// router.delete('/red-cards')

// router.get('/yellow-cards')

// router.post('/yellow-cards')

// router.delete('/yellow-cards')

module.exports = router;

