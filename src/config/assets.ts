import { ITEM_KINDS, type ItemKind } from './items';

type AssetIndex = Readonly<Record<string, string>>;

const KNIGHT_FILES = import.meta.glob('../assets/knight/*.png', {
  eager: true,
  import: 'default',
}) as AssetIndex;

const FOOD_FILES = import.meta.glob('../assets/food/*.png', {
  eager: true,
  import: 'default',
}) as AssetIndex;

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
  const match = Object.entries(FOOD_FILES).find(([path]) => baseName(path).toLowerCase() === kind);

  if (!match) {
    throw new Error(`No sprite found for food "${kind}"`);
  }

  return match[1];
}

export const KNIGHT_IDLE_URLS = knightFrames('idle');
export const KNIGHT_RUN_RIGHT_URLS = knightFrames('run-right');
export const KNIGHT_RUN_LEFT_URLS = knightFrames('run-left');

export const FOOD_URLS: Readonly<Record<ItemKind, string>> = Object.fromEntries(
  ITEM_KINDS.map((kind) => [kind, foodUrl(kind)]),
) as Record<ItemKind, string>;

export const ALL_ASSET_URLS: readonly string[] = [
  ...KNIGHT_IDLE_URLS,
  ...KNIGHT_RUN_RIGHT_URLS,
  ...KNIGHT_RUN_LEFT_URLS,
  ...Object.values(FOOD_URLS),
];
