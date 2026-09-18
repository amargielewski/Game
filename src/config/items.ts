export const ITEM_KINDS = [
  'apple',
  'bread',
  'cherry',
  'cheese',
  'strawberry',
  'cookie',
  'tart',
  'pineapple',
  'waffles',
  'honeycomb',
  'grub',
  'bug',
] as const;

export type ItemKind = (typeof ITEM_KINDS)[number];

export interface ItemDefinition {
  readonly points: number;
  readonly sparkColor: number;
}

export const ITEM_DEFINITIONS: Readonly<Record<ItemKind, ItemDefinition>> = {
  apple: { points: 1, sparkColor: 0xe4572e },
  bread: { points: 2, sparkColor: 0xc98b4b },
  cherry: { points: 2, sparkColor: 0xc02739 },
  cheese: { points: 3, sparkColor: 0xf4d35e },
  strawberry: { points: 3, sparkColor: 0xef476f },
  cookie: { points: 4, sparkColor: 0xa9714b },
  tart: { points: 5, sparkColor: 0xf2a65a },
  pineapple: { points: 5, sparkColor: 0xd9c04a },
  waffles: { points: 6, sparkColor: 0xe8a33d },
  honeycomb: { points: 8, sparkColor: 0xffb703 },
  grub: { points: -2, sparkColor: 0x8fae5d },
  bug: { points: -3, sparkColor: 0x6a994e },
};

export function isHazard(definition: ItemDefinition): boolean {
  return definition.points < 0;
}

export function mapItemKinds<TValue>(
  toValue: (kind: ItemKind) => TValue,
): Readonly<Record<ItemKind, TValue>> {
  return Object.fromEntries(ITEM_KINDS.map((kind) => [kind, toValue(kind)])) as Record<
    ItemKind,
    TValue
  >;
}
