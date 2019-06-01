'use strict'

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const https = require('https')
const config = require('../../config')
const db = require('../../db')
const logger = require('../../logger')
const Breaker = require('../utils/breaker')
const bot = require('./telegram-bot')

const register = (req, res) => {
    if (!req.body.username)
        return res.status(400).send({
            status: 'error',
            message: 'Username is not provided.'
        })
    if (!req.body.password)
        return res.status(400).send({
            status: 'error',
            message: 'Password is not provided.'
        })
    
    const hashedPassword = bcrypt.hashSync(req.body.password, 8)
    const username = req.body.username

    db.any(`select * from "Users" where "Username" = $1`, username)
        .then(rows => {
            if (rows.length) {
                res.status(400).send({
                    status: 'error',
                    message: 'The username was already used.'
                })
                throw new Breaker('Username exists')
            }

            return db.one(`insert into "Users" ("Username", "Password")
                values ($1, $2) returning "UserId"`, [username, hashedPassword]
            )
        })
        .then(({ UserId }) => {
            // Create a token
            const token = jwt.sign({ UserId }, config.jwtSecret, {
                expiresIn: '24h' // expires in 24 hours
            })

            res.send({ status: 'success', token })
        })
        .catch(err => {
            if (err.name === 'Breaker') return

            logger.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Internal server error.'
            })
        })
}

const login = (req, res) => {
    if (!req.body.username)
        return res.status(400).send({
            status: 'error',
            message: 'Username is not provided.'
        })
    if (!req.body.password)
        return res.status(400).send({
            status: 'error',
            message: 'Password is not provided.'
        })

    const username = req.body.username

    db.any(`select * from "Users" where "Username" = $1`,
        [username])
        .then(rows => {
            const row = rows[0]
            if (!row)
                return res.status(400).send({
                    status: 'error',
                    message:
                        'No user with such username & password combination.'
                })

            bcrypt.compare(req.body.password, row.Password)
                .then(function (areMatch) {
                    if (!areMatch)
                        return res.status(400).send({
                            status: 'error',
                            message: 'No user with such username \
                                & password combination.'
                        })
                    // Create a token
                    const token = jwt.sign(
                        { UserId: row.UserId },
                        config.jwtSecret,
                        { expiresIn: '24h' } // expires in 24 hours
                    )
                    // Set bot's user token
                    bot.userToken = token
                    if (bot.chatId) {
                        const sendSuccessUrl = 'https://api.telegram.org/bot' +
                            config.telegramApiToken + '/sendmessage?text=You%' +
                            '27ve+successfully+logged+in&chat_id=' + bot.chatId
                        https.get(sendSuccessUrl, () => {})
                    }

                    res.send({ status: 'success', token })
                })
        }, err => {
            logger.error(err)
            res.status(500).send({
                status: 'error',
                message: `Error with the database.`
            })
        })
}


module.exports = {
    register,
    login,
}
