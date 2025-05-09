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
SELECT 
    t.team_id,
    t.team_name,
    coach.kfupm_id AS coach_id,
    coach.name AS coach_name,
    manager.kfupm_id AS manager_id,
    manager.name AS manager_name,
    p.kfupm_id AS player_id,
    p.name AS player_name,
    pl.jersey_no,
    pp.position_desc AS position
    FROM 
        team t
    LEFT JOIN team_support ts_coach ON t.team_id = ts_coach.team_id AND ts_coach.support_type = 'CH'
    LEFT JOIN person coach ON ts_coach.support_id = coach.kfupm_id
    LEFT JOIN team_support ts_manager ON t.team_id = ts_manager.team_id AND ts_manager.support_type = 'MNGR'
    LEFT JOIN person manager ON ts_manager.support_id = manager.kfupm_id
    LEFT JOIN team_player tp ON t.team_id = tp.team_id
    LEFT JOIN person p ON tp.player_id = p.kfupm_id
    LEFT JOIN player pl ON p.kfupm_id = pl.player_id
    LEFT JOIN playing_position pp ON pl.position_to_play = pp.position_id
    WHERE 
        t.team_id = $1
    ORDER BY 
        pl.jersey_no, p.name;    `,[id])

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
            p.player_id,
            per.name,
            per.date_of_birth,
            p.jersey_no,
            p.position_to_play,
            pos.position_desc,
            tp.team_id,
            t.team_name
        FROM player p
        JOIN person per ON p.player_id = per.kfupm_id
        JOIN team_player tp ON p.player_id = tp.player_id
        JOIN team t ON tp.team_id = t.team_id
        JOIN playing_position pos ON p.position_to_play = pos.position_id
        WHERE t.team_id = $1
  `, [teamId]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "No players found for this team" });
  }

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