import type { ItemKind } from './items';

import knightIdle0 from '../assets/knight/idle-0.png';
import knightIdle1 from '../assets/knight/idle-1.png';
import knightIdle2 from '../assets/knight/idle-2.png';
import knightIdle3 from '../assets/knight/idle-3.png';
import knightRunRight0 from '../assets/knight/run-right-0.png';
import knightRunRight1 from '../assets/knight/run-right-1.png';
import knightRunRight2 from '../assets/knight/run-right-2.png';
import knightRunRight3 from '../assets/knight/run-right-3.png';
import knightRunRight4 from '../assets/knight/run-right-4.png';
import knightRunRight5 from '../assets/knight/run-right-5.png';
import knightRunLeft0 from '../assets/knight/run-left-0.png';
import knightRunLeft1 from '../assets/knight/run-left-1.png';
import knightRunLeft2 from '../assets/knight/run-left-2.png';
import knightRunLeft3 from '../assets/knight/run-left-3.png';
import knightRunLeft4 from '../assets/knight/run-left-4.png';
import knightRunLeft5 from '../assets/knight/run-left-5.png';

import apple from '../assets/food/Apple.png';
import bread from '../assets/food/Bread.png';
import cheese from '../assets/food/Cheese.png';
import pineapple from '../assets/food/Pineapple.png';
import waffles from '../assets/food/Waffles.png';
import grub from '../assets/food/Grub.png';
import cherry from '../assets/food/Cherry.png';
import strawberry from '../assets/food/Strawberry.png';
import cookie from '../assets/food/Cookie.png';
import tart from '../assets/food/Tart.png';
import honeycomb from '../assets/food/Honeycomb.png';
import bug from '../assets/food/Bug.png';

export const KNIGHT_IDLE_URLS: readonly string[] = [
  knightIdle0,
  knightIdle1,
  knightIdle2,
  knightIdle3,
];

export const KNIGHT_RUN_RIGHT_URLS: readonly string[] = [
  knightRunRight0,
  knightRunRight1,
  knightRunRight2,
  knightRunRight3,
  knightRunRight4,
  knightRunRight5,
];

export const KNIGHT_RUN_LEFT_URLS: readonly string[] = [
  knightRunLeft0,
  knightRunLeft1,
  knightRunLeft2,
  knightRunLeft3,
  knightRunLeft4,
  knightRunLeft5,
];

export const FOOD_URLS: Readonly<Record<ItemKind, string>> = {
  apple,
  bread,
  cherry,
  cheese,
  strawberry,
  cookie,
  tart,
  pineapple,
  waffles,
  honeycomb,
  grub,
  bug,
};

export const ALL_ASSET_URLS: readonly string[] = [
  ...KNIGHT_IDLE_URLS,
  ...KNIGHT_RUN_RIGHT_URLS,
  ...KNIGHT_RUN_LEFT_URLS,
  ...Object.values(FOOD_URLS),
];
