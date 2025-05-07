const express = require('express')
const matchController = require('../controllers/matchController')
const router = express.Router()

router.get('/:match_no/goals', matchController.getGoalsByMatchNo)

module.exports = router