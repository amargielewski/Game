const MEMORY_FALLBACK = new Map<string, string>();

export function readStoredValue(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return MEMORY_FALLBACK.get(key) ?? null;
  }
}

export function writeStoredValue(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    MEMORY_FALLBACK.set(key, value);
  }
}
