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


exports.updateMatch = asyncHandler(async (req, res) => {
    const match_id = req.params.match_id;
    const {teama_id, teamb_id , match_date, start_time, end_time, captaina_id, captainb_id, venue_id, tournament_id} = req.body;

    // Validate required fields
    if (!teama_id|| !teamb_id || !match_date|| !start_time || !end_time || !captaina_id || !captainb_id || !venue_id) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields'
        });
    }

    try {
        const result = await db.query(
            `UPDATE matches 
             SET teama_id = $1, teamb_id = $2, match_date = $3, start_time = $4, end_time = $5, captaina_id = $6, captainb_id = $7, venue_id = $8
             WHERE match_id = $9
             RETURNING *`,
            [teama_id, teamb_id , match_date, start_time, end_time, captaina_id, captainb_id, venue_id, match_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Match with ID ${match_id} not found`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Match updated successfully',
            data: result.rows
        });

    } catch (error) {
        console.error('Error updating match:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating match',
            error: error.message
        });
    }
});

exports.updateMatchDetails = asyncHandler(async (req, res) => {
    const { match_id } = req.params;
    const { scoreA, scoreB, winner_team_id, match_completed } = req.body;

    // Validate input
    // if (scoreA === undefined || scoreB === undefined) {
    //     return res.status(400).json({
    //         success: false,
    //         error: 'Both scores are required'
    //     });
    // }

    // if (isNaN(scoreA) || isNaN(scoreB)) {
    //     return res.status(400).json({
    //         success: false,
    //         error: 'Scores must be numbers'
    //     });
    // }

    // if (match_completed && winner_team_id === undefined) {
    //     return res.status(400).json({
    //         success: false,
    //         error: 'Winner must be specified when completing a match'
    //     });
    // }

    const client = await db.connect();

    try {
        await client.query('BEGIN');

        // // 1. Verify the match exists
        // const matchQuery = await client.query(
        //     'SELECT teama_id, teamb_id FROM matches WHERE match_id = $1',
        //     [match_id]
        // );

        // if (matchQuery.rows.length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         error: 'Match not found'
        //     });
        // }

        // const { teama_id, teamb_id } = matchQuery.rows[0];

        // // 2. Validate winner is one of the teams (or null for draw)
        // if (winner_team_id && ![teama_id, teamb_id].includes(winner_team_id)) {
        //     return res.status(400).json({
        //         success: false,
        //         error: 'Winner must be one of the participating teams'
        //     });
        // }

        // 3. Update match details
        await client.query(
            `UPDATE matches 
             SET scorea = $1, 
                 scoreb = $2, 
                 winner_team_id = $3, 
                 match_completed = $4
             WHERE match_id = $5`,
            [scoreA, scoreB, winner_team_id, match_completed, match_id]
        );

        await client.query('COMMIT');

        res.status(200).json({
            success: true,
            message: 'Match details updated successfully',
            data: {
                match_id,
                scoreA,
                scoreB,
                winner_team_id,
                match_completed
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating match details:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update match details',
            details: error.message
        });
    } finally {
        client.release();
    }
});