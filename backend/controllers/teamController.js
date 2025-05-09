const asyncHandler = require('../middleware/asyncHandler')
const db = require('../config/db')

exports.getAllTeams = asyncHandler(async (req, res) => {
    try {
      // Query to get all teams with their basic information
      const teams = await db.query(`
        SELECT 
          *
        FROM teams
        ORDER BY team_id ASC

      `);
  
      if (!teams || teams.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: 'No teams found'
        });
      }
  
      res.status(200).json({
        success: true,
        data: teams.rows
      });
  
    } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching teams'
      });
    }
  });


exports.getTeamById = asyncHandler (async(req, res) => {
    const id = req.params.id
    const result = await db.query(`
      SELECT *
      FROM teams
      WHERE team_id = $1
    `,[id])

    team = result.rows[0]
    if (team.length != 0) {
      return res.status(200).json({
        data: team
      })
    }

    return res.status(400).json({
      error: "No team with this id"
    })
    
})


exports.getPlayersByTeamId = asyncHandler(async (req, res) => {
  const teamId = req.params.id;

  const result = await db.query(`
    SELECT 
      team_id,
      player_id,
      player_name,
      jersey_number,
      position,
      is_substitute
    FROM players
    WHERE team_id = $1
    ORDER BY 
      is_substitute ASC,  -- Starters first (assuming is_substitute=false means starter)
      jersey_number ASC   -- Then ordered by jersey number
  `, [teamId]);

  return res.status(200).json({
    data: result.rows
  });
});


exports.getTeamsByMatch = asyncHandler(async (req, res) => {
  const match_no = req.params.match_no

  const query = `
    SELECT 
      t.team_id,
      t.team_name,
      p_captain.name AS captain_name,
      p_gk.name AS goalkeeper_name,
      md.win_lose,
      md.goal_score,
      md.penalty_score,
      tt.tr_id,
      tt.team_group,
      tt.points
    FROM match_details md
    JOIN TEAM t ON md.team_id = t.team_id
    LEFT JOIN MATCH_CAPTAIN mc ON mc.match_no = md.match_no AND mc.team_id = t.team_id
    LEFT JOIN PLAYER captain ON captain.player_id = mc.player_captain
    LEFT JOIN PERSON p_captain ON p_captain.kfupm_id = captain.player_id
    LEFT JOIN PLAYER gk ON gk.player_id = md.player_gk
    LEFT JOIN PERSON p_gk ON p_gk.kfupm_id = gk.player_id
    LEFT JOIN TOURNAMENT_TEAM tt ON tt.team_id = t.team_id
    WHERE md.match_no = $1

  `;

  const { rows } = await db.query(query, [match_no]);

  res.status(200).json({ success: true, data: rows });

})


exports.updateTeam = asyncHandler(async (req, res) => {
  const teamId = req.params.id;
  const { team_name, coach_name, manager_name } = req.body;

  if (!team_name || !coach_name || !manager_name) {
    return res.status(400).json({ 
      error: "All fields are required" 
    });
  }

  try {
    const result = await db.query(
      `UPDATE teams 
       SET team_name = $1, coach_name = $2, manager_name = $3 
       WHERE team_id = $4 
       RETURNING *`,
      [team_name, coach_name, manager_name, teamId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    return res.status(200).json({ 
      message: "Team updated successfully",
      data: result.rows[0] 
    });

  } catch (error) {
    return res.status(400).json({error: 'Error updating team'})
  }
});


exports.addPlayer = asyncHandler(async (req, res) => {
  const {player_id, player_name, jersey_number, position, is_substitute = false, team_id} = req.body
    

  if (!player_id || !player_name || !jersey_number || !position || !team_id) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
      fields: {player_id, player_name, jersey_number, position, is_substitute, team_id}
    });
  }

  try {
    const jerseyCheck = await db.query(
      `SELECT * FROM players 
       WHERE team_id = $1 AND jersey_number = $2`,
      [team_id, jersey_number]
    );

    if (jerseyCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Jersey number already exists for this team"
      });
    }

    const result = await db.query(
      `INSERT INTO players (
        player_id,
        player_name,
        jersey_number,
        position,
        is_substitute,
        team_id
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [player_id, player_name, jersey_number, position, is_substitute, team_id]
    );

    res.status(200).json({
      success: true,
      message: "Player added successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error adding player:', error);
    
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: "Player already exists"
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error while adding player"
    });
  }
});


exports.updatePlayer = asyncHandler(async (req, res) => {
  const player_id = req.params.player_id;
  const { player_name, jersey_number, position, is_substitute = false } = req.body;

  // Validate required fields
  if (!player_name || !jersey_number || !position) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields (player_name, jersey_number, position)"
    });
  }

  try {
    // Check if player exists
    const playerExists = await db.query(
      `SELECT 1 FROM players WHERE player_id = $1`,
      [player_id]
    );
    
    if (playerExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Player not found"
      });
    }

    // Check if jersey number is already taken by another player on the same team
    const jerseyCheck = await db.query(
      `SELECT 1 FROM players 
       WHERE jersey_number = $1 
       AND team_id = (SELECT team_id FROM players WHERE player_id = $2)
       AND player_id != $2`,
      [jersey_number, player_id]
    );

    if (jerseyCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: "Jersey number already exists for another player on this team"
      });
    }

    // Corrected SQL query
    const query = `
      UPDATE players
      SET 
        player_name = $1,
        jersey_number = $2,
        position = $3,
        is_substitute = $4
      WHERE player_id = $5
      RETURNING *
    `;

    const result = await db.query(query, [
      player_name, 
      jersey_number, 
      position, 
      is_substitute, 
      player_id
    ]);

    res.status(200).json({
      success: true,
      message: "Player updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Update player error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update player"
    });
  }
});

exports.deletePlayer = asyncHandler(async (req, res) => {
  const player_id = req.params.player_id;

  if (!player_id) {
    return res.status(400).json({
      success: false,
      error: "Player ID is required"
    });
  }

  try {
    const result = await db.query(
      `DELETE FROM players WHERE player_id = $1 RETURNING *`,
      [player_id]
    );

    res.status(200).json({
      success: true,
      message: "Player deleted successfully",
      data: result.rows
    });

  } catch (error) {
    console.error("Error deleting player:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete player"
    });
  }
});