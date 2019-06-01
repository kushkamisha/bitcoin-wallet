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
    sms: {
        accountSid: process.env.DEV_TWILIO_ACCOUNT_SID,
        authToken: process.env.DEV_TWILIO_AUTH_TOKEN,
        from: process.env.DEV_TWILIO_FROM_PHONE,
        to: process.env.DEV_TWILIO_TO_PHONE,
    },
    jwtSecret: process.env.JWT_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY,
    apiKey: process.env.API_KEY,
    telegramApiToken: process.env.TELEGRAM_API_TOKEN
}