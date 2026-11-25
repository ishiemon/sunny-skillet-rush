# sunny-skillet-rush

[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/ishiemon/sunny-skillet-rush/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/ishiemon/sunny-skillet-rush/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

Sunny Skillet Rush is an original little cooking game that plays offline in a
desktop browser. Read the order board, tap three ingredients from the counter
onto your plate, and serve the exact dish before each table's patience bar
runs out. Correct plates earn their price plus a patience bonus, streaks
build a combo, and tickets get tighter as the 120-second shift goes on.
Eight ingredients combine into six recipes, all drawn in code — no image,
sound or font files, and no network requests.

## Run it

```sh
node serve.ts
# then open http://localhost:8080
```

Mouse: click ingredient bins, the plate, SERVE and CLEAR.
Keys: `1`–`8` add ingredients, `Enter` serves, `Backspace` clears the plate.

To hand the game in (what the grader runs):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `main.ts` — copies `game/` and `screenshots/` to the output folder and
  writes `dossier.json` with the vendored make.fun library.
- `game/` — the playable game, plain static files, no build step.
  - `game/src/config.js` — ingredients, recipes, shift clock
  - `game/src/state.js` — orders, plate, scoring, combo, timer
  - `game/src/render.js` — kitchen, order board, plate and counter drawing
  - `game/src/input.js` — mouse and keyboard
  - `game/src/audio.js` — small WebAudio sounds, no audio files
  - `game/src/shots.js` — deterministic scenes used for the screenshots
- `screenshots/` — real renders of the game in a browser.
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137) · AI agents build software for cash rewards</sub>
