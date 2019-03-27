'use strict'

const btc = require('../../config/connect')
const bitcoin = require('../utils/bitcoin')
const db = require('../../db')
const crypto = require('../crypto')
const Breaker = require('../utils/breaker')

const createWallet = (req, res) => {
    const mnemonic = bitcoin.generateMnemonic()
    const encrypted = crypto.encrypt(mnemonic)

    db.one(`select count(*) from "MnemonicPhrases" where "UserId" = $1`, [res.locals.UserId])
        .then(data => {
            const numOfRows = parseInt(data.count)
            
            if (numOfRows) {
                res.status(400).send({
                    status: 'error',
                    message: 'User already has a mnemonic phrase'
                })
                throw new Breaker('Mnemonic for this user exists')
            }

            return db.none(`insert into "MnemonicPhrases" ("MnemonicPhrase", "UserId")
                            values ($1, $2)`, [encrypted, res.locals.UserId])
        })
        .then(() => {
            res.send({
                status: 'success',
                message: 'New mnemonic phrase was created.'
            })
        })
        .catch(err => {
            if (err.name === 'Breaker') return

            console.error({ err })
            res.status(500).send({
                status: 'error',
                message: 'Error with the database.'
            })
        })
}

/**
 * Generate private key and address for the user from his seed phrase. If user doesn't have
 * seed - generate it for him and save it to the database
 */
const createAddress = (req, res) => {
    
    db.any(`select "MnemonicPhrase", "CurrentPrKeyId" from "MnemonicPhrases" where "UserId" = $1`,
            [res.locals.UserId])
        .then(data => {
            if (!data[0].MnemonicPhrase.length)
                return res.status(400).send({
                    status: 'error',
                    message: `User should has mnemonic phrase to create address.`
                })

            const mnemonicEncrypted = data[0].MnemonicPhrase
            const mnemonic = crypto.decrypt(mnemonicEncrypted)
            const {
                address,
                publicKey,
                privateKey
            } = bitcoin.createAddress(mnemonic, false, data[0].CurrentPrKeyId)

            res.send({ status: 'success', address, publicKey, privateKey })
            db.none(`update "MnemonicPhrases" set "CurrentPrKeyId" = $1 where "UserId" = 49;`,
                [++data[0].CurrentPrKeyId])
        })
        .catch(err => {
            if (err.name === 'Breaker') return

            console.error({ err })
            res.status(500).send({
                status: 'error',
                message: 'Error with the database.'
            })
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
