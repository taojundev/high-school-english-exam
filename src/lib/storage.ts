import type { ActiveDraft, Attempt, Settings } from '../types';

const KEYS = {
  attempts: 'sh-exam.attempts.v1',
  active: 'sh-exam.active.v1',
  seen: 'sh-exam.seen.v1',
  review: 'sh-exam.review.v1',
  settings: 'sh-exam.settings.v1',
};

const MAX_ATTEMPTS = 20;
const MAX_SEEN = 400;
const MAX_REVIEW = 2000;

function available(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function read<T>(key: string, fallback: T): T {
  if (!available()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): boolean {
  if (!available()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function loadAttempts(): Attempt[] {
  const list = read<Attempt[]>(KEYS.attempts, []);
  return Array.isArray(list) ? list : [];
}

export function saveAttempt(attempt: Attempt): boolean {
  const list = loadAttempts().filter((a) => a.id !== attempt.id);
  list.unshift(attempt);
  return write(KEYS.attempts, list.slice(0, MAX_ATTEMPTS));
}

export function getAttempt(id: string): Attempt | undefined {
  return loadAttempts().find((a) => a.id === id);
}

export function deleteAttempt(id: string): void {
  write(
    KEYS.attempts,
    loadAttempts().filter((a) => a.id !== id),
  );
}

export function clearAttempts(): void {
  write(KEYS.attempts, []);
}

export function loadActive(): ActiveDraft | undefined {
  const draft = read<ActiveDraft | null>(KEYS.active, null);
  return draft ?? undefined;
}

export function saveActive(draft: ActiveDraft): boolean {
  return write(KEYS.active, draft);
}

export function clearActive(): boolean {
  if (!available()) return false;
  try {
    window.localStorage.removeItem(KEYS.active);
    return true;
  } catch {
    return false;
  }
}

export function loadSeen(): string[] {
  const list = read<string[]>(KEYS.seen, []);
  return Array.isArray(list) ? list : [];
}

/** Ids that fell out of the recent-seen window; they still count as practised for review flags. */
export function loadReview(): string[] {
  const list = read<string[]>(KEYS.review, []);
  return Array.isArray(list) ? list : [];
}

/**
 * Recent and evicted ids in recency order: newest first, evicted ones last.
 * A re-practised id can appear in both sets; keep its most recent (first) position so it is
 * not mistaken for the least recently practised question.
 */
export function loadSeenHistory(): string[] {
  return [...new Set([...loadSeen(), ...loadReview()])];
}

export function markSeen(ids: string[]): void {
  const existing = loadSeen();
  const merged = [...new Set([...ids, ...existing])];
  const kept = merged.slice(0, MAX_SEEN);
  const evicted = merged.slice(MAX_SEEN);
  write(KEYS.seen, kept);
  if (evicted.length > 0) {
    // Evicted ids move into a persistent review set so they keep their "practised" mark.
    const review = [...new Set([...loadReview(), ...evicted])].slice(-MAX_REVIEW);
    write(KEYS.review, review);
  }
}

export function loadSettings(): Settings {
  return read<Settings>(KEYS.settings, { name: '', speechRate: 0.95, autoNext: true });
}

export function saveSettings(settings: Settings): void {
  write(KEYS.settings, settings);
}

export function storageAvailable(): boolean {
  if (!available()) return false;
  try {
    const key = 'sh-exam.probe';
    window.localStorage.setItem(key, '1');
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
