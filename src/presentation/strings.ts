import type { ItemKind } from '../config/items';
import type { Locale } from '../config/locales';

const TRANSLATIONS = {
  pl: {
    loading: 'Wczytywanie...',
    menuHint: 'Łap jedzenie, nie pozwól mu spaść.',
    play: 'Graj',
    ranking: 'Ranking',
    settings: 'Ustawienia',
    guide: 'Jak grać',
    guideGood: 'Łap — dają punkty:',
    guideBad: 'Omijaj — zabierają punkty:',
    guideBonus: 'Plaster miodu przelatuje w poprzek — wyskocz po niego.',
    guideMiss: 'Każde przegapione jedzenie kosztuje życie. Przegapiony robak nie.',
    controls: 'Ruch: ← → lub A/D · Skok: spacja · Dotyk: dół rusza, góra skacze',
    back: 'Wróć',
    backToMenu: 'Menu',
    language: 'Język',
    sound: 'Dźwięk',
    volume: 'Głośność',
    noScores: 'Brak wyników. Zagraj pierwszą partię.',
    clearRanking: 'Wyczyść ranking',
    pauseAction: 'Pauza',
    pause: 'Pauza',
    resume: 'Wróć do gry',
    gameOver: 'Koniec gry',
    score: 'Wynik:',
    level: 'Poziom',
    newRecord: 'Nowy rekord! Twoje imię:',
    save: 'Zapisz',
    restart: 'Jeszcze raz',
    anonymous: 'Anonim',
  },
  en: {
    loading: 'Loading...',
    menuHint: 'Catch the food, do not let it fall.',
    play: 'Play',
    ranking: 'Ranking',
    settings: 'Settings',
    guide: 'How to play',
    guideGood: 'Catch these — they score:',
    guideBad: 'Avoid these — they cost points:',
    guideBonus: 'The honeycomb flies across — jump for it.',
    guideMiss: 'Every missed food costs a life. A missed bug does not.',
    controls: 'Move: ← → or A/D · Jump: space · Touch: bottom moves, top jumps',
    back: 'Back',
    backToMenu: 'Menu',
    language: 'Language',
    sound: 'Sound',
    volume: 'Volume',
    noScores: 'No scores yet. Play your first round.',
    clearRanking: 'Clear ranking',
    pauseAction: 'Pause',
    pause: 'Paused',
    resume: 'Resume',
    gameOver: 'Game over',
    score: 'Score:',
    level: 'Level',
    newRecord: 'New record! Your name:',
    save: 'Save',
    restart: 'Play again',
    anonymous: 'Anonymous',
  },
} as const;

type StringKey = keyof (typeof TRANSLATIONS)['pl'];

const FOOD_NAMES = {
  pl: {
    apple: 'Jabłko',
    bread: 'Chleb',
    cherry: 'Wiśnie',
    cheese: 'Ser',
    strawberry: 'Truskawka',
    cookie: 'Ciastko',
    tart: 'Tarta',
    pineapple: 'Ananas',
    waffles: 'Gofry',
    honeycomb: 'Plaster miodu',
    grub: 'Larwa',
    bug: 'Robak',
  },
  en: {
    apple: 'Apple',
    bread: 'Bread',
    cherry: 'Cherries',
    cheese: 'Cheese',
    strawberry: 'Strawberry',
    cookie: 'Cookie',
    tart: 'Tart',
    pineapple: 'Pineapple',
    waffles: 'Waffles',
    honeycomb: 'Honeycomb',
    grub: 'Grub',
    bug: 'Bug',
  },
} as const;

let activeLocale: Locale = 'pl';

export function changeLocale(locale: Locale): void {
  activeLocale = locale;
}

export function translate(key: StringKey): string {
  return TRANSLATIONS[activeLocale][key];
}

export function translateFood(kind: ItemKind): string {
  return FOOD_NAMES[activeLocale][kind];
}

export function applyTranslations(root: ParentNode): void {
  document.documentElement.lang = activeLocale;

  for (const element of root.querySelectorAll<HTMLElement>('[data-text]')) {
    const key = element.dataset['text'];

    if (key !== undefined && key in TRANSLATIONS[activeLocale]) {
      element.textContent = translate(key as StringKey);
    }
  }
}
