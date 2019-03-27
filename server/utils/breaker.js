'use strict'

/**
 * Custom error class to exit from promise chains
 */
class Breaker extends Error {
    constructor(...args) {
        super(...args)
        this.name = 'Breaker'
    }
}

module.exports = Breaker
