import type { ActiveDraft, Attempt, Settings } from '../types';

const KEYS = {
  attempts: 'sh-exam.attempts.v1',
  active: 'sh-exam.active.v1',
  seen: 'sh-exam.seen.v1',
  settings: 'sh-exam.settings.v1',
};

const MAX_ATTEMPTS = 20;
const MAX_SEEN = 400;

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

export function saveAttempt(attempt: Attempt): void {
  const list = loadAttempts().filter((a) => a.id !== attempt.id);
  list.unshift(attempt);
  write(KEYS.attempts, list.slice(0, MAX_ATTEMPTS));
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

export function clearActive(): void {
  if (!available()) return;
  try {
    window.localStorage.removeItem(KEYS.active);
  } catch {
    // ignore
  }
}

export function loadSeen(): string[] {
  const list = read<string[]>(KEYS.seen, []);
  return Array.isArray(list) ? list : [];
}

export function markSeen(ids: string[]): void {
  const existing = loadSeen();
  const merged = [...new Set([...ids, ...existing])].slice(0, MAX_SEEN);
  write(KEYS.seen, merged);
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
