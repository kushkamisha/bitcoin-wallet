'use strict'

const { expect } = require('chai')
// const sinon = require('sinon')
const btc = require('../../server/utils/bitcoin')

describe('generatePrKey', () => {

    it('should generate private key with default length 256 bits', () => {
        const bitsLen = 256
        const bytesLen = bitsLen / 8 // in bytes
        const privateKey = btc.generatePrKey()
        expect(privateKey.length).to.equal(bytesLen)
    })

    it('should generate private key with length 128 bits', () => {
        const bitsLen = 128
        const bytesLen = bitsLen / 8 // in bytes
        const privateKey = btc.generatePrKey(bitsLen)
        expect(privateKey.length).to.equal(bytesLen)
    })

    it('should generate private key with length 256 bits if wrong length is provided', () => {
        const bitsLen = 512
        const privateKey = btc.generatePrKey(bitsLen)
        expect(privateKey.length).to.equal(256 / 8)
    })

})

describe('prKeyToMnemonic', () => {

    it('should get valid mnemonic from a private key (256 bits, type=string)', () => {
        const privateKey = '7b6766b5fbbdcd2678ee4a5f4e42209b6fa7a120b416d08879317bc372155a20'
        let mnemonic = 'kiwi depth pulp wash system nasty together sing gap improve market cycle '
        mnemonic += 'whip spatial lizard lizard spatial duck era wasp damp apple hammer account'
        expect(btc.prKeyToMnemonic(privateKey)).to.equal(mnemonic)
    })

    it('should get valid mnemonic from a private key (256 bits, type=buffer)', () => {
        const privateKey = '6430d6582a7cd9623fd2ee92af43fc1c0fdd9fd3100ddf203f57e02b750ae321'
        const privateKeyBuf = Buffer.from(privateKey, 'hex')
        let mnemonic = 'goddess mammal noodle female snow rain young fruit naive key yellow day '
        mnemonic += 'worry soup era accuse tennis acid sting scare resemble lyrics milk century'
        expect(btc.prKeyToMnemonic(privateKeyBuf)).to.equal(mnemonic)
    })

    it('should get valid mnemonic from a private key (128 bits, type=string)', () => {
        const privateKey = '69473aabe2725a62c26de81d4ee0547f'
        let mnemonic = 'harsh degree priority shaft certain cousin answer rug bubble jacket bench '
        mnemonic += 'zone'
        expect(btc.prKeyToMnemonic(privateKey)).to.equal(mnemonic)
    })
})

describe('generateMnemonic', () => {

    it('should generate 24 mnemonic words (private key length is 256 bits)', () => {
        expect(btc.generateMnemonic().split(' ').length).to.equal(24)
    })

    it('should generate 12 mnemonic words (private key length is 128 bits)', () => {
        expect(btc.generateMnemonic(128).split(' ').length).to.equal(12)
    })

})