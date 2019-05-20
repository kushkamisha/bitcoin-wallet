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
    apiKey: process.env.API_KEY
}