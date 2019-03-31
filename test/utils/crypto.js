'use strict'

const { encrypt, decrypt } = require('../../server/utils/crypto')
const { expect } = require('chai')

describe.skip('encrypt', () => {
    it('should encrypt & decrypt undefined message', () => {
        const msg = undefined
        const encrypted = encrypt(msg)
        const decrypted = decrypt(encrypted)
        expect(decrypted).to.equal(msg)
    })
})
