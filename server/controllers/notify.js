'use strict'

const logger = require('../../logger')
const bot = require('./telegram-bot')
const { accountSid, authToken } = require('../../config').sms
const client = require('twilio')(accountSid, authToken)

const notifyViaSms = (justConfirmedTxs, from, to) => {

    if (justConfirmedTxs.length === 0)
        return logger.error('There are no just confirmed transactions')

    let msg = ''
    if (justConfirmedTxs.length === 1)
        msg = 'You have a new confirmed transaction.'
    else
        msg = `You have ${justConfirmedTxs.length} new confirmed transactions.`

    client.messages
        .create({
            body: msg,
            from,
            to
        })
        .then(message => logger.debug(`Message sid: ${message.sid}`))
        .catch(err => logger.error({ err }))
}

const notifyViaTelegram = (justConfirmedTxs) => {

    if (!bot.chatId || !bot.userToken)
        return logger.error(`Can't send telegram notification - no subscribers`)

    if (justConfirmedTxs.length === 0)
        return logger.error('There are no just confirmed transactions')

    const messages = generateTelegramMessages(justConfirmedTxs)
    messages.map(msg => bot.telegram.sendMessage(bot.chatId, msg))

    logger.debug('New txs notification -> telegram')
}

const generateTelegramMessages = (txs) => {

    const messages = []
    if (txs.length === 1)
        messages.push('You have a new confirmed transaction')
    else
        messages.push(`You have a new ${txs.length} confirmed transactions`)

    txs.map(tx => {
        let sign = tx.amount < 0 ? '➖' : '➕'
        messages.push(`
${sign} ${Math.abs(tx.amount)} BTC

➡️ ${tx.address}

#️⃣ txid
${tx.txid}
        `)
    })

    return messages
}

module.exports = {
    notifyViaSms,
    notifyViaTelegram,
}
