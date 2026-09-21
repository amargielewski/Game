# Feast Knight

![Gameplay](docs/gameplay.png)

An 8-bit catch-the-falling-food game in TypeScript and PixiJS. A knight catches falling food:
every missed one costs a life, and the game ends after ten.

**[Play it in the browser](https://amargielewski.github.io/Game/)**

## Running it

Node 16.16.0 LTS / npm 8.11.0 (`.nvmrc`).

```bash
npm install && npm start
```

`npm test`, `npm run lint` and `npm run build` check the rest.

## Controls

| Action | Keyboard                | Touch                                     |
| ------ | ----------------------- | ----------------------------------------- |
| Move   | **← →** or **A / D**    | hold the left or right half of the screen |
| Jump   | **space**, **↑**, **W** | swipe up, or tap with a second finger     |
| Pause  | **Esc** or **P**        | the bottom-left button                    |

## Gameplay

- five levels, each faster and with new food
- the grub and the bug take points away: let them fall
- a honeycomb flies across every 13 seconds: jump for it
- the top-ten ranking and the settings are saved in the browser
- Polish and English

## Extending it

| Extension        | Where                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| New kind of food | a sprite in `src/assets/food/`, `config/items.ts`, `config/levels.ts`, `presentation/strings.ts` |
| New level        | `config/levels.ts`                                                                               |
| Balance          | `config/game-config.ts`                                                                          |
| New language     | `config/locales.ts`, `presentation/strings.ts`                                                   |
| New screen       | a `<section>` in `index.html` and an `Overlay` in `app/app-flow.ts`                              |

## Credits

- Character: [4 Directional Character](https://lionheart963.itch.io/4-directional-character) by lionheart963
- Food: [Free Pixel Food](https://henrysoftware.itch.io/pixel-food) by Henry Software
- Font: Press Start 2P (Google Fonts, SIL OFL)
