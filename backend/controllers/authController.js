const db = require('../config/db')
const jwt = require('jsonwebtoken')
const asyncHandler = require('../middleware/asyncHandler')

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
        {id : 'admin'},
        'admin',
        {expiresIn: '1h'}
    )

    return res.status(200).json({token})


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
    const guest = await db.query(query, [username]).rows[0]

    if (guest.password === password) {
        //TODO: implement login

        return res.status(200).json({message: 'Login successful'})
    }

    return res.status(400).json({error: 'Invalid credentials'})
})