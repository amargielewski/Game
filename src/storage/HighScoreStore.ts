import { GAME_CONFIG } from '../config/GameConfig';
import { readStoredValue, writeStoredValue } from './safeLocalStorage';

export interface HighScoreEntry {
  readonly name: string;
  readonly points: number;
}

function isValidEntry(candidate: unknown): candidate is HighScoreEntry {
  if (typeof candidate !== 'object' || candidate === null) {
    return false;
  }

  const entry = candidate as Partial<HighScoreEntry>;

  return typeof entry.name === 'string' && Number.isFinite(entry.points);
}

export class HighScoreStore {
  public list(): readonly HighScoreEntry[] {
    const raw = readStoredValue(GAME_CONFIG.storage.highScoresKey);

    if (raw === null) {
      return [];
    }

    try {
      return this.parseEntries(JSON.parse(raw) as unknown);
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
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter(isValidEntry)
      .sort((first, second) => second.points - first.points)
      .slice(0, GAME_CONFIG.scoring.maxRankingEntries);
  }
}
