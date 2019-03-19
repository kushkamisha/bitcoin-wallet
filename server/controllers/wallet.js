'use strict'

const crypto = require('crypto')

const bitcore = require('bitcore-lib')

const btc = require('../../config/connect')
const db = require('../../db')


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

const testDatabase = async (req, res) => {
    const userId = req.query.userId || 12345
    const data = req.query.data || 'Test data'

    // Save data to the db
    db.open()
    const dbResponse = await db.query(`
        insert into "MnemonicPhrases" ("UserId", "MnemonicPhrase")
        values
        (${userId}, '${data}');
    `)
    if (dbResponse.err)
        res.status(500).send({
            status: 'error',
            message: `Can't insert data to the database.`
        })
    else
        res.send({
            status: 'success'
        })

    // db.close()
}

module.exports = {
    toMnemonic,
    create,
    getLastBlock,
    testDatabase,
}
