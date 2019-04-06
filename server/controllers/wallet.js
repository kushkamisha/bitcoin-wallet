'use strict'

const logger = require('../../logger')
const request = require('request')
const config = require('../../config')

const bitcoinCli = req => new Promise((resolve, reject) => {
    const options = {
        url: 'http://127.0.0.1:18332/',
        method: 'POST',
        headers: { 'content-type': 'text/plain;' },
        body: req.locals.bitcoinCliQuery,
        auth: {
            'user': config.rpc.username,
            'pass': config.rpc.password
        }
    }

    request(options, (err, response, body) => {
        if (err) return reject(err)

        const result = JSON.parse(body)

        if (result.error)
            return reject(`Bitcoin node error.\n Code: ${result.error.code}\n Message: ${result.error.message}`)

        resolve(result)
    })
})

const txsToBalance = ({ txs, minConfirmations, userId }) => 
    txs
        .filter(tx => tx.label == userId)
        .filter(tx => tx.confirmations >= minConfirmations)
        .reduce((acc, tx) => acc + tx.amount, 0)

const createAddress = (req, res) => {
    bitcoinCli(req, res)
        .then(result => {
            res.send({
                status: 'success',
                address: result.result
            })
        }, err => {
            logger.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Internal server error.'
            })
        })
}

const getBalance = (req, res) => {
    bitcoinCli(req, res)
        .then(result => {
            const balance = txsToBalance({
                txs: result.result,
                minConfirmations: 1, // min is 1 confirmation
                userId: req.locals.UserId
            })
            res.send({
                status: 'success',
                balance // in BTC
            })
        }, err => {
            logger.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Internal server error.'
            })
        })
}

const sendTransaction = (req, res) => {
    let amount = req.headers.amount
    if (!amount) return res.status(400).send({ status: 'error', message: 'No amount provided.' })

    amount = parseFloat(amount)
    if (isNaN(amount)) return res.status(400).send({ status: 'error', message: 'Amount should be a number.'})

    res.send({
        status: 'success',
        amount
    })
}


module.exports = {
    createAddress,
    getBalance,
    sendTransaction
}
