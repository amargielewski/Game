import * as z from 'zod/mini';
import { GAME_CONFIG } from '../config/gameConfig';
import { readStoredValue, writeStoredValue } from './safeLocalStorage';

const HIGH_SCORE_ENTRY_SCHEMA = z.object({ name: z.string(), points: z.number() });
const STORED_LIST_SCHEMA = z.array(z.unknown());

export type HighScoreEntry = Readonly<z.infer<typeof HIGH_SCORE_ENTRY_SCHEMA>>;

export class HighScoreStore {
  public list(): readonly HighScoreEntry[] {
    const raw = readStoredValue(GAME_CONFIG.storage.highScoresKey);

    if (raw === null) {
      return [];
    }

    try {
      return this.parseEntries(JSON.parse(raw));
    } catch {
      return [];
    }
  }

  public clear(): void {
    writeStoredValue(GAME_CONFIG.storage.highScoresKey, '[]');
  }

  public qualifies(points: number): boolean {
    if (points <= 0) {
      return false;
    }

    const entries = this.list();
    const weakest = entries[entries.length - 1];

    return (
      entries.length < GAME_CONFIG.scoring.maxRankingEntries ||
      weakest === undefined ||
      points > weakest.points
    );
  }

  public submit(name: string, points: number): void {
    const entries = [...this.list(), { name: this.sanitizeName(name), points }]
      .sort((first, second) => second.points - first.points)
      .slice(0, GAME_CONFIG.scoring.maxRankingEntries);

    writeStoredValue(GAME_CONFIG.storage.highScoresKey, JSON.stringify(entries));
  }

  private sanitizeName(name: string): string {
    return name.trim().slice(0, GAME_CONFIG.scoring.maxNameLength);
  }

  private parseEntries(value: unknown): readonly HighScoreEntry[] {
    const storedList = STORED_LIST_SCHEMA.safeParse(value);

    if (!storedList.success) {
      return [];
    }

    return storedList.data
      .flatMap((candidate) => {
        const entry = HIGH_SCORE_ENTRY_SCHEMA.safeParse(candidate);

        return entry.success ? [entry.data] : [];
      })
      .sort((first, second) => second.points - first.points)
      .slice(0, GAME_CONFIG.scoring.maxRankingEntries);
  }
}
