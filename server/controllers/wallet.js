'use strict'

const btc = require('../../config/connect')
const bitcoin = require('../utils/bitcoin')
const db = require('../../db')
const crypto = require('../crypto')

const createWallet = (req, res) => {
    const mnemonic = bitcoin.generateMnemonic()
    const encrypted = crypto.encrypt(mnemonic)

    db.none(`insert into "MnemonicPhrases" ("MnemonicPhrase", "UserId") values ($1, $2)`,
            [encrypted, res.locals.UserId])
        .then(() => {
            res.send({
                status: 'success',
                message: 'New mnemonic phrase was created.'
            })
        }, err => {
            console.error({ err })
            res.status(500).send({
                status: 'error',
                message: 'Failed to generate & save mnemonic.'
            })
        })
}

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


module.exports = {
    createWallet,
    createAddress,
    getLastBlock,
}
