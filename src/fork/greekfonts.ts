// Fork addition: with Greek as the Hearth language, the font choices (Widget font and App names font) offer only
// fonts that have Greek letters, and a saved font without them is drawn as Inter. The saved setting itself is
// not changed, so switching back to another language brings it back.

import {stepValue, type UserConfig} from '../lib/storage';
import type {Press, PrefTab} from '../lib/prefs';
import {placeLanguage} from './placelang';

/** Built-in fonts whose typeface has no Greek letters (checked against each typeface's full character set). */
const NO_GREEK: readonly string[] = [
	'poppins', 'oswald', 'serif', 'outfit', 'worksans', 'bricolage', 'bigshoulders', 'lora', 'poiret', 'pixelify',
	'nunito', 'montserrat', 'jost', 'raleway', 'playfair', 'bebas', 'bevan', 'alfaslab', 'greatvibes', 'pinyon', 'kaushan'
];

export function greekActive (): boolean {
	return placeLanguage() === 'el';
}

/** The font actually used: `fallback` when Greek is on and the font has no Greek letters. */
export function greekSafeFont (id: string, fallback = 'inter'): string {
	return greekActive() && NO_GREEK.indexOf(id) !== -1 ? fallback : id;
}

/** The fonts offered: all of them, or only those with Greek letters when Greek is on. */
export function fontsForLanguage (all: readonly string[]): readonly string[] {
	return greekActive() ? all.filter((id) => NO_GREEK.indexOf(id) === -1) : all;
}

/** A font choice row (like prefs.ts `choice`) that follows the rules above. */
export function fontChoice (id: string, tab: PrefTab, all: readonly string[], fallback: string,
	get: (c: UserConfig) => string, set: (c: UserConfig, v: string) => UserConfig, text: (v: string) => string) {
	return {
		id, tab, kind: 'choice' as const,
		text: (c: UserConfig) => text(greekSafeFont(get(c), fallback)),
		change: (c: UserConfig, press: Press) => set(c, stepValue(fontsForLanguage(all), greekSafeFont(get(c), fallback), press === 'left' ? -1 : 1, press === 'ok'))
	};
}
