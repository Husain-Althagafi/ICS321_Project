const asyncHandler = require('../middleware/asyncHandler')
const db = require('../config/db')

exports.getAllTeams = asyncHandler(async (req, res) => {
    try {
      // Query to get all teams with their basic information
      const teams = await db.query(`
        SELECT 
          *
        FROM teams
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
      team_id
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