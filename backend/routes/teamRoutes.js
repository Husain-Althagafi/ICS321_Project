const express = require('express');
const teamController = require('../controllers/teamController');
const router = express.Router();

router.get('/', teamController.getAllTeams)

router.get('/:id', teamController.getTeamById)

router.get('/:id/players',teamController.getPlayersByTeamId)

router.get('/matches/:match_no', teamController.getTeamsByMatch)


//PUT

router.put('/:id', teamController.updateTeam)

module.exports = router