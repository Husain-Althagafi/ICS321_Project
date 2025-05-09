const asyncHandler = require('../middleware/asyncHandler')
const db = require('../config/db')

// POST /admin/tournaments
exports.addTournament = asyncHandler(async (req, res) => {
  const { name, start_date, num_teams } = req.body;
  if (!name || !start_date || typeof num_teams !== 'number') {
    return res.status(400).json({ error: 'Missing tournament name, start_date, or num_teams' });
  }
  // Calculate end_date: N even → N−1 days, odd → N days
  const rounds = num_teams % 2 === 0 ? num_teams - 1 : num_teams;
  const { rows: [{ end_date }] } = await db.query(
    `SELECT ($1::date + ($2 - 1) * INTERVAL '1 day')::date AS end_date`,
    [start_date, rounds]
  );
  const { rows } = await db.query(
    `INSERT INTO tournaments (name, start_date, end_date, num_teams)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, start_date, end_date, num_teams]
  );
  res.status(201).json({ data: rows[0], message: 'Tournament created' });
});

// DELETE /admin/tournaments/:id
exports.deleteTournament = asyncHandler(async (req, res) => {
  const tournamentId = parseInt(req.params.id, 10);
  await db.query(
    `DELETE FROM tournament_teams WHERE tournament_id = $1`,
    [tournamentId]
  );
  await db.query(
    `DELETE FROM matches WHERE tournament_id = $1`,
    [tournamentId]
  );
  await db.query(
    `DELETE FROM tournaments WHERE tournament_id = $1`,
    [tournamentId]
  );
  res.sendStatus(204);
});


exports.addTeamToTournament = asyncHandler( async (req, res) => {
    const {team_id, tr_id, team_group} = req.body

    if (!team_id || !tr_id || !team_group) {
        return res.status(400).json({error: 'Team info missing'})
    }

    query = `
    INSERT INTO TOURNAMENT_TEAM (team_id, tr_id, team_group, match_played, won, draw, lost, goal_for, goal_against, goal_diff, points, group_position)
    VALUES ($1, $2, $3, 0, 0, 0, 0, 0, 0, 0, 0, 0) RETURNING *;
    `

    try {
        const result = await db.query(query, [team_id, tr_id, team_group])
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
// GET /admin/tournaments
exports.getTournaments = asyncHandler(async (req, res) => {
  const { rows } = await db.query(`
    SELECT
      tournament_id AS id,
      name,
      TO_CHAR(start_date, 'DD/MM/YYYY') AS startDate,
      TO_CHAR(end_date,   'DD/MM/YYYY') AS endDate,
      num_teams  AS numTeams,
      last_match_no AS lastMatchNumber
    FROM tournaments
    ORDER BY tournament_id
  `);
  res.json(rows);
});