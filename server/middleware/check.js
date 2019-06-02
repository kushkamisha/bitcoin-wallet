'use strict'

const jwt = require('jsonwebtoken')
const config = require('../../config')
const bot = require('../controllers/telegram-bot')
const logger = require('../../logger')

const checkToken = (req, res, next) => {
    const token = req.headers['x-access-token']
    if (!token) return res.status(401).send({
        auth: false,
        message: 'No token provided.'
    })

    jwt.verify(token, config.jwtSecret, function (err, decoded) {
        if (err) return res.status(500).send({
            auth: false, message:
                'Failed to authenticate token.'
        })

        req.locals = {}
        req.locals.UserId = decoded.UserId
        req.locals.token = { iat: decoded.iat, exp: decoded.exp }
        next()
    })
}

const checkApiKey = (req, res, next) => {
    const key = req.headers['x-api-key']
    if (!key) return res.status(401).send({
        auth: false,
        message: 'No API key provided.'
    })

    if (key === config.apiKey)
        next()
    else
        return res.status(500).send({
            auth: false,
            message: 'Failed to authenticate the API key.'
        })
}

const setUserIdFromBot = (req, res, next) => {
    const defaultUserId = '7'

    if (bot && bot.userToken) {
        jwt.verify(bot.userToken, config.jwtSecret, (err, decoded) => {
            if (err) {
                logger.error(err)
                req.locals.UserId = defaultUserId
                next()
            }

            if (!req.locals)
                req.locals = {}
            req.locals.UserId = decoded.UserId
        })
    }
    next()
}

module.exports = {
    checkToken,
    checkApiKey,
    setUserIdFromBot
}
