const asyncHandler = require('../middleware/asyncHandler')
const db = require('../config/db')


exports.getAllVenues = asyncHandler(async(req, res) => {
    const result = await db.query('SELECT * FROM venues')

    res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows
    });
})

exports.addNewVenue = asyncHandler(async(req, res) => {
    const {venue_capacity, venue_name} = req.body

    if (!venue_name || !venue_capacity) {
        return res.status(400).json({error: 'Missing values'})
    }

    try {
        const result = await db.query(`
            INSERT INTO venues
            (venue_name, venue_capacity)
            VALUES ($1, $2)
            RETURNING *
            `, [venue_name, venue_capacity])


        return res.status(200).json({
            success: true,
            data: result.rows
        })
    }

    catch (err) {
        return res.status(400).json({error: err+ "error adding new venue"})
    }
    
})