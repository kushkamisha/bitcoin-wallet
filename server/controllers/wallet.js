'use strict'

const validate = require('bitcoin-address-validation')
const logger = require('../../logger')
const { btcQuery } = require('../middleware/bitcoin')
const { getBtcErrorCode } = require('../utils/bitcoin')

/**
 * Get balance for the user.
 */
const getBalance = (req, res) => {
    btcQuery({
        method: 'getbalance',
        walletName: req.headers['user-id'].toString()
    })
        .then(balance => {
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

/**
 * Get all in/out transactions of the user's wallet
 */
const getTransactions = (req, res) => {
    btcQuery({
        method: 'listtransactions',
        walletName: req.headers['user-id'].toString()
    })
        .then(txs => {
            res.send({
                status: 'success',
                txs: txs.map(tx => ({
                    txid: tx.txid,
                    address: tx.address,
                    category: tx.category,
                    amount: tx.category === 'send' ? -tx.amount : tx.amount,
                    confirmations: tx.confirmations,
                    time: tx.time,
                    ...(tx.comment !== undefined && { comment: tx.comment })
                }))
            })
        }, err => {
            if (err instanceof Error) err = err.message
            logger.error(err)
            res.status(500).send({
                status: 'error',
                message: `Can't get transactions list.`
            })
        })
}

/**
 * Create address for the user.
 */
const createAddress = (req, res) => {
    btcQuery({
        method: 'getnewaddress',
        walletName: req.headers['user-id'].toString()
    })
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

/**
 * Send bitcoins from the user wallet to another user.
 */
const sendTransaction = (req, res) => {
    let amount = req.headers.amount
    const address = req.headers.address
    const comment = req.headers.comment // optional
    const fee = 0.003 // hardcoded fee for TESTNET ONLY!!!

    if (!amount) return res.status(400).send({
        status: 'error', message: 'No amount provided.'
    })
    if (!address) return res.status(400).send({
        status: 'error', message: 'No address provided.'
    })

    amount = parseFloat(amount)
    if (isNaN(amount)) return res.status(400).send({
        status: 'error', message: 'Amount should be a number.'
    })

    if (!validate(address)) return res.status(400).send({
        status: 'error', message: 'Invalid address.'
    })

    // Set transaction fee
    btcQuery({
        method: 'settxfee',
        params: [fee],
        walletName: req.headers['user-id'].toString()
    })
        .then(status => {
            if (!status) throw new Error('Problem with setting up tx fee.')
            // Fee was set up successfully -> send transaction
            return btcQuery({
                method: 'sendtoaddress',
                params: [address, amount, comment],
                walletName: req.headers['user-id'].toString()
            })
        })
        .then(txid => {
            res.send({
                status: 'success',
                txid
            })
        })
        .catch(err => {
            if (err.name === 'Breaker') return
            if (err instanceof Error) err = err.message
            if (getBtcErrorCode(err) === -6)
                return res.status(400).send({
                    status: 'error', message: 'Insufficient funds.'
                })
            logger.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Internal server error.'
            })
        })
}


module.exports = {
    getBalance,
    getTransactions,
    createAddress,
    sendTransaction,
}
