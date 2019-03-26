'use strict'

const jwt = require('jsonwebtoken')
const config = require('../config')

const checkToken = (req, res, next) => {
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' })

    jwt.verify(token, config.jwtSecret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' })

        res.locals = {}
        res.locals.UserId = decoded.UserId
        res.locals.token = { iat: decoded.iat, exp: decoded.exp }
        next()
    })
}

module.exports = {
    checkToken
}
