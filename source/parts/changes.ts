import TelegrafInlineMenu from 'telegraf-inline-menu'

import {generateShortChangeText} from '../lib/change-helper'
import {MyContext, RemovedEventsDisplayStyle} from '../lib/types'

import changesAdd from './change-add'
import * as changeDetails from './change-details'

export const menu = new TelegrafInlineMenu(mainText)

menu.submenu('➕ Änderung hinzufügen', 'a', changesAdd.menu)

menu.selectSubmenu('d', getChangesOptions as any, changeDetails.menu, {
	columns: 1,
	getCurrentPage: ctx => (ctx as MyContext).session.page,
	setPage: (ctx, page) => {
		(ctx as MyContext).session.page = page
	}
})

function getChangesOptions(context: MyContext): Record<string, string> {
	const {changes} = context.state.userconfig
	if (changes.length === 0) {
		return {}
	}

	const result: Record<string, string> = {}
	for (const change of changes) {
		const key = changeDetails.generateChangeAction(change)
		result[key] = generateShortChangeText(change)
	}

	return result
}

const removedEventsOptions = {
	cancelled: 'Standard',
	removed: 'komplett entfernen',
	emoji: 'erzwungen'
}

function currentlySetRemovedEvents(context: MyContext): RemovedEventsDisplayStyle {
	return context.state.userconfig.removedEvents ?? 'cancelled'
}

function showRemovedDescription(): string {
	let text = '*Entfernte Veranstaltungsänderungen*\n'
	text += '\nIn deinem Kalender hast du Änderungen, die Termine entfernen.'
	text += ' Diese ausfallenden Termine werden nach dem iCal Standard mit dem Status CANCELLED markiert.'
	text += ' Jedoch arbeiten nicht alle Kalendertools standardkonform 🙄.'
	text += '\n'

	text += '\nDer *iOS* und *macOS* Systemkalender halten sich an den Standard.'
	text += ' Hier solltest du _Standard_ wählen.'
	text += ' Veranstaltungen können in den jeweiligen Einstellungen vom Kalendertool ein- oder ausgeblendet werden.'

	text += '\nDer *Google* Kalender ist nicht in der Lage, entfernte Veranstaltungen einzublenden.'
	text += ' Sie werden immer ausgeblendet.'
	text += ' Um diese trotzdem anzuzeigen, wähle _erzwungen_ oder bleibe bei _Standard_.'

	text += '\nDer *Exchange* Kalender ignoriert den Status und zeigt die Veranstaltung an, als wäre nichts gewesen.'
	text += ' Du kannst diese Veranstaltungen _komplett entfernen_ oder _erzwingen_.'

	text += '\n'

	text += '\n👌 _Standard_: Der erzeugte Kalender wird standardkonform sein.'
	text += '\n🗑 _komplett entfernen_: Der erzeugte Kalender enthält keine entfernten Veranstaltungen mehr. Du kannst nur noch im Bot sehen, welche Veranstaltungen ausfallen.'
	text += '\n🚫 _erzwungen_: Die Veranstaltung wird auf jeden Fall angezeigt und der Name enthält den 🚫 Emoji.'

	return text
}

function textRemovedEventsSubmenuButton(context: MyContext): string {
	const {removedEvents} = context.state.userconfig
	let text = ''
	if (removedEvents === 'removed') {
		text += '🗑'
	} else if (removedEvents === 'emoji') {
		text += '🚫'
	} else {
		text += '👌'
	}

	text += ' Entfernte Termine'
	return text
}

menu.submenu(textRemovedEventsSubmenuButton as any, 'showRemoved', new TelegrafInlineMenu(showRemovedDescription), {
	hide: ctx => ((ctx as MyContext).state.userconfig.changes)
		.filter(c => c.remove)
		.length === 0
})
	.select('s', removedEventsOptions, {
		columns: 1,
		setFunc: (ctx, key) => {
			(ctx as MyContext).state.userconfig.removedEvents = key as RemovedEventsDisplayStyle
		},
		isSetFunc: (ctx, key) => currentlySetRemovedEvents(ctx as MyContext) === key
	})

function mainText(): string {
	let text = '*Veranstaltungsänderungen*\n'

	text += '\nWenn sich eine Änderung an einer Veranstaltung ergibt, die nicht in den offiziellen Veranstaltungsplan eingetragen wird, kannst du diese hier nachtragen.'
	text += ' Dein Kalender wird dann automatisch aktualisiert und du hast die Änderung in deinem Kalender.'

	text += '\nAußerdem lassen sich die Änderungen teilen, sodass du auch anderen Leuten diese Änderung bereitstellen kannst.'

	text += '\n\n⚠️ Du bist in der Lage, unlogische Veranstaltungstermine zu kreieren. Beispielsweise kannst du einen Termin so verändern, dass er aufhört bevor er beginnt. Den Bot interessiert das nicht, der tut genau das, was du ihm sagst. Dein Kalenderprogramm ist damit dann allerdings häufig nicht so glücklich…'

	return text
}