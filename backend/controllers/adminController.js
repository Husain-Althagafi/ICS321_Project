const asyncHandler = require('../middleware/asyncHandler')
const pool = require('../config/db')

exports.addTournament = asyncHandler( async (req, res) => {
    const {tr_id, tr_name, start_date, end_date} = req.body

    if (!tr_id, !tr_name || !start_date || !end_date) {
        return res.status(400).json({error: 'Tournament info missing'})
    }

    const query = `
    INSERT INTO tournament (tr_id, tr_name, start_date, end_date)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `
    try {
        const result = await pool.query(query, [tr_id, tr_name, start_date, end_date])
        return res.status(200).json({data: result.rows[0]})
    }
    
    catch (err) {
        return res.status(500).json({error: 'Error adding tournament:'+ err})
    }

})


exports.addTeamToTournament = asyncHandler( async (req, res) => {
    const {team_id, tr_id, team_group} = req.body

    if (!team_id || !tr_id, !team_group) {
        return res.status(400).json({error: 'Team info missing'})
    }

    query = `
    INSERT INTO TOURNAMENT_TEAM (team_id, tr_id, team_group, match_played, won, draw, lost, goal_for, goal_against, goal_diff, points, group_position)
    VALUES ($1, $2, $3, 0, 0, 0, 0, 0, 0, 0, 0, 0) RETURNING *;
    `

    try {
        const result = await pool.query(query, [team_id, tr_id, team_group])
        return res.status(200).json({data: result.rows[0]})
    }

    catch (err) {
        return res.status(500).json({error: "Error adding team to tournament:", err})
    }
})


exports.selectCaptain = asyncHandler ( async (req, res) => {
    const tr_id = req.params.tournament
    const match_id = req.params.match
    const team_id = req.params.team
    const player_id = req.body


    if (!player_id || !team_id || !tr_id || !match_id) {
        return res.status(400).json({error: 'Required values missing'})
    }

    const captain = await pool.query(
        `select * from team_players where player_id = $1 and team_id = $2 and tr_id = $3`,
        [player_id, team_id, tr_id]
    )

    if (!captain) {
        return res.status(404).json({error: 'Player not part of the team for the specified tournament'})
    }

    await pool.query(
        `update match_captain set player_captain = $1 where team_id = $2 and match_no = $3`,
        [player_id, team_id, match_id]
    )

    return res.status(201).json({message: 'Successfully set captain'}) 
})


exports.approvePlayerToTeam = asyncHandler (async (req, res) => {

    const player_id = req.params.player
    const team_id = req.params.team
    const tr_id = req.params.tournament

    if (!player_id || !team_id) {
        return res.status(400).json({error: 'Required values missing'})
    }

    const player = await pool.query(
        `select * from player where player_id = $1`,
        [player_id]
    )

    if (!player) {
        return res.status(400).json({error: 'Player doesnt exist'})
    }

    const team = await pool.query(
        `select * from team where team_id = $1`,
        [team_id]
    )

    if (!team) {
        return res.status(400).json({error: 'Team doesnt exist'})
    }

    const tournament = await pool.query(
        `select * from tournament where tr_id = $1`,
        [tr_id]
    )

    if (!tournament) {
        return res.status(400).json({error: 'Tournament doesnt exist'})
    }
 


})