const asyncHandler = require('../middleware/asyncHandler')
const db = require('../config/db')

exports.getGoalsByMatchNo = asyncHandler(async (req, res) => {
  const match_id = req.params.match_id;

  const query = `
    SELECT * 
    FROM GOAL_EVENTS
    WHERE match_id = $1
  `;

  try {
    const result = await db.query(query, [match_id]);
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


exports.getCaptainsByMatchId = asyncHandler(async (req, res) => {
  const match_id = req.params.match_id; 

  const captainsQuery = `
      SELECT captaina_id, captainb_id
      FROM MATCHES
      where match_id = $1
  `;

  try {
    const result = await db.query(captainsQuery, [match_id]);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No captains found for this match.' , data: []});
    }

    res.status(200).json({
      data: {
        match_no: match_id,
        captains: result.rows
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again later.' +err });
  }
});


exports.getAllMatches = asyncHandler(async(req, res) => {
  const result = await db.query(
    `
    SELECT * from matches
    
    `
  )

  return res.status(200).json({
    data: result.rows
  })
})


exports.addGoalToMatch = asyncHandler(async (req, res) => {
  const { matchId } = req.params;
  const { playerId, minute } = req.body;

  // Validate input
  if (!playerId || !minute) {
    return res.status(400).json({
      success: false,
      error: 'Player ID and minute are required'
    });
  }

  if (isNaN(minute) || minute < 0) {
    return res.status(400).json({
      success: false,
      error: 'Minute must be a positive number'
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Verify the match exists and get team information
    const matchQuery = await client.query(
      'SELECT teama_id, teamb_id FROM matches WHERE match_id = $1',
      [matchId]
    );

    if (matchQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Match not found'
      });
    }

    const { teama_id, teamb_id } = matchQuery.rows[0];

    // 2. Verify the player belongs to one of the match teams
    const playerQuery = await client.query(
      'SELECT team_id FROM players WHERE player_id = $1',
      [playerId]
    );

    if (playerQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Player not found'
      });
    }

    const { team_id } = playerQuery.rows[0];

    if (team_id !== teama_id && team_id !== teamb_id) {
      return res.status(400).json({
        success: false,
        error: 'Player is not part of this match'
      });
    }

    // 3. Record the goal event
    await client.query(
      'INSERT INTO goal_events (match_id, player_id, event_time) VALUES ($1, $2, $3)',
      [matchId, playerId, minute]
    );

    // 4. Update the aggregated goal count
    await client.query(`
      INSERT INTO match_goals (match_id, player_id, goal_count)
      VALUES ($1, $2, 1)
      ON CONFLICT (match_id, player_id)
      DO UPDATE SET goal_count = match_goals.goal_count + 1
    `, [matchId, playerId]);

    // 5. Update the match score
    await client.query(`
      UPDATE matches
      SET 
        scorea = CASE WHEN $1 THEN COALESCE(scorea, 0) + 1 ELSE scorea END,
        scoreb = CASE WHEN $2 THEN COALESCE(scoreb, 0) + 1 ELSE scoreb END
      WHERE match_id = $3
    `, [team_id === teama_id, team_id === teamb_id, matchId]);

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Goal recorded successfully'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error recording goal:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record goal',
      details: error.message
    });
  } finally {
    client.release();
  }
});