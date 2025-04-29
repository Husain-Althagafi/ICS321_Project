
//Imports
const jwt = require('jsonwebtoken')
const asyncHandler = require('./asyncHandler.js')

//auth middleware
const verifyToken = asyncHandler( async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
        return res.status(400).json({error: 'No token authorization denied'})
    }

    jwt.verify(token, 'admin', (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' })
        }
    
        req.user = decoded
        return res.status(200).json({message: 'worked'})
    })
})

module.exports = verifyToken