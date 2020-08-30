import {Context as TelegrafContext} from 'telegraf'

import {ContextProperty} from './chatconfig'

export interface MyContext extends TelegrafContext {
	userconfig: ContextProperty;
	state: {
		userconfig: Userconfig;
		addChange?: Change;
	};
	session: {
		page?: number;
		mensa?: {
			mensa?: string;
			date?: number;
		};
	};
}

export interface Userconfig {
	calendarfileSuffix?: string;
	changes: Change[];
	events: string[];
	mensa: MensaSettings;
	removedEvents?: RemovedEventsDisplayStyle;
	stisysUpdate?: boolean;
}

export type RemovedEventsDisplayStyle = 'cancelled' | 'removed' | 'emoji'

export interface Change {
	name: string;
	date: string;
	remove?: boolean;
	namesuffix?: string;
	starttime?: string;
	endtime?: string;
	room?: string;
}

export type MensaPriceClass = 'student' | 'attendant' | 'guest'

export interface MealWishes {
	noBeef?: boolean;
	noFish?: boolean;
	noPig?: boolean;
	noPoultry?: boolean;
	lactoseFree?: boolean;
	vegan?: boolean;
	vegetarian?: boolean;
}

export interface MensaSettings extends MealWishes {
	main?: string;
	more?: string[];
	price?: MensaPriceClass;
	showAdditives?: boolean;
}

export interface EventEntryFileContent {
	readonly Name: string;
	readonly Location: string;
	readonly Description: string;
	readonly StartTime: string;
	readonly EndTime: string;
}

export interface EventEntryInternal {
	readonly Name: string;
	readonly Location: string;
	readonly Description: string;
	readonly StartTime: Date;
	readonly EndTime: Date;
}
