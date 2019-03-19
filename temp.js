'use strict'

/**
 * @see https://iancoleman.io/bip39/
 */

const bitcoin = require('./server/utils/bitcoin')

// const prKeyBuffer = bitcoin.generatePrKey()
const prKeyBuffer = Buffer.from('5a6a0291143d971d8c546c6257199bfd1a376f767297970c69a38c0472e0b793', 'hex')
// const prKeyWIF = bitcoin.prKeyToWIF(prKeyBuffer)//, 'testnet')
const mnemonic = bitcoin.prKeyToMnemonic(prKeyBuffer)
const seed = bitcoin.mnemonicToSeed(mnemonic).toString('hex')

// console.log({ prKeyBuffer })
// console.log({ prKeyWIF })
console.log({ mnemonic })
console.log({ seed })
