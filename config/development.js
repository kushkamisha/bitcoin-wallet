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
    sms: {
        accountSid: process.env.DEV_TWILIO_ACCOUNT_SID,
        authToken: process.env.DEV_TWILIO_AUTH_TOKEN,
        from: process.env.DEV_TWILIO_FROM_PHONE,
        to: process.env.DEV_TWILIO_TO_PHONE,
    },
    jwtSecret: process.env.DEV_JWT_SECRET,
    encryptionKey: process.env.DEV_ENCRYPTION_KEY,
    apiKey: process.env.DEV_API_KEY,
    telegramApiToken: process.env.DEV_TELEGRAM_API_TOKEN
}
