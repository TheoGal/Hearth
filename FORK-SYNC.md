# Updating this fork from Hearth

Checklist for when Hearth releases a new version. Follow it in order.

## 1. Sync

1. Open https://github.com/TheoGal/Hearth
2. Click **Sync fork**.
3. If it shows **Update branch**: click it, then go to step 3 below (Check the build).
4. If it says there are **conflicts**: go to step 2 below.

> **Never click "Discard commits".** It deletes every change made in this fork.

## 2. Conflicts (only if Sync fork reported them)

1. In the Sync fork box, click **Open pull request**.
2. On the pull request page, click **Resolve conflicts**.
3. For each file in the list, use the rule below. Conflicts look like this:

   ```
   <<<<<<< main
   (this fork's version)
   =======
   (Hearth's new version)
   >>>>>>> upstream
   ```

4. When every file is done, click **Mark as resolved**, then **Commit merge**, then **Merge pull request**, then **Confirm merge**.

Rules per file:

| File | What to do |
|---|---|
| `README.md` | Keep this fork's version (the top part). Delete Hearth's part and the marker lines. |
| `src/lib/weather.ts` | Take Hearth's new version, then make sure `geocodeUrl` looks like fix A below. |
| `src/lib/weathernet.ts` | Take Hearth's new version, then re-apply fix B below. |
| `src/lib/prefs.ts` | Take Hearth's new version, then re-apply fix C below. |
| `src/lib/clockfont.ts` | Take Hearth's new version, then re-apply fix D below. |
| `src/app.tsx` | Take Hearth's new version, then re-apply fix E below. |
| `src/theme/global.css` | Keep **both** versions: Hearth's lines and the lines marked `/* Fork: ... */`. Delete only the marker lines. |
| `src/config/bundledlanguages.ts` | Take Hearth's version. |
| `docs/languages/packs/el.json` | Only if Hearth added its own Greek: keep this fork's version. |
| Anything else | Take Hearth's version. |

"Take Hearth's version" means: delete the part between `<<<<<<< main` and `=======`, and the three marker lines.

### Fix A: `src/lib/weather.ts`

The `geocodeUrl` function must be:

```ts
export function geocodeUrl (query: string, language = 'en'): string {
	return 'https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(query.trim().slice(0, 60)) + '&count=8&language=' + language + '&format=json';
}
```

### Fix B: `src/lib/weathernet.ts`

1. Under the line `import ... from './weather';` add:

   ```ts
   import {placeLanguage} from '../fork/placelang';
   ```

2. In `searchCities`, change `geocodeUrl(query)` to `geocodeUrl(query, placeLanguage())`.

### Fix C: `src/lib/prefs.ts`

1. Under the line `import {CLOCK_FONT_IDS, LABEL_FONT_IDS, ...} from './clockfont';` add:

   ```ts
   import {fontChoice} from '../fork/greekfonts';
   ```

2. Find `choice('labelFont', 'look',` and change it to `fontChoice('labelFont', 'look',`. On the next line, after `LABEL_FONT_IDS,` add `'default',`
3. Find `choice('clockFont', 'clock',` and change it to `fontChoice('clockFont', 'clock',`. On the next line, after `CLOCK_FONT_IDS,` add `'inter',`

### Fix D: `src/lib/clockfont.ts`

1. At the very top of the file add:

   ```ts
   import {greekSafeFont} from '../fork/greekfonts';
   ```

2. Find `export function fontFamily (id: ClockFont): string {` and add this as its first line inside:

   ```ts
   	id = greekSafeFont(id);   // fork: Greek on = a font without Greek letters is drawn as Inter
   ```

### Fix E: `src/app.tsx`

1. Under the line `import {applyLanguage, ...} from './i18n/pack';` add:

   ```ts
   import {syncPageLanguage} from './fork/placelang';
   ```

2. Find the line that starts with `applyLanguage(config.language);` and add this line right under it:

   ```ts
   	syncPageLanguage();
   ```

## 3. Check the build

1. Open the **Actions** tab. Wait for **Build IPK** to finish.
2. Green: the new version is on the **Releases** page, for example `v2.3.0`. Install it.
3. Red: open the failed run and send the error to Claude.

## 4. After installing the new version

1. **New English texts:** Hearth's new texts show in English while the menus are in Greek. Ask Claude: "translate the missing keys of `docs/languages/packs/el.json` in TheoGal/Hearth".
2. **New fonts:** if the new Hearth added fonts to the Widget font list, ask Claude: "check if Hearth's new fonts have Greek letters and update `src/fork/greekfonts.ts`".
3. **Weather city:** if the city name turned back to English, search for the city again and pick it.

## Files that belong to this fork only

These never conflict and need nothing:

- `src/fork/placelang.ts`
- `src/fork/greekfonts.ts`
- `src/assets/*-greek-*.woff2` (7 files)
- `.github/workflows/build.yml`
- `FORK-SYNC.md`
