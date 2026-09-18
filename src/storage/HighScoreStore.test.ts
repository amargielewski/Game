import { beforeEach, describe, expect, it } from 'vitest';
import { HighScoreStore } from './HighScoreStore';
import { GAME_CONFIG } from '../config/GameConfig';
import { writeStoredValue } from './safeLocalStorage';

describe('HighScoreStore', () => {
  let store: HighScoreStore;

  beforeEach(() => {
    store = new HighScoreStore();
    store.clear();
  });

  it('keeps the table sorted and capped at ten entries', () => {
    for (let index = 1; index <= 14; index += 1) {
      store.submit(`player${index}`, index);
    }

    const entries = store.list();

    expect(entries).toHaveLength(10);
    expect(entries[0]?.points).toBe(14);
    expect(entries[9]?.points).toBe(5);
  });

  it('trims and truncates a submitted name', () => {
    store.submit('   a-very-long-player-name   ', 999);

    expect(store.list()[0]?.name).toBe('a-very-long-');
  });

  it('rejects a zero score as a record', () => {
    expect(store.qualifies(0)).toBe(false);
  });
});

describe('HighScoreStore reading tampered storage', () => {
  it('returns entries sorted even when the stored order is wrong', () => {
    writeStoredValue(
      GAME_CONFIG.storage.highScoresKey,
      JSON.stringify([
        { name: 'low', points: 3 },
        { name: 'high', points: 90 },
        { name: 'broken' },
        'nonsense',
      ]),
    );

    const entries = new HighScoreStore().list();

    expect(entries.map((entry) => entry.name)).toEqual(['high', 'low']);
  });

  it('drops a score too large to be a finite number', () => {
    writeStoredValue(
      GAME_CONFIG.storage.highScoresKey,
      '[{"name":"overflow","points":1e999},{"name":"honest","points":7}]',
    );

    expect(new HighScoreStore().list()).toEqual([{ name: 'honest', points: 7 }]);
  });

  it('keeps only the name and the points of a stored entry', () => {
    writeStoredValue(
      GAME_CONFIG.storage.highScoresKey,
      '[{"name":"padded","points":4,"injected":"payload"}]',
    );

    expect(new HighScoreStore().list()).toEqual([{ name: 'padded', points: 4 }]);
  });

  it.each(['{"name":"solo","points":5}', 'not json', 'null'])(
    'reads %s as an empty table',
    (stored) => {
      writeStoredValue(GAME_CONFIG.storage.highScoresKey, stored);

      expect(new HighScoreStore().list()).toEqual([]);
    },
  );
});
