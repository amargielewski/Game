import { mapItemKinds, type ItemKind } from './items';

const KNIGHT_FILES = import.meta.glob<string>('../assets/knight/*.png', {
  eager: true,
  import: 'default',
});

const FOOD_FILES = import.meta.glob<string>('../assets/food/*.png', {
  eager: true,
  import: 'default',
});

function baseName(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1).replace(/\.png$/, '');
}

function knightFrames(animation: string): readonly string[] {
  const frames = Object.entries(KNIGHT_FILES)
    .filter(([path]) => baseName(path).startsWith(`${animation}-`))
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([, url]) => url);

  if (frames.length === 0) {
    throw new Error(`No sprites found for knight animation "${animation}"`);
  }

  return frames;
}

function foodUrl(kind: ItemKind): string {
  const match = Object.entries(FOOD_FILES).find(([path]) => baseName(path) === kind);

  if (!match) {
    throw new Error(`No sprite found for food "${kind}"`);
  }

  return match[1];
}

export const KNIGHT_IDLE_URLS = knightFrames('idle');
export const KNIGHT_RUN_RIGHT_URLS = knightFrames('run-right');
export const KNIGHT_RUN_LEFT_URLS = knightFrames('run-left');

export const FOOD_URLS = mapItemKinds(foodUrl);

export const ALL_ASSET_URLS: readonly string[] = [
  ...KNIGHT_IDLE_URLS,
  ...KNIGHT_RUN_RIGHT_URLS,
  ...KNIGHT_RUN_LEFT_URLS,
  ...Object.values(FOOD_URLS),
];
