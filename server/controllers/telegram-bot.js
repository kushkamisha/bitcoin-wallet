'use strict'

const Telegraf = require('telegraf')
const { telegramApiToken } = require('../../config')

const bot = new Telegraf(telegramApiToken)

bot.launch()
bot.start((ctx) => {
    ctx.reply(`Welcome! I'll send you all your new transactions.`)
    bot.chatId = ctx.chat.id
})
// bot.help((ctx) => ctx.reply('Send me a sticker'))
// bot.on('sticker', (ctx) => ctx.reply('👍'))
// bot.hears('hi', (ctx) => ctx.reply('Hey there'))
// bot.on('text', ctx => ctx.reply('Unknown command'))

module.exports = bot
