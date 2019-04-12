'use strict'

const logger = require('../../logger')
const { bitcoinCli } = require('../utils/bitcoin')

const txsToBalance = ({ txs, minConfirmations, userId }) => 
    txs
        .filter(tx => tx.label == userId)
        .filter(tx => tx.confirmations >= minConfirmations)
        .reduce((acc, tx) => acc + tx.amount, 0)

const createAddress = (req, res) => {
    bitcoinCli(req, res)
        .then(address => {
            res.send({
                status: 'success',
                address
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
        .then(txs => {
            const balance = txsToBalance({
                txs,
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
    if (req.locals.txs) {
        res.send({
            status: 'success',
            txs: req.locals.txs.map(tx => ({
                address: tx.address,
                category: tx.category,
                amount: tx.category === 'send' ? -tx.amount : tx.amount,
                confirmations: tx.confirmations,
                time: tx.time
            }))
        })
    } else {
        logger.error(`Can't get transactions list.`)
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
