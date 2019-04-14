'use strict'

const validate = require('bitcoin-address-validation')
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
        case config.walletUrl.sendTransaction:
            req.locals.listTransactions = `{ "id": "listtransactions", "method": "listtransactions", "params": [] }`
            req.locals.getNewAddress = `{ "id": "getnewaddress", "method": "getnewaddress", "params": ["${req.locals.UserId}", "legacy"] }`
            break
        case config.walletUrl.getTransactions:
            req.locals.bitcoinCliQuery = `{ "id": "listtransactions", "method": "listtransactions", "params": [] }`
            req.locals.bitcoinCliQuery2 = `{ "id": "listunspent", "method": "listunspent", "params": [] }`
    }
    next()
}

const findAppropriateTxs = (req, res, next) => {
    bitcoinCli(req, 'listTransactions')
        .then(txs => {
            req.locals.inputs = [{
                txid: 'db95aab1b7013c47977a39e192ae5199232b5689ebfae66f91107ad660981a09',
                vout: 1,
                amount: 1
            }]
            next()
        }, err => {
            if (err instanceof Error) err = err.message
            logger.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Internal server error.'
            })
        })
}

const createAddress = (req, res, next) => {
    bitcoinCli(req, 'getNewAddress')
        .then(address => {
            req.locals.changeAddress = address
            next()
        }, err => {
            if (err instanceof Error) err = err.message
            logger.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Internal server error.'
            })
        })
}

const processUserInput = (req, res, next) => {
    let amount = req.headers.amount
    const address = req.headers.address
    const txs = req.locals.inputs
    const totalAmount = txs.reduce((acc, cur) => acc + cur.amount, 0)
    const fee = 0.00001 // estimatesmartfee <number of blocks>

    if (!amount) return res.status(400).send({ status: 'error', message: 'No amount provided.' })
    if (!address) return res.status(400).send({ status: 'error', message: 'No address provided.' })

    amount = parseFloat(amount)
    if (isNaN(amount)) return res.status(400).send({ status: 'error', message: 'Amount should be a number.' })

    if (!validate(address)) return res.status(400).send({ status: 'error', message: 'Invalid address.' })

    if (amount + fee > totalAmount) return res.status(400).send({ status: 'error', message: 'Not enough funds.' })

    req.locals.data = {
        address,
        amount,
        fee
    }

    next()
}

const createRawTx = (req, res, next) => {
    const amount = req.locals.data.amount
    const address = req.locals.data.address
    const fee = req.locals.data.fee

    const txs = req.locals.inputs
    const totalAmount = txs.reduce((acc, cur) => acc + cur.amount, 0)

    const from = []
    const decimals = 1e18 // 10 ^ (number of decimals in bitcoin)

    const change = (
        parseInt(totalAmount * decimals) - parseInt(amount * decimals) - parseInt(fee * decimals)
    ) / decimals

    for (const tx of txs) {
        from.push({ txid: tx.txid, vout: tx.vout })
    }

    const to = {
        [address]: amount,
        [req.locals.changeAddress]: change
    }

    req.locals.bitcoinCliQuery = JSON.stringify({
        id: 'createrawtransaction',
        method: 'createrawtransaction',
        params: [from, to]
    })

    bitcoinCli(req)
        .then(rawTxHex => {
            req.locals.bitcoinCliQuery = JSON.stringify({
                id: 'signrawtransactionwithwallet',
                method: 'signrawtransactionwithwallet',
                params: [rawTxHex]
            })
            return bitcoinCli(req)
        })
        .then((signedTx) => {
            req.locals.signedTx = signedTx
            next()
        })
        .catch(err => {
            if (err instanceof Error) err = err.message
            logger.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Internal server error.'
            })
        })
}

const listUnspent = (req, res, next) => {
    bitcoinCli(req, 'bitcoinCliQuery2')
        .then(txs => {
            req.locals.unspent = txs.filter(tx => tx.label === `${req.locals.UserId}`)
            next()
        }, err => {
            if (err instanceof Error) err = err.message
            logger.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Internal server error.'
            })
        })
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
                    if (userTxs[i].txid === userTxs[j].txid &&
                        userTxs[i].vout === userTxs[j].vout &&
                        userTxs[i].amount === -userTxs[j].amount &&
                        userTxs[i].amount > 0) {
                        // sameTx = true
                        resultTxs.push(userTxs[i])
                        break
                    }
                }
                // if (!sameTx)
                //     resultTxs.push(userTxs[i])
                // sameTx = false
            }

            // Add unspent transactions
            // sameTx = false
            // req.locals.unspent.forEach(uTx => {
            //     resultTxs.forEach(resTx => {
            //         if (uTx.txid === resTx.txid &&
            //             uTx.address === resTx.address &&
            //             uTx.amount === resTx.amount)
            //             sameTx = true
            //     })
            //     if (!sameTx) {
            //         uTx.category = 'receive'
            //         resultTxs.push(uTx)
            //     }
            //     sameTx = false
            // })
            
            req.locals.txs = resultTxs 
            // req.locals.txs =  Array.from(userTxs)
            next()
        }, err => {
            if (err instanceof Error) err = err.message
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
    findAppropriateTxs,
    createAddress,
    processUserInput,
    createRawTx,
    listUnspent,
    getTxs,
}
