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
    // TO REMOVE!!! Just for test
    if (req.locals.UserId === 7) {
        const balance = 5.87390229089
        return res.status(500).send({
            status: 'success',
            balance
        })
    }
    // end

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

const getTransactions = (req, res) => {
    // TO REMOVE!!! Just for test
    if (req.locals.UserId === 7) {
        const currentBlock = 571019
        const txsBlock = [571017, 570973, 570668, 568584]
        const transactions = [
            {
                timestamp: 1554896510,
                address: 'mpxcemjXGdzwjUcjRb18VABtiXfw3uvekr',
                amount: 3.95772229089,
                direction: 'in',
                confirmations: 0
            },
            {
                timestamp: 1554896530,
                address: 'n3R3d3UiZoq2cWek8qqqXVStk2aAK44wcB',
                amount: 0.5,
                direction: 'in',
                confirmations: 0
            },
            {
                timestamp: 1554896552,
                address: 'mpxcemjXGdzwjUcjRb18VABtiXfw3uvekr',
                amount: 1.58382,
                direction: 'out',
                confirmations: 0
            },
            {
                timestamp: 1554896593,
                address: 'mtXWDB6k5yC5v7TcwKZHB89SUp85yCKshy',
                amount: 3,
                direction: 'in',
                confirmations: 0
            }
        ]

        transactions.forEach((tx, i) => {
            tx.confirmations = currentBlock - txsBlock[i]
        })

        res.send({
            status: 'success',
            transactions
        })
        // end
    } else {
        res.status(500).send({
            status: 'error',
            message: `Can't get transactions list.`
        })
    }
}


module.exports = {
    createAddress,
    getBalance,
    sendTransaction,
    getTransactions
}
