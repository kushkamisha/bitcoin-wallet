'use strict'

module.exports = {
    env: 'development',
    port: process.env.DEV_PORT,
    rpc: {
        network: process.env.DEV_RPC_NETWORK,
        username: process.env.DEV_RPC_USERNAME,
        password: process.env.DEV_RPC_PASSWORD,
        port: process.env.DEV_RPC_PORT
    },
    db: {
        user: process.env.DEV_PGUSER,
        host: process.env.DEV_PGHOST,
        database: process.env.DEV_PGDATABASE,
        password: process.env.DEV_PGPASSWORD,
        port: process.env.DEV_PGPORT,
    },
    walletUrl: {
        createAddress: '/createAddress',
        getBalance: '/getBalance',
        sendTransaction: '/sendTransaction'
    },
    jwtSecret: process.env.DEV_JWT_SECRET,
    encryptionKey: process.env.DEV_ENCRYPTION_KEY
}
