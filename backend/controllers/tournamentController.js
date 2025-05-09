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
            per.name,
            per.date_of_birth,
            p.jersey_no,
            p.position_to_play,
            pos.position_desc,
            tp.team_id,
            t.team_name,
            tp.tr_id
        FROM player p
        JOIN person per ON p.player_id = per.kfupm_id
        JOIN team_player tp ON p.player_id = tp.player_id
        JOIN team t ON tp.team_id = t.team_id
        JOIN playing_position pos ON p.position_to_play = pos.position_id
        WHERE tp.tr_id = $1
        `, [req.params.id])
        return res.status(200).json({data: result.rows})
})

exports.getMatchesByTournamentId = asyncHandler(async (req, res) => {
    const tournamentId = req.params.id; // Assuming the ID comes from route params
    
    const result = await db.query(`
        SELECT 
            mp.match_no,
            mp.play_date,
            mp.start_time,
            mp.end_time,
            t1.team_name AS team1,
            t2.team_name AS team2,
            mp.goal_score,
            mp.results,
            v.venue_name,
            tr.tr_name AS tournament_name,
            mp.completed
        FROM 
            match_played mp
        JOIN 
            team t1 ON mp.team_id1 = t1.team_id
        JOIN 
            team t2 ON mp.team_id2 = t2.team_id
        JOIN 
            venue v ON mp.venue_id = v.venue_id
        JOIN 
            tournament_team tt1 ON t1.team_id = tt1.team_id
        JOIN 
            tournament_team tt2 ON t2.team_id = tt2.team_id
        JOIN 
            tournament tr ON tt1.tr_id = tr.tr_id
        WHERE 
            tt1.tr_id = $1
            AND tt2.tr_id = $1
        ORDER BY 
            mp.play_date;
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
                t.team_id,
                t.team_name,
                tt.team_group,
                tt.match_played,
                tt.won,
                tt.draw,
                tt.lost,
                tt.goal_for,
                tt.goal_against,
                tt.goal_diff,
                tt.points,
                tt.group_position
            FROM 
                tournament_team tt
            JOIN 
                team t ON tt.team_id = t.team_id
            WHERE 
                tt.tr_id = $1
            ORDER BY 
                tt.team_group, tt.group_position
        `, [tournamentId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No teams found for tournament with ID ${tournamentId}`
            });
        }

        // Group teams by their group for better organization
        const teamsByGroup = result.rows.reduce((acc, team) => {
            if (!acc[team.team_group]) {
                acc[team.team_group] = [];
            }
            acc[team.team_group].push(team);
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: {
                teams: result.rows,
                grouped: teamsByGroup
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


