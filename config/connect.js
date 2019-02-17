'use strict'

/**
 * Connection to 'bitcoind'
 * @module config/connect
 * @see https://bitcoin.org/en/developer-reference
 */

const Client = require('bitcoin-core')
const config = require('.')

/**
 * @example
 * client.getBlockchainInfo().then((help) => console.log(help))
 * @example
 * client.command('getblockhash', 1000000).then(data => console.log(data))
 */
const client = new Client({
    network: config.rpc.network,
    username: config.rpc.username,
    password: config.rpc.password,
    port: config.rpc.port
})

module.exports = client
