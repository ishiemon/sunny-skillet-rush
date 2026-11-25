# Sunny Skillet Rush

An original little cooking game for the make.fun "Make the best cooking game" bounty.

Read the order board, tap three ingredients from the counter onto your plate,
and serve the exact dish before each table's patience bar runs out. Correct
plates earn their price plus a patience bonus, streaks build a combo, and
tickets get tighter as the 120-second shift goes on.

## Play

```sh
node serve.ts
# open http://localhost:8080
```

Mouse: click ingredient bins, the plate, SERVE and CLEAR.
Keys: `1`–`8` add ingredients, `Enter` serves, `Backspace` clears the plate.

## Layout

- `main.ts` — hands the game in: copies `game/` and `screenshots/` to the
  output folder and writes `dossier.json` with the vendored library.
- `game/` — the playable game, plain static files, no build step, no network.
  - `game/src/config.js` — ingredients, recipes, shift clock
  - `game/src/state.js` — orders, plate, scoring, combo, timer
  - `game/src/render.js` — kitchen, order board, plate and counter drawing
  - `game/src/input.js` — mouse and keyboard
  - `game/src/audio.js` — small WebAudio sounds, no audio files
  - `game/src/shots.js` — deterministic scenes used for the screenshots
- `screenshots/` — real renders of the game in a browser.
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged.
