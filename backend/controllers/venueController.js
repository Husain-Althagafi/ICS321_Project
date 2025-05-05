const asyncHandler = require('../middleware/asyncHandler')
const db = require('../config/db')


exports.getAllVenues = asyncHandler(async(req, res) => {
    const result = await db.query('SELECT * FROM venue')

    res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows
    });
})