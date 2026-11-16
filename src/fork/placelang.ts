// Fork addition: the language place names are asked in when searching for a weather city.
// Open-Meteo returns a translated name when it has one (e.g. "Θεσσαλονίκη" for el), otherwise English or the
// local name. Follows the Hearth language in use: a bundled language code, or the code of a loaded language file.

import {ACTIVE_KEY, PACK_KEY} from '../i18n/pack';

/** Open-Meteo takes a lower-case language code without region ("pt-BR" becomes "pt"). */
function plain (code: string): string {
	const base = code.trim().toLowerCase().split('-')[0];
	return /^[a-z]{2,3}$/.test(base) ? base : 'en';
}

export function placeLanguage (): string {
	try {
		const active = localStorage.getItem(ACTIVE_KEY) || 'en';
		if (active !== 'pack') return plain(active);
		const kept = JSON.parse(localStorage.getItem(PACK_KEY) || 'null');
		return kept && typeof kept.code === 'string' ? plain(kept.code) : 'en';
	} catch (e) {
		return 'en';
	}
}

/** Fork: the page language follows the Hearth language, so the browser applies its rules, e.g. Greek capitals
 *  (CSS text-transform: uppercase) drop their accents: "Βασικά" becomes ΒΑΣΙΚΑ, not ΒΑΣΙΚΆ. */
export function syncPageLanguage (): void {
	const lang = placeLanguage();
	if (document.documentElement.lang !== lang) document.documentElement.lang = lang;
}
