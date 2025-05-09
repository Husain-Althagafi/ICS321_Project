const asyncHandler = require('../middleware/asyncHandler')
const db = require('../config/db')

exports.addTournament = asyncHandler( async (req, res) => {
    const {name, start_date, end_date, num_teams} = req.body

    if (!name || !start_date || !end_date || !num_teams) {
        return res.status(400).json({error: 'Tournament info missing'})
    }

    const query = `
    INSERT INTO tournaments (name, start_date, end_date, num_teams)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `
    try {
        const result = await db.query(query, [ name, start_date, end_date, num_teams])
        return res.status(200).json({
            data: result.rows[0],
            message: 'Successfully added tournament'
        })
    }
    
    catch (err) {
        return res.status(500).json({error: 'Error adding tournament:'+ err})
    }

})

exports.deleteTournament = asyncHandler(async(req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).json({error: 'Missing id'})
    }

    try {
        const result = await db.query(`
        DELETE FROM tournaments WHERE tournament_id = $1 RETURNING *
        `, [id])
        
        return res.status(200).json({
            message: 'Tournament successfully deleted',
            data: result.rows
        })
    }

    catch (err) {
        return res.status(400).json({error: 'Error deleting tournament: '+err})
    }
    
})


exports.addTeam = asyncHandler(async(req, res) => {
    const {team_name, coach_name, manager_name} = req.body

    if (!team_name || !coach_name || !manager_name) {
        return res.status(400).json({error: 'Missing inputs'})
    }

    try {
        const result = await db.query(`
            INSERT INTO teams (team_name, manager_name, coach_name) VALUES ($1, $2, $3) RETURNING *
            `, [team_name, manager_name, coach_name])


        res.status(200).json({
            data: result.rows[0]
        })
    }
    catch (err) {
        return res.status(400).json({error: 'Error inserting into team database' + err})
    }

})


exports.addTeamToTournament = asyncHandler( async (req, res) => {
    const team_id = req.params.team_id
    const tournament_id = req.params.tournament_id


    if (!team_id || !tournament_id) {
        return res.status(400).json({error: 'Team info missing'})
    }

    query = `
    INSERT INTO tournament_teams (team_id, tournament_id)
    VALUES ($1, $2) RETURNING *;
    `

    try {
        const result = await db.query(query, [team_id, tournament_id])
        return res.status(200).json({
            message: 'Successfully added team to tournament',
            data: result.rows[0]})
    }

    catch (err) {
        return res.status(500).json({error: "Error adding team to tournament:", err})
    }
})


exports.selectCaptain = asyncHandler ( async (req, res) => {
    const tr_id = req.params.tournament
    const match_id = req.params.match
    const team_id = req.params.team
    const {player_id} = req.body


    if (!player_id || !team_id || !tr_id || !match_id) {
        return res.status(400).json({error: 'Required values missing'})
    }

    const captain = await db.query(
        `select * from team_players where player_id = $1 and team_id = $2 and tr_id = $3`,
        [player_id, team_id, tr_id]
    )

    if (!captain) {
        return res.status(404).json({error: 'Player not part of the team for the specified tournament'})
    }

    const result = await db.query(
        `update match_captain set player_captain = $1 where team_id = $2 and match_no = $3 RETURNING *`,
        [player_id, team_id, match_id]
    )

    return res.status(201).json({
        message: 'Successfully set captain',
        data: result.rows[0]
    }) 
})


exports.approvePlayerToTeam = asyncHandler (async (req, res) => {

    const player_id = req.params.player
    const team_id = req.params.team
    const tr_id = req.params.tournament

    if (!player_id || !team_id) {
        return res.status(400).json({error: 'Required values missing'})
    }

    const player = await db.query(
        `select * from player where player_id = $1`,
        [player_id]
    )

    if (!player) {
        return res.status(400).json({error: 'Player doesnt exist'})
    }

    const team = await db.query(
        `select * from team where team_id = $1`,
        [team_id]
    )

    if (!team) {
        return res.status(400).json({error: 'Team doesnt exist'})
    }

    const tournament = await db.query(
        `select * from tournament where tr_id = $1`,
        [tr_id]
    )

    if (!tournament) {
        return res.status(400).json({error: 'Tournament doesnt exist'})
    }

    // verified that player team and tournament exist

    query `
     INSERT INTO team_player VALUES ($1, $2, $3) RETURNING *
    `

    const result = await db.query(query, [player_id, team_id, tr_id])

    if (!result) {
        return res.status(400).json({error: 'Error adding player to team'})
    }

    return res.status(200).json({
        message: 'Successfully added team to tournament',
        data: result.rows[0]
    })
})


exports.deleteTeam = asyncHandler(async(req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).json({error: 'Missing id'})
    }

    try {
        const result = await db.query(`
        DELETE FROM teams WHERE team_id = $1 RETURNING *
        `, [id])
        
        return res.status(200).json({
            message: 'Team successfully deleted',
            data: result.rows
        })
    }

    catch (err) {
        return res.status(400).json({error: 'Error deleting team: '+err})
    }
    
})

exports.removeTeamFromTournament = asyncHandler(async (req, res) => {
    const { tournament_id, team_id } = req.params;

    if (!tournament_id || !team_id) {
        return res.status(400).json({
            success: false,
            error: "Tournament ID and Team ID are required"
        });
    }

    try {
        const result = await db.query(
            `DELETE FROM tournament_teams 
             WHERE tournament_id = $1 AND team_id = $2
             RETURNING *`,
            [tournament_id, team_id]
        );

        res.status(200).json({
            success: true,
            message: "Team successfully removed from tournament",
            data: {
                tournament_id,
                team_id,
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to remove team from tournament",
            details: error.message
        });
    }
});


exports.addMatchesToTournament = asyncHandler(async(req, res) => {
    const {matches} = req.body
    const {tournament_id} = req.params

    if (!matches) {
        return res.status(400).json({error: 'Matches objects needed'})
    }

    const insertedMatches = []

    try {
        for (const match of matches) {
        if (!tournament_id ||!match.match_id || !match.teama_id || !match.teamb_id || !match.match_date) {
            throw new Error(`Missing required fields in match: ${JSON.stringify(match)}`);
        }

        const result = await db.query(
            `INSERT INTO matches (
                match_id,
                tournament_id,
                teama_id,
                teamb_id,
                match_date,
                start_time,
                end_time,
                venue_id,
                match_completed
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                match.match_id,
                tournament_id,
                match.teama_id,
                match.teamb_id,
                match.match_date,
                match.start_time || null,
                match.end_time || null,
                match.venue_id || null,
                match.match_completed || false
            ]
        );

        insertedMatches.push(result.rows[0]);
    }

    await db.query('COMMIT')

    return res.status(200).json({
        success: true,
        message: 'successfully made matches for tournament',
        data: insertedMatches
    })
}

    catch (err) {
        return res.status(500).json({
            error: 'error making matches'+ err,
            generated: matches
        })
    }



})