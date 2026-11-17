// Fork addition: the extra fonts, added to Hearth's built-in font list right after "TV font".

import type {ClockFontInfo} from '../lib/clockfont';

const EXTRA_FONTS: ClockFontInfo[] = [
	{id: 'commissioner', label: 'Commissioner (geometric)', family: '"Commissioner", "Inter Variable", "Helvetica Neue", Arial, sans-serif'},
	{id: 'manrope', label: 'Manrope (modern sans)', family: '"Manrope", "Inter Variable", "Helvetica Neue", Arial, sans-serif'},
	{id: 'murecho', label: 'Murecho (light sans)', family: '"Murecho", "Inter Variable", "Helvetica Neue", Arial, sans-serif'},
	{id: 'comfortaa', label: 'Comfortaa (rounded)', family: '"Comfortaa", "Inter Variable", "Helvetica Neue", Arial, sans-serif'}
];

export function withForkFonts (builtIn: ClockFontInfo[]): ClockFontInfo[] {
	return builtIn.slice(0, 2).concat(EXTRA_FONTS, builtIn.slice(2));
}
