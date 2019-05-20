'use strict'

const config = require('../../config')

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
            message:'Failed to authenticate token.'
        })
}

const checkUserId = (req, res, next) => {
    const userId = req.headers['user-id']
    if (!userId) return res.status(401).send({
        auth: false,
        message: 'No user id provided.'
    })

    next()
}

module.exports = {
    checkApiKey,
    checkUserId
}
