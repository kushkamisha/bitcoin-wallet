'use strict'

module.exports = {
    env: 'development',
    port: process.env.DEV_PORT,
    rpc: {
        network: process.env.DEV_RPC_NETWORK,
        username: process.env.DEV_RPC_USERNAME,
        password: process.env.DEV_RPC_PASSWORD,
        port: process.env.DEV_RPC_PORT
    }
}
