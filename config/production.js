module.exports = {
    env: 'production',
    port: process.env.PORT,
    rpc: {
        network: process.env.RPC_NETWORK,
        username: process.env.RPC_USERNAME,
        password: process.env.RPC_PASSWORD,
        port: process.env.RPC_PORT
    },
    db: {
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
    },
    jwtSecret: process.env.JWT_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY
}