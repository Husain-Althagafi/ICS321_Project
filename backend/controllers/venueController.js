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
        return res.status(400).json({error: 'Missing values',
        })
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


exports.deleteVenue = asyncHandler(async (req, res) => {
    const { venue_id } = req.params;

    if (!venue_id) {
        return res.status(400).json({
            success: false,
            error: "Venue ID is required"
        });
    }

    try {

        const result = await db.query(
            `DELETE FROM venues WHERE venue_id = $1 RETURNING *`,
            [venue_id]
        );


        return res.status(200).json({
            success: true,
            message: "Venue deleted successfully",
            data: result.rows
            
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Failed to delete venue",
        });
    }
});


exports.editVenue = asyncHandler(async (req, res) => {
    const { venue_id } = req.params;
    const { venue_name, venue_capacity } = req.body;

    // Validate inputs
    if (!venue_id) {
        return res.status(400).json({
            success: false,
            error: "Venue ID is required"
        });
    }

    if (!venue_name && !venue_capacity) {
        return res.status(400).json({
            success: false,
            error: "At least one field (venue_name or venue_capacity) must be provided for update"
        });
    }

    if (venue_capacity && (isNaN(venue_capacity) || Number(venue_capacity) <= 0)) {
        return res.status(400).json({
            success: false,
            error: "Capacity must be a positive number"
        });
    }

    try {
        

        // Build dynamic update query
        const updateFields = [];
        const queryParams = [];
        let paramIndex = 1;

        if (venue_name) {
            updateFields.push(`venue_name = $${paramIndex}`);
            queryParams.push(venue_name);
            paramIndex++;
        }

        if (venue_capacity) {
            updateFields.push(`venue_capacity = $${paramIndex}`);
            queryParams.push(Number(venue_capacity));
            paramIndex++;
        }

        queryParams.push(venue_id); // For WHERE clause

        const updateQuery = `
            UPDATE venues
            SET ${updateFields.join(', ')}
            WHERE venue_id = $${paramIndex}
            RETURNING venue_id, venue_name, venue_capacity
        `;

        const result = await db.query(updateQuery, queryParams);

        return res.status(200).json({
            success: true,
            message: "Venue updated successfully",
            data: result.rows
        });

    } catch (error) {
        console.error("Error updating venue:", error);    
        return res.status(500).json({
            success: false,
            error: "Failed to update venue",
        });
    }
});