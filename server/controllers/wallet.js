'use strict'

const bitcore = require('bitcore-lib')
const btc = require('../../config/connect')

/**
 * Generate private key and address for the user
 */
const create = (req, res) => {
    const privateKey = new bitcore.PrivateKey()
    const address = privateKey.toAddress()

    res.send({
        status: 'success',
        address: address.toString(),
        privateKey: privateKey.toString(),
    })
}

const getLastBlock = (req, res) => {
    btc.command('getblockcount')
        .then(block => {
            res.send({
                status: 'success',
                block
            })
        })
        .catch(err => {
            console.error({ err })
            res.status(500).send({
                status: 'error',
                message: `Can't connect to the Bitcoin node.`
            })
        })
}

module.exports = {
    create,
    getLastBlock,
}
