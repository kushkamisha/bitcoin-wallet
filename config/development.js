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
    jwtSecret: process.env.JWT_SECRET
}
