const Telegraf = require('telegraf')

const Extra = Telegraf.Extra
const Markup = Telegraf.Markup


const bot = new Telegraf.Composer()
module.exports = bot

const broadcastQuestion = 'Hey admin!\nWas möchtest du senden?'

bot.command('broadcast', ctx => {
  return ctx.reply(broadcastQuestion, Markup.forceReply().extra())
})

bot.on('text', Telegraf.optional(ctx => ctx.message && ctx.message.reply_to_message && ctx.message.reply_to_message.text === broadcastQuestion, ctx => {
  return ctx.replyWithMarkdown(
    ctx.message.text,
    Markup.inlineKeyboard([
      Markup.callbackButton('Broadcast!', 'broadcast!'),
      Markup.callbackButton('Clear Broadcast', 'clearinline')
    ]).extra()
  )
}))

bot.action('broadcast!', ctx => {
  return Promise.all([
    ctx.userconfig.broadcast(ctx.callbackQuery.message.text, Extra.markdown()),
    ctx.editMessageReplyMarkup(Markup.inlineKeyboard([])),
    ctx.answerCallbackQuery('Broadcast wird versendet…')
  ])
})

bot.action('clearinline', ctx => {
  return Promise.all([
    ctx.editMessageReplyMarkup(Markup.inlineKeyboard([])),
    ctx.answerCallbackQuery('Inline Keyboard entfernt…')
  ])
})