const express = require('express')
const matchController = require('../controllers/matchController')
const router = express.Router()

router.get('/', matchController.getAllMatches)

// router.get('/:match_no/goals', matchController.getGoalsByMatchNo)

// router.get('/:match_no/captains', matchController.getCaptainsByMatchId)


module.exports = router