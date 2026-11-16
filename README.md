# Hearth (fork)

This is a personal fork of [Hearth](https://github.com/rudra-avatar/Hearth), a custom home launcher for LG webOS TVs.

## Testing

All changes are tested on an LG C3 that is **not rooted**.

## Changes in this fork

### 1. Greek language (Ελληνικά)

A full Greek translation of all Hearth menu texts.

- **File:** [`docs/languages/packs/el.json`](docs/languages/packs/el.json)
- **How it gets into the app:** Hearth's build (`scripts/gen-bundled-languages.mjs`) bundles every file in `docs/languages/packs/` into the app, so no code change was needed. This also works on TVs without root.
- **How to use it:** Settings > System > Hearth language, then press left or right until **Ελληνικά** shows.
- **Font:** see change 3, so Greek menus use the same font as the English ones.

### 3. Greek letters for the menu font (Inter)

The original Hearth bundles its menu font, Inter, with Latin letters only, so Greek text was drawn with the TV's own font. The fork adds Inter's Greek letters, so Greek menus look the same as the English ones, at every weight (Thin to Bold).

What was changed, and where:

- **New file [`src/assets/inter-greek-wght.woff2`](src/assets/inter-greek-wght.woff2)** (19 KB): the Greek part of Inter, taken from [`@fontsource-variable/inter`](https://www.npmjs.com/package/@fontsource-variable/inter) 5.3.0 (`files/inter-greek-wght-normal.woff2`). It is the same Inter build (4.001) as Hearth's own Latin file, which comes from the same package. Inter's licence (SIL OFL) is already included with Hearth in `public/licenses/Inter-OFL.txt`.
- **[`src/theme/global.css`](src/theme/global.css):** a second `@font-face` for the same `'Inter Variable'` family, right after the Latin one. Its `unicode-range` covers only Greek letters, so the TV loads the file only when a Greek letter is on screen, and everything else keeps using the Latin file:

  ```css
  @font-face {
  	font-family: 'Inter Variable';
  	font-style: normal;
  	font-weight: 100 900;
  	font-display: block;
  	unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
  	src: url('../assets/inter-greek-wght.woff2') format('woff2');
  }
  ```

Note: this covers the menus and every text that uses Inter. The fonts you can pick for the widget and the app names are handled in change 4.

### 4. Greek-ready font choices (Widget font and App names font)

Hearth offers 27 fonts for the clock widget and the app names. Only 6 of them can show Greek letters: **Inter**, **TV font**, **Roboto Mono**, **Jura**, **Tektur** and **JetBrains Mono**. The other typefaces (Montserrat, Poppins, Oswald and the rest) were never drawn with Greek letters, so nothing can be added for them.

With Greek as the Hearth language:

- The **Widget font** and **App names: font** rows offer only those 6 fonts (App names also keeps **Default**).
- If a font without Greek letters was chosen before, Hearth draws Inter instead and the row shows Inter (or Default for app names). The saved choice is not changed: switch back to English and your earlier font returns.

What was changed, and where:

- **Greek letters for Roboto Mono, Jura, Tektur and JetBrains Mono.** Hearth bundles only their Latin letters. The fork adds their Greek letters, taken from [Fontsource](https://fontsource.org) 5.3.0 in exactly the same font versions Hearth uses (Roboto Mono 3.001, Jura 5.106, Tektur 1.005, JetBrains Mono 2.211). Their licences (SIL OFL) are already in `public/licenses/`. New files in [`src/assets/`](src/assets/):
  - `roboto-mono-greek-200.woff2`, `roboto-mono-greek-300.woff2`, `roboto-mono-greek-400.woff2` (the three weights Hearth uses)
  - `jura-greek-wght.woff2`, `tektur-greek-wght.woff2`, `jetbrains-mono-greek-wght.woff2`
- **[`src/theme/global.css`](src/theme/global.css):** six `@font-face` lines right after Hearth's own ones for these fonts, same family names and weights, limited to Greek letters with `unicode-range` (so they load only when Greek text is on screen).
- **New file [`src/fork/greekfonts.ts`](src/fork/greekfonts.ts):**
  - `NO_GREEK`: the list of built-in fonts without Greek letters
  - `greekActive()`: true when the Hearth language is Greek (uses `placeLanguage()` from change 2)
  - `greekSafeFont(id, fallback)`: returns `fallback` (Inter) for a font without Greek letters while Greek is on
  - `fontsForLanguage(all)`: the font list without those fonts while Greek is on
  - `fontChoice(...)`: a settings row like Hearth's own `choice(...)`, but showing and stepping through `fontsForLanguage(...)` only
- **[`src/lib/prefs.ts`](src/lib/prefs.ts):** the `labelFont` and `clockFont` rows use `fontChoice(...)` instead of `choice(...)`, with one extra argument for the fallback (`'default'` for app names, `'inter'` for the widget):

  ```ts
  fontChoice('clockFont', 'clock',
  	CLOCK_FONT_IDS, 'inter', (c) => c.clock.font, (c, v) => ({...c, clock: {...c.clock, font: v}}), (v) => fontLabel(v)),
  ```

- **[`src/lib/clockfont.ts`](src/lib/clockfont.ts), `fontFamily()`:** its first line passes the font through `greekSafeFont()`, so a font without Greek letters is drawn as Inter on screen too:

  ```ts
  export function fontFamily (id: ClockFont): string {
  	id = greekSafeFont(id);   // fork: Greek on = a font without Greek letters is drawn as Inter
  	...
  ```

This applies at once when the language is switched, with no restart. Switching back to English brings back all 27 fonts and the font chosen before.

Fonts that come with a loaded theme are not filtered.

### 2. Weather city search in the Hearth language

When you search for a weather city, the place names now come back in the language Hearth is using. With Greek selected, searching "Thessaloniki" or "Θεσσαλονίκη" returns **Θεσσαλονίκη**. In English nothing changes.

The city search uses the [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api). The original Hearth always asked it for English names (`language=en`). The fork asks in the current Hearth language instead. Open-Meteo returns a translated name when it has one, otherwise English or the local name.

What was changed, and where:

- **New file [`src/fork/placelang.ts`](src/fork/placelang.ts):** a function `placeLanguage()` that returns the current Hearth language code for Open-Meteo. It reads the language Hearth has stored as active (`hearth-langactive-v1`), or the code of a loaded language file (`hearth-langpack-v1`), and turns it into a lower-case code without region (`el`, `de`, `pt-BR` becomes `pt`). English (`en`) is the fallback.
- **[`src/lib/weather.ts`](src/lib/weather.ts), `geocodeUrl()`:** takes a second parameter, `language` (default `en`), and puts it in the request instead of the fixed `language=en`:

  ```ts
  export function geocodeUrl (query: string, language = 'en'): string {
  	return 'https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(query.trim().slice(0, 60)) + '&count=8&language=' + language + '&format=json';
  }
  ```

- **[`src/lib/weathernet.ts`](src/lib/weathernet.ts), `searchCities()`:** imports `placeLanguage` and passes it to `geocodeUrl`:

  ```ts
  import {placeLanguage} from '../fork/placelang';
  ...
  return fetchText(geocodeUrl(query, placeLanguage()), allowShell).then(parseCities);
  ```

Notes:

- The city name is saved when you pick a city. After switching to Greek, search for your city again and pick it to get the Greek name.
- The **Popular cities** list shown before you search is built into Hearth in English. Search instead to get the Greek name.
- The high and low temperature letters (H and L) are not changed.

## Updating from Hearth

When Hearth releases a new version, follow [`FORK-SYNC.md`](FORK-SYNC.md): a short checklist for syncing this fork and keeping its changes.

## Builds

Ready-to-install IPK files are on the [Releases](https://github.com/TheoGal/Hearth/releases) page.

Every change to `main` builds a new IPK with GitHub Actions ([`.github/workflows/build.yml`](.github/workflows/build.yml)) and publishes it as a release named after the Hearth version, for example `v2.2.0`. Building the same version again replaces that release. Changes to the docs and `.md` files do not start a build, except language files in `docs/languages/packs/`.

The original Hearth workflows "Publish guides" and "Update tested TVs table" are switched off in this fork, because they only work in the original repository.

## Original Hearth

For the original app, its documentation and its features, please see the [original Hearth repository](https://github.com/rudra-avatar/Hearth).
