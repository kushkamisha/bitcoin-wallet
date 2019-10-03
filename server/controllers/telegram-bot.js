'use strict'

const Telegraf = require('telegraf')
const { telegramApiToken } = require('../../config')
const logger = require('../../logger')
const { port } = require('../../config')

const bot = new Telegraf(telegramApiToken)

bot.launch()
bot.start((ctx) => {
    ctx.reply(`Welcome! I'll send you all your new transactions.`)
    ctx.reply('Use /login to login.')
    ctx.reply('Use /notify to get notifications about new transactions.')
    bot.chatId = ctx.chat.id
    logger.debug(`Telegram's chat id: ${bot.chatId}`)
})
bot.command('login', (ctx) => {
    ctx.reply(`
        Please log in using the following link: http://127.0.0.1:${port}`)
})
bot.command('notify', (ctx) => {
    if (!bot.userToken)
        ctx.reply(`You should log in first. Please ask the bot to /login`)
    else {
        logger.debug(`User's token: ${bot.userToken}`)
        ctx.reply('Congratulations! Now you\'ll receive all your new ' +
            'transactions.')
    }
})

module.exports = bot
