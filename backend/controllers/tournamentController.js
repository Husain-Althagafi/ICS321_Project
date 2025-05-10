const asyncHandler = require('../middleware/asyncHandler')
const db = require('../config/db')


exports.getTournaments = asyncHandler(async (req, res) => {
    const result = await db.query('SELECT * FROM tournaments')
    console.log(result)
    res.status(200).json({ success: true, data: result.rows });

})

exports.getTournamentById = asyncHandler(async(req, res) => {
    const result = await db.query(`
            SELECT * FROM tournaments WHERE tournament_id = $1
        `, [req.params.id])
    return res.status(200).json({data: result.rows})
})


exports.getPlayersByTournamentId = asyncHandler(async (req, res) => {
    const result = await db.query(`
        SELECT 
            p.player_id,
            p.player_name,
            p.jersey_number,
            p.position,
            p.is_substitute,
            p.team_id,
            t.team_name,
            t.coach_name,
            t.manager_name
        FROM players p
        JOIN teams t ON p.team_id = t.team_id
        JOIN tournament_teams tt ON t.team_id = tt.team_id
        WHERE tt.tournament_id = $1
        ORDER BY t.team_name, p.jersey_number
    `, [req.params.id]);
    
    return res.status(200).json({ data: result.rows });
});

exports.getMatchesByTournamentId = asyncHandler(async (req, res) => {
    const tournamentId = req.params.id; // Assuming the ID comes from route params
    
    const result = await db.query(`
        SELECT * 
        FROM matches
        WHERE tournament_id = $1
        
    `, [tournamentId]);

    res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows
    });
});


exports.updateTournamentById = asyncHandler(async (req, res) => {
    const tournamentId = req.params.id;
    const { tr_name, start_date, end_date } = req.body;

    // Validate required fields
    if (!tr_name || !start_date || !end_date) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields (tr_name, start_date, end_date)'
        });
    }

    // Validate date format and logic (end_date should be after start_date)
    if (new Date(end_date) <= new Date(start_date)) {
        return res.status(400).json({
            success: false,
            message: 'End date must be after start date'
        });
    }

    try {
        const result = await db.query(
            `UPDATE tournament 
             SET tr_name = $1, start_date = $2, end_date = $3 
             WHERE tr_id = $4 
             RETURNING *`,
            [tr_name, start_date, end_date, tournamentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Tournament with ID ${tournamentId} not found`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Tournament updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error updating tournament:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating tournament',
            error: error.message
        });
    }
});
exports.getTeamsByTournamentId = asyncHandler(async (req, res) => {
    const tournamentId = req.params.id;

    // Validate tournament ID
    if (!tournamentId || isNaN(tournamentId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid tournament ID'
        });
    }

    try {
        // Query to get all teams for the tournament with their group and stats
        const result = await db.query(`
            SELECT 
                *
            FROM 
                tournament_teams tt
            JOIN 
                teams t ON tt.team_id = t.team_id
            WHERE 
                tt.tournament_id = $1
        `, [tournamentId]);

        // if (result.rows.length === 0) {
        //     return res.status(200).json({
        //         success: false,
        //         message: `No teams found for tournament with ID ${tournamentId}`,
        //         data: {}
        //     });
        // }

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: {
                teams: result.rows[0],
            }
        });

    } catch (error) {
        console.error('Error fetching teams by tournament:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching tournament teams',
            error: error.message
        });
    }
});


