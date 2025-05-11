const express = require('express');
const teamController = require('../controllers/teamController');
const router = express.Router();

router.get('/', teamController.getAllTeams)

router.get('/:id', teamController.getTeamById)

router.get('/:id/players',teamController.getPlayersByTeamId)

router.get('/matches/:match_id', teamController.getTeamsByMatch)


//PUT

//update team
router.put('/:id', teamController.updateTeam)


//POST

//add player
router.post('/:id/players', teamController.addPlayer)

//PATCH

//edit player
router.patch('/:id/:player_id', teamController.updatePlayer)

//DELETE

//delete player
router.delete('/:id/:player_id', teamController.deletePlayer)


module.exports = router