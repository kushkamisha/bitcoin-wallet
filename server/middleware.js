'use strict'

const jwt = require('jsonwebtoken')
const config = require('../config')
const logger = require('../logger')
const { bitcoinCli } = require('./utils/bitcoin')

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
    switch (req.url) {
        case config.walletUrl.createAddress:
            req.locals.bitcoinCliQuery = `{ "id": "getnewaddress", "method": "getnewaddress", "params": ["${req.locals.UserId}", "legacy"] }`
            break
        case config.walletUrl.getBalance:
            req.locals.bitcoinCliQuery = `{ "id": "listunspent", "method": "listunspent", "params": [] }`
            break
        case config.walletUrl.getTransactions:
            req.locals.bitcoinCliQuery = `{ "id": "listtransactions", "method": "listtransactions", "params": [] }`
    }
    next()
}

const getTxs = (req, res, next) => {
    bitcoinCli(req)
        .then(txs => {
            // Txs without label or with user's label
            const txsWithUserLabel = txs.filter(tx => tx.label === `${req.locals.UserId}`)
            const txsWithoutLabel = txs.filter(tx => tx.label === undefined)

            // Only user's txs
            let userTxs = new Set(txsWithUserLabel.slice())
            txsWithoutLabel.forEach(txWithout => {
                txsWithUserLabel.forEach(txLabel => {
                    if (txWithout.txid === txLabel.txid)
                        userTxs.add(txWithout)
                })
            })
            
            // Remove the same (essentially) txs
            const resultTxs = []
            userTxs = Array.from(userTxs)
            let sameTx = false
            for (let i = 0; i < userTxs.length; i++) {
                for (let j = 0; j < userTxs.length; j++) {
                    if (i === j) continue
                    if (userTxs[i].address === userTxs[j].address &&
                        userTxs[i].txid === userTxs[j].txid &&
                        userTxs[i].amount === -userTxs[j].amount) {
                        sameTx = true
                        break
                    }
                }
                if (!sameTx)
                    resultTxs.push(userTxs[i])
                sameTx = false
            }
            
            req.locals.txs = resultTxs // Array.from(userTxs)
            next()
        }, err => {
            logger.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Internal server error.'
            })
        })
}

module.exports = {
    checkToken,
    bitcoinCliQuery,
    getTxs,
}
