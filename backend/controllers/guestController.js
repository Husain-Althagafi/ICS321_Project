const asyncHandler = require('../middleware/asyncHandler')
const db = require('../config/db')

// Get all matches of a tournament sorted by date
exports.getAllMatchesForTournament = asyncHandler(async (req, res) => {
    const tr_id = req.params.tournament

    if (!tr_id) {
        return res.status(400).json({ error: 'Tournament ID is required' })
    }

    const query = `
        SELECT mp.match_no, mp.play_date, t1.team_name AS team1, t2.team_name AS team2,
               mp.results, mp.goal_score, v.venue_name
        FROM match_played mp
        JOIN team t1 ON mp.team_id1 = t1.team_id
        JOIN team t2 ON mp.team_id2 = t2.team_id
        JOIN venue v ON mp.venue_id = v.venue_id
        WHERE mp.team_id1 IN (
            SELECT team_id FROM tournament_team WHERE tr_id = $1
        )
        ORDER BY mp.play_date;
    `

    try {
        const result = await db.query(query, [tr_id])
        return res.status(200).json({ data: result.rows })
    } catch (err) {
        return res.status(500).json({ error: 'Error fetching match results: ' + err })
    }
})

// Get the player with the highest goal score across all tournaments
exports.getMostGoals = asyncHandler(async (req, res) => {
    const query = `
        SELECT p.name, gd.player_id, COUNT(*) AS total_goals
        FROM goal_details gd
        JOIN player pl ON gd.player_id = pl.player_id
        JOIN person p ON pl.player_id = p.kfupm_id
        GROUP BY gd.player_id, p.name
        ORDER BY total_goals DESC
        LIMIT 1;
    `

    try {
        const result = await db.query(query)
        return res.status(200).json({ data: result.rows[0] })
    } catch (err) {
        return res.status(500).json({ error: 'Error fetching top scorer: ' + err })
    }
})

// Get players who received red cards for each team
exports.getAllRedCards = asyncHandler(async (req, res) => {
    const query = `
        SELECT t.team_name, p.name AS player_name, pb.match_no
        FROM player_booked pb
        JOIN player pl ON pb.player_id = pl.player_id
        JOIN person p ON pl.player_id = p.kfupm_id
        JOIN team t ON pb.team_id = t.team_id
        WHERE pb.sent_off = 'Y';
    `

    try {
        const result = await db.query(query)
        return res.status(200).json({ data: result.rows })
    } catch (err) {
        return res.status(500).json({ error: 'Error fetching red card players: ' + err })
    }
})

// Get all members of a selected team (players, coach, manager, captain)
exports.getTeamMembers = asyncHandler(async (req, res) => {
    const team_id = req.query.team
    const tr_id = req.query.tournament
    const match_id = req.query.match

    if (!team_id || !tr_id || !match_id) {
        return res.status(400).json({ error: 'Team, tournament, or match ID missing' })
    }

    try {
        const players = await db.query(`
            SELECT 'Player' AS role, pe.name, pl.player_id
            FROM team_player tp
            JOIN player pl ON tp.player_id = pl.player_id
            JOIN person pe ON pl.player_id = pe.kfupm_id
            WHERE tp.team_id = $1 AND tp.tr_id = $2
        `, [team_id, tr_id])

        const support = await db.query(`
            SELECT s.support_desc AS role, pe.name
            FROM team_support ts
            JOIN person pe ON ts.support_id = pe.kfupm_id
            JOIN support s ON ts.support_type = s.support_type
            WHERE ts.team_id = $1 AND ts.tr_id = $2
        `, [team_id, tr_id])

        const captain = await db.query(`
            SELECT 'Captain' AS role, pe.name
            FROM match_captain mc
            JOIN person pe ON mc.player_captain = pe.kfupm_id
            WHERE mc.team_id = $1 AND mc.match_no = $2
        `, [team_id, match_id])

        return res.status(200).json({
            players: players.rows,
            support: support.rows,
            captain: captain.rows[0] || {}
        })
    } catch (err) {
        return res.status(500).json({ error: 'Error fetching team members: ' + err })
    }
})
