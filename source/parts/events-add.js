const TelegrafInlineMenu = require('telegraf-inline-menu')

const allEvents = require('../lib/all-events')
const {filteredOptions} = require('../lib/inline-menu-helper')

const MAX_RESULT_ROWS = 10
const RESULT_COLUMNS = 2

const menu = new TelegrafInlineMenu(menuText)

async function menuText(ctx) {
  const filter = ctx.session.eventfilter || '.+'
  const filteredEvents = await findEvents(ctx, filter)
  const isFiltered = filter !== '.+'
  const total = await allEvents.count()

  let text = '*Veranstaltungen*'
  text += '\nWelche Events möchtest du hinzufügen?'
  text += '\n\n'
  if (isFiltered) {
    text += `Mit deinem Filter konnte ich ${filteredEvents.length} passende Veranstaltungen finden.`
  } else {
    text += `Ich habe ${total} Veranstaltungen. Nutze den Filter um die Auswahl einzugrenzen.`
  }

  return text
}

filteredOptions(menu, {
  uniqueIdentifier: 'events-add-filter',
  uniqueQuestionText: 'Wonach möchtest du die Veranstaltungen filtern?',
  getCurrentFilterFunc: ctx => ctx.session.eventfilter,
  setCurrentFilterFunc: (ctx, filter) => {
    ctx.session.eventfilter = filter
  },
  getFilteredOptionsFunc: findEvents,
  columns: RESULT_COLUMNS,
  maxRows: MAX_RESULT_ROWS,
  setFunc: addEvent
})

function findEvents(ctx, pattern) {
  const blacklist = ctx.state.userconfig.events
  return allEvents.find(pattern, blacklist)
}

async function addEvent(ctx, event) {
  const isExisting = await allEvents.exists(event)
  const isAlreadyInCalendar = ctx.state.userconfig.events
    .includes(event)

  if (!isExisting) {
    await ctx.answerCbQuery(`${event} existiert nicht!`)
    return
  }

  if (isAlreadyInCalendar) {
    await ctx.answerCbQuery(`${event} ist bereits in deinem Kalender!`)
    return
  }

  ctx.state.userconfig.events.push(event)
  ctx.state.userconfig.events.sort()
  await ctx.answerCbQuery(`${event} wurde zu deinem Kalender hinzugefügt.`)
}

module.exports = {
  menu
}