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