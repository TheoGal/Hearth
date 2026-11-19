# Hearth (fork)

This is a personal fork of [Hearth](https://github.com/rudra-avatar/Hearth), a custom home launcher for LG webOS TVs.

## Testing

All changes are tested on an LG C3 that is **not rooted**.

## Changes in this fork

1. **Greek language (Ελληνικά).** All Hearth menus in Greek. Choose it in Settings > System > Hearth language.
2. **Weather city names in Greek.** With Greek selected, the weather city search returns Greek names (for example Θεσσαλονίκη). After switching to Greek, search for your city again and pick it.
3. **Greek menus in Hearth's own font.** Greek text uses the same font (Inter) as the English menus, instead of the TV's font.
4. **Fonts with Greek letters only.** The Widget font and App names font settings offer only fonts that can show Greek: Inter, TV font, Commissioner, Manrope, Murecho, Comfortaa, Roboto Mono, Jura, Tektur and JetBrains Mono. Commissioner, Manrope, Murecho and Comfortaa are new; Roboto Mono, Jura, Tektur and JetBrains Mono gained their Greek letters. A previously chosen font that is no longer offered shows as Inter.
5. **Correct Greek capitals.** Headings in capitals drop their accents, as Greek requires (ΕΜΦΑΝΙΣΗ, not ΕΜΦΆΝΙΣΗ).
6. **LG Home style buttons.** Five buttons in the top left corner, as on LG Home: LG Account, Notifications, Quick Settings, Search and TV program (guide). Press Up from the app row to reach them, Up and Down to move between them, Down from the last one (or Right, or Back) to return to the apps. The pointer works too.
7. **Vignette.** The screen edges are gently darkened on every wallpaper, so the buttons and other light text stay readable.
8. **Wallpaper opacity works for the built-in photos.** The "Wallpaper: opacity" setting now also dims the built-in photos and the built-in photo slideshow.
9. **Thin weight is kept.** The Thin font weight no longer turns back into Regular after Hearth restarts.
10. **Custom tile icons.** Upload a PNG or JPG to [`public/custom-icons/`](public/custom-icons/) named after the app or input ID (for example `netflix.png`, or `com.webos.app.hdmi1.png` for HDMI 1) and it replaces that tile's icon in the next build. No root needed.
11. **Pointer highlights the right icon.** When all the icons fit on screen (the row is centered), resting the pointer on an icon highlights that icon, not the one to its right.

## Builds

Ready-to-install IPK files are on the [Releases](https://github.com/TheoGal/Hearth/releases) page, named after the Hearth version (for example `v2.2.0`). Install the IPK over your current Hearth; your settings stay.

## Updating from Hearth

For the fork owner: [`FORK-SYNC.md`](FORK-SYNC.md) is the checklist for syncing this fork with new Hearth versions.

## Original Hearth

For the original app, its documentation and its features, please see the [original Hearth repository](https://github.com/rudra-avatar/Hearth).
