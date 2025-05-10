const asyncHandler = require('../middleware/asyncHandler')
const db = require('../config/db')

// exports.getGoalsByMatchNo = asyncHandler(async (req, res) => {
//   const matchNo = req.params.match_no;

//   const query = `
//     SELECT 
//       gd.goal_id,
//       gd.match_no,
//       gd.goal_time,
//       gd.goal_type,
//       gd.play_stage,
//       gd.goal_schedule,
//       gd.goal_half,
//       p.name AS player_name,
//       t.team_name
//     FROM goal_details gd
//     JOIN player pl ON gd.player_id = pl.player_id
//     JOIN person p ON pl.player_id = p.kfupm_id
//     JOIN team t ON gd.team_id = t.team_id
//     WHERE gd.match_no = $1
//     ORDER BY gd.goal_time ASC
//   `;

//   try {
//     const result = await db.query(query, [matchNo]);
//     res.status(200).json({
//       success: true,
//       data: result.rows,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: 'Server error' });
//   }
// });


// exports.getCaptainsByMatchId = asyncHandler(async (req, res) => {
//   const matchNo = req.params.match_no; // Extract match_no from the request parameters

//   // Query the match_captain table to get captains of both teams for the specified match
//   const captainsQuery = `
//     SELECT 
//     mc.match_no,
//     t1.team_name AS team1,
//     t2.team_name AS team2,
//     p1.name AS captain_team1,
//     p2.name AS captain_team2,
//     p1.kfupm_id AS player1_id,
//     p2.kfupm_id AS player2_id,
//     p1.date_of_birth AS captain_dob_team1,
//     p2.date_of_birth AS captain_dob_team2,
//     pp1.position_desc AS captain_position_team1,
//     pp2.position_desc AS captain_position_team2
// FROM 
//     match_captain mc
// JOIN 
//     team t1 ON mc.team_id = t1.team_id
// JOIN 
//     team t2 ON mc.team_id = t2.team_id
// JOIN 
//     player pl1 ON mc.player_captain = pl1.player_id
// JOIN 
//     player pl2 ON mc.player_captain = pl2.player_id
// JOIN 
//     person p1 ON pl1.player_id = p1.kfupm_id
// JOIN 
//     person p2 ON pl2.player_id = p2.kfupm_id
// JOIN 
//     playing_position pp1 ON pl1.position_to_play = pp1.position_id
// JOIN 
//     playing_position pp2 ON pl2.position_to_play = pp2.position_id
// WHERE 
//     mc.match_no = $1;

//   `;

//   try {
//     const result = await db.query(captainsQuery, [matchNo]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'No captains found for this match.' });
//     }

//     res.status(200).json({
//       match_no: matchNo,
//       captains: result.rows
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error. Please try again later.' +err });
//   }
// });


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