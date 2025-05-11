const express = require('express')
const matchController = require('../controllers/matchController')
const router = express.Router()

router.get('/', matchController.getAllMatches)

router.get('/:match_id/goals', matchController.getGoalsByMatchNo)

router.get('/:match_id/captains', matchController.getCaptainsByMatchId)

//POST

//add goal to match
router.post('/:match_id/goals', matchController.addGoalToMatch)

module.exports = router