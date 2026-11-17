// Fork addition: custom tile icons without root. A picture named after the app's ID in the fork's
// public/custom-icons/ folder (e.g. netflix.png, com.webos.app.hdmi1.jpg) is built into the app and replaces that
// tile's icon. Hearth loads it from its own folder, which works on every TV.

import {useEffect, useState} from 'preact/hooks';
import {iconLoads} from '../lib/ssap';

export const ICON_DIR = 'custom-icons/';
const EXTENSIONS = ['png', 'jpg'];
const CACHE_KEY = 'fork-custom-icons-v1';

let found: Record<string, string> = readCache();

function readCache (): Record<string, string> {
	try {
		const v = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
		return v && typeof v === 'object' ? v : {};
	} catch (e) {
		return {};
	}
}

/** The file address for an app ID, or undefined when the ID has characters a file name should not have. */
function fileUrl (id: string, ext: string, stamp: number): string | undefined {
	if (!/^[A-Za-z0-9._-]+$/.test(id)) return undefined;
	return ICON_DIR + id + '.' + ext + '?v=' + stamp;
}

/** The custom icon for an app ID, if one was found. */
export function customIcon (id: string): string | undefined {
	return found[id];
}

/** The file names Hearth looks for, for the test page. */
export function iconFileNames (id: string): string {
	return EXTENSIONS.map((e) => id + '.' + e).join(' or ');
}

/** Looks for every ID's picture; resolves true when what was found changed. */
export function scanCustomIcons (ids: string[]): Promise<boolean> {
	const stamp = Date.now();
	const next: Record<string, string> = {};
	const one = (id: string, i: number): Promise<void> => {
		if (i >= EXTENSIONS.length) return Promise.resolve();
		const url = fileUrl(id, EXTENSIONS[i], stamp);
		if (!url) return Promise.resolve();
		return iconLoads(url, 2500).then((r) => {
			if (r === 'ok') next[id] = url;
			else if (r === 'slow' && found[id]) next[id] = found[id];       // no answer yet: keep what was there
			else return one(id, i + 1);
		});
	};
	return Promise.all(ids.map((id) => one(id, 0))).then(() => {
		const before = Object.keys(found).sort().join('|');
		const after = Object.keys(next).sort().join('|');
		const changed = before !== after || Object.keys(next).length > 0;
		found = next;
		try { localStorage.setItem(CACHE_KEY, JSON.stringify(next)); } catch (e) { /* storage full: the icons still show this time */ }
		return changed;
	});
}

/** For app.tsx: a number that changes whenever the custom icons change, so the tiles are rebuilt. */
export function useCustomIconsRev (ids: string[], wakes: number): number {
	const [rev, setRev] = useState(0);
	const key = ids.join('|');
	useEffect(() => {
		let live = true;
		scanCustomIcons(ids).then((changed) => { if (live && changed) setRev((r) => r + 1); });
		return () => { live = false; };
	}, [key, wakes]);
	return rev;
}
