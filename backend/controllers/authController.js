const db = require('../config/db')
const jwt = require('jsonwebtoken')
const asyncHandler = require('../middleware/asyncHandler')
// const bcrypt = require('bcrypt')         might not used hash passwords for ease, will see

exports.loginAdmin = asyncHandler( async (req, res) => {
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).json({error: 'Username and/or password are missing'})
    }

    if (username !== 'admin') {
        return res.status(400).json({error: 'Incorrect username'})
    }

    if (password !== 'admin') {
        return res.status(400).json({error: 'Incorrect password'})
    }

    const token = jwt.sign(
        {id : 'admin', role: 'admin'},
        'admin',
        {expiresIn: '1h'}
    )

    return res.status(200).json({
        token: token,
        message: 'Admin logged in successfully'
    })


})


exports.registerGuest = asyncHandler (async (req, res) => {
    //TODO: implement registration logic
    
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).json({error: 'Username and/or password are missing'})
    }

    query = `
        select * from guests where username = $1
    `

    const result = await db.query(query, [username])
    const guestExists = result.rows[0]

    if (guestExists) {
        return res.status(400).json({error: 'Username already exists'})
    }

    query = `
        INSERT INTO guests (username, password) VALUES ($1, $2) RETURNING *
    `

    const resultGuest = await db.query(query, [username, password])
    const guest = resultGuest.rows[0]

    if (!guest) {
        return res.status(400).json({error: 'Guest wasnt added correctly'})
    }

    const token = jwt.sign(
        {id: guest.username, role: 'guest'},
        'SuperSecretKeyLiterallyImpossibleToGuess',
        {expiresIn:'1h'}
    )

    return res.status(200).json({
        token: token,
        message: 'Guest registered successfully'
    })


    
})

//we need to add the tables for guests. they will remain isolated and not tied to any other relations

exports.loginGuest = asyncHandler (async (req, res) => {
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).json({error: 'Username and/or password are missing'})
    }

    query = `
        select * from guests where username = $1
    `

    const result = await db.query(query, [username])
    const guest = result.rows[0]

    if (!guest || guest.password !== password) {
        //TODO: implement login
        return res.status(400).json({error: 'Invalid credentials'})
    }

    const token = jwt.sign(
        {id: guest.username, role: 'guest'},
        'SuperSecretKeyLiterallyImpossibleToGuess',
        {expiresIn:'1h'}
    )
    return res.status(200).json({
        message: 'Guest logged in successfully',
        token: token
    })
})


exports.registerAdmin = asyncHandler (async (req, res) => {
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).json({error: 'Username and/or password are missing'})
    }

    query = `
        select * from admins where username = $1
    `

    const result = await db.query(query, [username])
    const adminExists = result.rows[0]

    if (adminExists) {
        return res.status(400).json({error: 'Username already exists'})
    }

    query = `
        INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING *
    `

    const resultAdmin = await db.query(query, [username, password])
    const admin = resultAdmin.rows[0]

    if (!admin) {
        return res.status(400).json({error: 'Admin wasnt added correctly'})
    }

    const token = jwt.sign(
        {id: admin.username, role: 'admin'},
        'SuperSecretKeyLiterallyImpossibleToGuess',
        {expiresIn:'1h'}
    )

    return res.status(200).json({
        token: token,
        message: 'Guest registered successfully'
    })


})