const asyncHandler = require('../middleware/asyncHandler')
const db = require('../config/db')

exports.getGoalsByMatchNo = asyncHandler(async (req, res) => {
  const matchNo = req.params.match_no;

  const query = `
    SELECT 
      gd.goal_id,
      gd.match_no,
      gd.goal_time,
      gd.goal_type,
      gd.play_stage,
      gd.goal_schedule,
      gd.goal_half,
      p.name AS player_name,
      t.team_name
    FROM goal_details gd
    JOIN player pl ON gd.player_id = pl.player_id
    JOIN person p ON pl.player_id = p.kfupm_id
    JOIN team t ON gd.team_id = t.team_id
    WHERE gd.match_no = $1
    ORDER BY gd.goal_time ASC
  `;

  try {
    const result = await db.query(query, [matchNo]);
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});
