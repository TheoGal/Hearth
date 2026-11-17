// Fork addition: the five LG Home style buttons (top left of the home screen) and how they open things.
// Each button tries its candidates in order: the first app that exists on the TV is launched with its params.

import {appExists, launchApp} from '../lib/launch';
import {log} from '../lib/log';

export interface LaunchTarget {id: string; params?: object}

export interface SystemButton {
	key: 'account' | 'notifications' | 'quicksettings' | 'search' | 'guide';
	label: string;
	targets: LaunchTarget[];
}

/** Top to bottom, as on LG Home. */
export const SYSTEM_BUTTONS: SystemButton[] = [
	{key: 'account', label: 'LG Account', targets: [{id: 'com.webos.app.lgaccount'}]},
	{key: 'notifications', label: 'Notifications', targets: [{id: 'com.webos.app.notificationcenter'}]},
	{key: 'quicksettings', label: 'Quick Settings', targets: [{id: 'com.webos.app.quicksettings'}]},
	{key: 'search', label: 'Search', targets: [
		{id: 'com.webos.app.voice', params: {activateType: 'mrcu', launchMode: 'vkb'}}, {id: 'com.webos.app.search'}
	]},
	// LG C3: only activateType "tvguide" opens the guide tab; other values (guide, epg, program...) froze the remote
	{key: 'guide', label: 'TV program', targets: [{id: 'com.webos.app.livemenu', params: {activateType: 'tvguide'}}]}
];

export const LAST_BUTTON = SYSTEM_BUTTONS.length - 1;

/** Opens the button's first candidate that exists on this TV. Rejects when none does. */
export function openSystemButton (index: number): Promise<void> {
	const b = SYSTEM_BUTTONS[index];
	if (!b) return Promise.reject(new Error('no such button'));
	const next = (i: number): Promise<void> => {
		// none confirmed (the check can be refused on some TVs): launch the most likely one anyway
		if (i >= b.targets.length) return launchApp(b.targets[0].id, b.targets[0].params || {});
		const t = b.targets[i];
		return appExists(t.id).then((found) => (found ? launchApp(t.id, t.params || {}) : next(i + 1)));
	};
	return next(0).then(
		() => log(`fork: button ${b.key} opened`),
		(e) => { log(`fork: button ${b.key} failed: ${e && e.message ? e.message : e}`); throw e; }
	);
}

/** Remote keys while a button has the focus, or Up from the top tile row. Returns the new focused button
 *  (-1 = back to the tiles), or null when the key is not ours. */
export function buttonKey (key: string, current: number, atTopRow: boolean): number | null {
	if (current < 0) return key === 'up' && atTopRow ? LAST_BUTTON : null;
	if (key === 'up') return Math.max(0, current - 1);
	if (key === 'down') return current === LAST_BUTTON ? -1 : current + 1;
	if (key === 'right' || key === 'back') return -1;
	if (key === 'left') return current;
	return null;
}
