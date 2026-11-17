// Fork addition: the "Wallpaper: opacity" setting for a single built-in photo. Hearth paints that photo as the
// wallpaper's own background (--wallpaper-image), where the opacity setting never reached. Like Hearth does for
// your own pictures (P67), a black veil of the missing share stands in for the lower opacity.
// The built-in photo slideshow is handled in PhotoShow (its picture layers take the opacity).

import {setRootVars} from '../lib/cssvars';

export function syncBuiltInVeil (singleBuiltIn: boolean, opacity: number): void {
	if (!singleBuiltIn) return;          // own pictures and folders: Hearth's own veil code is in charge
	const share = ((100 - opacity) / 100).toFixed(2);
	setRootVars({'--wallpaper-veil': opacity < 100 ? `linear-gradient(rgba(0,0,0,${share}),rgba(0,0,0,${share}))` : 'none'});
}
