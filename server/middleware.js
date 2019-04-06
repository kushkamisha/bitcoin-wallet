'use strict'

const jwt = require('jsonwebtoken')
const config = require('../config')

const checkToken = (req, res, next) => {
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' })

    jwt.verify(token, config.jwtSecret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' })

        req.locals = {}
        req.locals.UserId = decoded.UserId
        req.locals.token = { iat: decoded.iat, exp: decoded.exp }
        next()
    })
}

const bitcoinCliQuery = (req, res, next) => {
    switch(req.url) {
        case config.walletUrl.createAddress:
            req.locals.bitcoinCliQuery = `{ "id": "getnewaddress", "method": "getnewaddress", "params": ["${req.locals.UserId}", "legacy"] }`
            break
        case config.walletUrl.getBalance:
            req.locals.bitcoinCliQuery = `{ "id": "listunspent", "method": "listunspent", "params": [] }`
            break
    }
    next()
}

module.exports = {
    checkToken,
    bitcoinCliQuery,
}
