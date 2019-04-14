'use strict'

const logger = require('../../logger')
const { bitcoinCli } = require('../utils/bitcoin')

const txsToBalance = ({ txs, minConfirmations, userId }) => 
    txs
        .filter(tx => tx.label == userId)
        .filter(tx => tx.confirmations >= minConfirmations)
        .reduce((acc, tx) => acc + tx.amount, 0)

const createAddress = (req, res) => {
    bitcoinCli(req)
        .then(address => {
            res.send({
                status: 'success',
                address
            })
        }, err => {
            if (err instanceof Error) err = err.message
            logger.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Internal server error.'
            })
        })
}

const getBalance = (req, res) => {
    bitcoinCli(req)
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
            if (err instanceof Error) err = err.message
            logger.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Internal server error.'
            })
        })
}

const sendTransaction = (req, res) => {
    req.locals.bitcoinCliQuery = JSON.stringify({
        id: 'sendrawtransaction',
        method: 'sendrawtransaction',
        params: [req.locals.signedTx.hex]
    })

    bitcoinCli(req)
        .then(txid => {
            console.log({ txid })
            res.send({
                status: 'success',
                txid
            })
        }, err => {
            if (err instanceof Error) err = err.message
            logger.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Internal server error.'
            })
        })
}

const getTransactions = (req, res) => {
    if (req.locals.txs) {
        res.send({
            status: 'success',
            txs: req.locals.txs.map(tx => ({
                txid: tx.txid,
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
