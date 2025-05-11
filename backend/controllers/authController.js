const db = require('../config/db')
const jwt = require('jsonwebtoken')
const asyncHandler = require('../middleware/asyncHandler')
// const bcrypt = require('bcrypt')         might not used hash passwords for ease, will see

exports.loginAdmin = asyncHandler(async (req, res) => {
    const adminId = req.params.admin_id;

    if (!adminId) {
        return res.status(400).json({ error: 'Admin ID is required' });
    }

    try {
        const result = await db.query(`
            SELECT * FROM admin WHERE admin_id = $1
        `, [adminId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found',
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0],
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Error fetching admin details',
        });
    }
});

exports.registerAdmin = asyncHandler(async (req, res) => {
    const { admin_id, admin_username, password } = req.body;

    // Validate inputs
    if (!admin_id || !admin_username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Insert the new admin into the admin table
        const result = await db.query(`
            INSERT INTO admin (admin_id, admin_username, admin_password) 
            VALUES ($1, $2, $3) 
            RETURNING *;
        `, [admin_id, admin_username, password]);

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: result.rows[0], // Returning the newly inserted admin
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Error creating admin',
        });
    }
});

exports.loginGuest = asyncHandler(async (req, res) => {
    const guest_id = req.params.guest_id;

    // Validate inputs
    if (!guest_id || !guest_password) {
        return res.status(400).json({ error: 'First name, last name, and password are required' });
    }

    try {
        // Fetch the guest from the guest table based on id
        const result = await db.query(`
            SELECT * FROM guest WHERE guest_id = $1
        `, [guest_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Guest not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Guest logged in successfully',
            data: result.rows[0], // Returning the guest details
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Error logging in guest',
        });
    }
});

exports.registerGuest = asyncHandler(async (req, res) => {
    const { guest_id, guest_firstname, guest_lastname, guest_password } = req.body;

    // Validate inputs
    if (!guest_id || !guest_firstname || !guest_lastname || !guest_password) {
        return res.status(400).json({ error: 'Guest ID, first name, last name, and password are required' });
    }

    try {
        // Insert the new guest into the guest table
        const result = await db.query(`
            INSERT INTO guest (guest_id, guest_firstname, guest_lastname, guest_password) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *;
        `, [guest_id, guest_firstname, guest_lastname, guest_password]);

        res.status(201).json({
            success: true,
            message: 'Guest registered successfully',
            data: result.rows[0], // Returning the newly inserted guest
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Error registering guest',
        });
    }
});
