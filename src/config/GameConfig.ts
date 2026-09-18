import type { ItemKind } from './items';

const isPortraitViewport = typeof window !== 'undefined' && window.innerHeight > window.innerWidth;
const designWidth = isPortraitViewport ? 720 : 1280;
const designHeight = isPortraitViewport ? 1280 : 720;
const groundY = designHeight - 56;
const worldUnit = Math.min(designWidth, designHeight);

const PLAYER_CROSSING_SECONDS = 1.25;
const PLAYER_CATCH_WIDTH_RATIO = 0.075;
const SPAWN_MARGIN_RATIO = 0.06;
const JUMP_APEX_RATIO = 0.26;
const BONUS_LANE_RATIO = 0.28;

const HUD_FONT = '"Press Start 2P", ui-monospace, monospace';

const HUD_LABEL_STYLE = {
  fontFamily: HUD_FONT,
  fontSize: 24,
  fill: 0xffffff,
  dropShadow: true,
  dropShadowAlpha: 1,
  dropShadowAngle: Math.PI / 4,
  dropShadowBlur: 0,
  dropShadowDistance: 4,
  dropShadowColor: 0x101020,
} as const;

export const GAME_CONFIG = {
  arena: {
    designWidth,
    designHeight,
    groundY,
    backgroundColor: 0x0b0b12,
    maxDeltaSeconds: 0.1,
  },
  player: {
    speed: designWidth / PLAYER_CROSSING_SECONDS,
    scale: 1.5,
    catchWidth: designWidth * PLAYER_CATCH_WIDTH_RATIO,
    catchHeight: 104,
    jumpApexHeight: worldUnit * JUMP_APEX_RATIO,
    jumpRiseSeconds: 0.38,
    airControlFactor: 0.6,
    runAnimationSpeed: 0.22,
    idleAnimationSpeed: 0.1,
    airborneFrameIndex: 3,
    airborneStretch: 1.1,
    airborneNarrowing: 0.92,
  },
  items: {
    size: 64,
    spawnMargin: designWidth * SPAWN_MARGIN_RATIO,
    offScreenCullMargin: 160,
    maxSpin: 1.6,
  },
  bonus: {
    kind: 'honeycomb' satisfies ItemKind,
    laneY: groundY - worldUnit * BONUS_LANE_RATIO,
    intervalSeconds: 13,
    crossingSeconds: 3.6,
  },
  scoring: {
    startingLives: 10,
    maxRankingEntries: 10,
    maxNameLength: 12,
  },
  input: {
    leftKeys: ['ArrowLeft', 'KeyA'],
    rightKeys: ['ArrowRight', 'KeyD'],
    jumpKeys: ['Space', 'ArrowUp', 'KeyW'],
    pauseKeys: ['Escape', 'KeyP'],
    jumpTouchAreaRatio: 0.3,
  },
  hud: {
    labelStyle: HUD_LABEL_STYLE,
    bannerStyle: { ...HUD_LABEL_STYLE, fontSize: 44, fill: 0xffd24a },
    scorePosition: { x: 28, y: 26 },
    heartsPosition: { x: designWidth - 28, y: 34 },
    heartSpacing: 34,
    bannerSeconds: 1.6,
    bannerOffsetY: -60,
  },
  hearts: {
    pixelRows: ['01100110', '11111111', '11111111', '11111111', '01111110', '00111100', '00011000'],
    pixelSize: 4,
    fullColor: 0xe63946,
    emptyColor: 0x3d3d55,
  },
  background: {
    skyBands: [0x1b2a4a, 0x26406b, 0x33578c, 0x4479b4, 0x5fa0cf, 0x86c6e4],
    grassColor: 0x5a9e4a,
    grassHeight: 10,
    grassShadowColor: 0x3c7434,
    grassShadowHeight: 16,
    dirtColor: 0x6b4a2f,
    cloudColor: 0xf2f6ff,
    cloudAlpha: 0.9,
    cloudPixel: 12,
    cloudShape: ['00111100', '01111110', '11111111', '01111110'],
    cloudLayout: [
      { y: 96, scale: 1, speed: 12 },
      { y: 188, scale: 0.7, speed: 20 },
      { y: 58, scale: 0.5, speed: 30 },
      { y: 256, scale: 0.85, speed: 16 },
    ],
  },
  particles: {
    sparkSize: 6,
    baseColor: 0xffffff,
    perBurst: 14,
    lifeSeconds: 0.55,
    gravity: 900,
    minSpeed: 120,
    speedSpread: 180,
    upwardBias: 120,
    minScale: 0.3,
    scaleSpread: 0.5,
  },
  audio: {
    defaultVolume: 0.6,
    volumeSliderMax: 100,
    catchTone: { frequency: 720, durationSeconds: 0.12, type: 'triangle', gain: 0.5 },
    penaltyTone: { frequency: 180, durationSeconds: 0.22, type: 'sawtooth', gain: 0.35 },
    missTone: { frequency: 240, durationSeconds: 0.18, type: 'square', gain: 0.3 },
    sequenceTone: { durationSeconds: 0.14, type: 'triangle', gain: 0.4 },
    levelFrequencies: [660, 880, 1180],
    levelStepSeconds: 0.09,
    gameOverFrequencies: [420, 330, 240],
    gameOverStepSeconds: 0.16,
  },
  storage: {
    highScoresKey: 'feast-knight.high-scores',
    soundEnabledKey: 'feast-knight.sound-enabled',
    volumeKey: 'feast-knight.volume',
    localeKey: 'feast-knight.locale',
    guideSeenKey: 'feast-knight.guide-seen',
  },
  dom: {
    hostElementId: 'app',
    rankingRowTemplateId: 'ranking-row',
    foodRowTemplateId: 'food-row',
  },
} as const;
