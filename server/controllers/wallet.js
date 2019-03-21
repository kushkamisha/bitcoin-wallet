'use strict'

const crypto = require('crypto')

const bitcore = require('bitcore-lib')

const btc = require('../../config/connect')
const bitcoin = require('../utils/bitcoin')
const db = require('../../db')

/**
 * Generate private key and address for the user from his seed phrase. If user doesn't have
 * seed - generate it for him and save it to the database
 */
const createAddress = (req, res) => {
    const seed = bitcoin.generateSeed()
    const path = `m/44'/0'/0'/0/0`
    const child = bitcoin.deriveChild(seed, path)
    const publicKeyHash = bitcoin.createPublicKeyHash(child.publicKey)
    const address = bitcoin.createPublicAddress(publicKeyHash)

    res.send({
        status: 'success',
        address,
        publicKey: child.publicKey.toString('hex'), 
        privateKey: child.privateKey.toString('hex'),
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
    createAddress,
    getLastBlock,
    testDatabase,
}
