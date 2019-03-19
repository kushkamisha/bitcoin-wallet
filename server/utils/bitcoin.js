'use strict'

/**
 * Bitcoin crypto module
 * @module server/utils/bitcoin.js
 * @see https://en.bitcoin.it/wiki/Wallet_import_format
 * @see https://medium.com/bitcraft/so-you-want-to-build-a-bitcoin-hd-wallet-part-1-8b27aa001ac3
 */

const crypto = require('crypto')
const bs58 = require('bs58')
const bip39 = require('bip39')

/**
 * Generate Bitcoin private key from pseudorandom number
 * @todo Make private key more random
 * @returns {Buffer} Bitcoin private key
 */
const generatePrKey = () => {
    const DH = crypto.createDiffieHellman(256)
    DH.generateKeys()
    const prKey = DH.getPrivateKey()

    return prKey
}

/**
 * BIP39
 * Creates mnemonic phrase from a private key
 * @param {Buffer} prkey - Private key 
 * @returns {string} Mnemonic phrase (24 words)
 */
const prKeyToMnemonic = prkey => {
    return bip39.entropyToMnemonic(prkey, bip39.wordlists.english)
}

/**
 * BIP39
 * @param {string} mnemonic - Mnemonic phrase from the Bitcoin wallet 
 * @param {string} passphrase - Passphrase for the mnemonic phrase
 * @returns {Buffer} Seed
 */
const mnemonicToSeed = (mnemonic, passphrase) => {
    return bip39.mnemonicToSeed(mnemonic, passphrase)
}

/**
 * Converts private key from binary to the WIF format
 * @param {Buffer} prkey - Private key
 * @returns {string} Private key in the WIF format
 */
const prKeyToWIF = (prkey, network='mainnet') => {

    const networkPrefixes = {
        mainnet: '80',
        testnet: 'EF'
    }

    const prefix = network === 'testnet' ?
        networkPrefixes.testnet :
        networkPrefixes.mainnet

    console.log({ prefix })

    // Add 0x80 byte to denote mainnet address
    const prefixBuff = Buffer.from(prefix, 'hex')
    prkey = Buffer.concat([prefixBuff, prkey])

    // Perform sha256 hashing two times
    const hash1 = crypto.createHash('sha256').update(prkey).digest()
    const hash2 = crypto.createHash('sha256').update(hash1).digest()

    // Get first 4 bytes to create checksum
    const checksum = hash2.slice(0, 4)

    // Add checksum to the end of private key with prefix
    prkey = Buffer.concat([prkey, checksum])

    // Convert private key to base58 format
    return bs58.encode(prkey)
}

module.exports = {
    generatePrKey,
    prKeyToMnemonic,
    mnemonicToSeed,
    prKeyToWIF,
}
