const asyncHandler = require('../middleware/asyncHandler')
const db = require('../config/db')

exports.getAllTeams = asyncHandler(async (req, res) => {
    try {
      // Query to get all teams with their basic information
      const teams = await db.query(`
        SELECT 
          t.team_id,
          t.team_name,
          COUNT(tp.player_id) AS player_count,
          COUNT(ts.support_id) AS staff_count
        FROM team t
        LEFT JOIN TEAM_PLAYER tp ON t.team_id = tp.team_id
        LEFT JOIN TEAM_SUPPORT ts ON t.team_id = ts.team_id
        GROUP BY t.team_id, t.team_name
        ORDER BY t.team_name
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
        data: teams
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
        SELECT * FROM team WHERE team_id = $1
    `[id])

    team = result.rows
    if (team.length != 0) {
      return res.status(200).json({
        data: team
      })
    }
    
})