const asyncHandler = require('../middleware/asyncHandler')
const db = require('../config/db')


exports.getTournaments = asyncHandler(async (req, res) => {
    const result = await db.query('SELECT * FROM tournament')
    console.log(result)
    res.status(200).json({ success: true, data: result.rows });

})