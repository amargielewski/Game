# Feast Knight

![Gameplay](docs/gameplay.png)

An 8-bit catch-the-falling-food game. A starving knight runs along the ground catching food:
every catch scores, every miss costs a life, and the game ends after ten lives are gone.

**[Play it in the browser](https://amargielewski.github.io/Game/)**

## Running it

Pinned to the task's versions, **Node 16.16.0 LTS / npm 8.11.0**. The lockfile is
`lockfileVersion: 2`, so newer npm installs it too.

```bash
nvm use && npm install && npm start
```

| Command             | What it does                   |
| ------------------- | ------------------------------ |
| `npm start`         | development server             |
| `npm run build`     | typecheck + production build   |
| `npm run lint`      | ESLint + the no-comments check |
| `npm run typecheck` | `tsc --noEmit`                 |
| `npm test`          | unit tests (vitest)            |

GitHub Actions runs these on every push and publishes `main` to GitHub Pages. Enable it
once under **Settings → Pages → Source: GitHub Actions**.

## Controls

| Action | Keyboard                                    | Touch                                          |
| ------ | ------------------------------------------- | ---------------------------------------------- |
| Move   | **← →** or **A / D**                        | hold the left or right half, below the top 30% |
| Jump   | **space**, **↑** or **W** (60% air control) | tap the top 30%                                |
| Pause  | **Esc** or **P**                            | the bottom-left button                         |

Pausing costs no lives, and a round pauses itself when its tab is hidden. Game keys are
captured only during a round, so the menus stay keyboard-navigable.

## Gameplay

- ten lives, one lost per missed item
- five levels, each with faster falls, shorter spawn gaps and new food
- twelve kinds of food, rarer is worth more (apple 1 → honeycomb 8)
- **the grub and the bug subtract points** when caught but still cost a life when missed,
  so each one is a choice between points and a life
- every dozen seconds or so a honeycomb flies past out of reach from the ground: jump for it
- **How to play** lists every food with its value; it opens on the first visit, then stays
  in the menu
- the top-ten ranking and the sound settings persist in `localStorage`

## Architecture

Dependencies point one way. Each arrow is an `overrides` entry in `.eslintrc.cjs`, so a
wrong-way import fails `npm run lint`.

```
config/        ──►  (nothing)          the single source of values
game/rules/    ──►  (nothing)          plain TypeScript, no pixi, no config
storage/       ──►  zod, config        the only place untrusted input is parsed
core/          ──►  pixi.js, config    input and scaling, knows nothing about the game
game/          ──►  core, rules, config
presentation/  ──►  events, DOM        listens, never decides
app/           ──►  everything above   the only layer that wires it all together
```

- **Rules are pure.** They get their values through the constructor, so scoring, levels,
  collisions, jump physics and the "what costs a life" rule are tested without mocks or a
  canvas.
- **Balance is in time, not pixels.** `fallSeconds`, `PLAYER_CROSSING_SECONDS` and
  `JUMP_APEX_RATIO` share one world unit: difficulty is the same on both axes and movement
  does not depend on the frame rate.
- **The round is orchestrated explicitly** in `PlayScene.update`. The HUD, particles, sound
  and ranking subscribe to typed events, so a new effect never touches game logic. There is
  no global bus: `World` creates the one `GameEvents` emitter and passes it through
  constructors.
- **The UI is plain DOM**: seven screens on `<template>` and `hidden`, no framework. It is
  bilingual (`pl` / `en`), detected from the browser and switchable in Settings, runtime
  text included.

### Extending it

| Extension        | Files to touch                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| New kind of food | a file in `src/assets/food/`, `config/items.ts`, `config/levels.ts`, `presentation/strings.ts` |
| New level        | `config/levels.ts` (data only)                                                                 |
| Bomb / power-up  | a new `Entity` subclass + a rule in `ScoreBoard`                                               |
| Online ranking   | swap out `storage/high-score-store.ts`                                                         |
| Gamepad support  | `core/input-manager.ts`                                                                        |
| New screen       | a `<section>` in `index.html` + an `Overlay` in the `AppFlow` list                             |
| Balance tweaks   | `config/game-config.ts`                                                                        |
| Another language | `config/locales.ts` + `presentation/strings.ts`                                                |

None of them touch `game/rules/`. Sprites load through `import.meta.glob`, so new artwork
is just a file named after its kind (`cheese.png`).

### Known limitations

- Orientation is picked once, at startup. The game scales to any window, but after rotating
  a phone you need to reload for a matching layout.
- The ranking and settings live in one browser's `localStorage`, with no cross-device sync.

## Credits

- Character: [4 Directional Character](https://lionheart963.itch.io/4-directional-character)
  by lionheart963: the `idle` and `run left/right` frames (84×84), in `src/assets/knight/`.
- Food: [Free Pixel Food](https://henrysoftware.itch.io/pixel-food) by Henry Software
  (artwork: benmhenry@gmail.com): twelve 16×16 sprites, in `src/assets/food/`. The apple is
  also `public/favicon.ico`, scaled nearest-neighbour to 16, 32 and 64 px.
- Font: Press Start 2P (Google Fonts, SIL OFL), falling back to the system monospace.

The background, clouds, hearts and particles are drawn procedurally in code.
