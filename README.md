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
- **Note:** Hearth's menu font (Inter) is bundled with Latin letters only, so Greek text is drawn with the TV's own font.

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

## Builds

Ready-to-install IPK files are on the [Releases](https://github.com/TheoGal/Hearth/releases) page.

Every change to `main` builds a new IPK with GitHub Actions ([`.github/workflows/build.yml`](.github/workflows/build.yml)) and publishes it as a release named after the Hearth version, for example `v2.2.0`. Building the same version again replaces that release. Changes to the docs and `.md` files do not start a build, except language files in `docs/languages/packs/`.

The original Hearth workflows "Publish guides" and "Update tested TVs table" are switched off in this fork, because they only work in the original repository.

## Original Hearth

For the original app, its documentation and its features, please see the [original Hearth repository](https://github.com/rudra-avatar/Hearth).
