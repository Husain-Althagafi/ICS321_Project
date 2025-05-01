const db = require('../config/db')
const jwt = require('jsonwebtoken')
const asyncHandler = require('../middleware/asyncHandler')

exports.login = asyncHandler( async (req, res) => {
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