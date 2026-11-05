import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  loadReview,
  loadSeen,
  loadSeenHistory,
  markSeen,
  saveActive,
  saveAttempt,
  storageAvailable,
} from './storage';
import { BANK } from '../data';
import { generatePaper } from './exam';
import type { ActiveDraft, Attempt } from '../types';

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

function failingStorage() {
  return {
    getItem: () => null,
    setItem: () => {
      throw new Error('QuotaExceededError');
    },
    removeItem: () => undefined,
  };
}

describe('storage failure handling', () => {
  it('reports a failed attempt write instead of pretending it succeeded', () => {
    vi.stubGlobal('window', { localStorage: failingStorage() });
    const attempt = { id: 'a1' } as Attempt;
    expect(saveAttempt(attempt)).toBe(false);
    expect(storageAvailable()).toBe(false);
  });

  it('reports a failed draft write so the exam can keep and export it', () => {
    vi.stubGlobal('window', { localStorage: failingStorage() });
    const draft = { paper: { id: 'p1' } } as ActiveDraft;
    expect(saveActive(draft)).toBe(false);
  });

  it('keeps the reviewed mark for ids pushed out of the 400-id seen window', () => {
    vi.stubGlobal('window', { localStorage: memoryStorage() });
    markSeen(['old-01', 'old-02']);
    expect(loadSeen()).toEqual(['old-01', 'old-02']);

    const fresh = Array.from({ length: 405 }, (_, index) => `new-${index}`);
    markSeen(fresh);

    const seen = loadSeen();
    expect(seen).toHaveLength(400);
    // The two oldest ids fell out of the hot list...
    expect(seen).not.toContain('old-01');
    expect(seen).not.toContain('old-02');
    // ...but stay practised through the persistent review set, so they are still marked as review.
    expect(loadReview()).toEqual(expect.arrayContaining(['old-01', 'old-02']));

    markSeen(['new-999']);
    expect(loadReview()).toEqual(expect.arrayContaining(['old-01', 'old-02']));
    expect(loadSeen()).toHaveLength(400);
    expect(loadSeen()).not.toContain('old-01');
  });

  it('still flags an evicted question as review when the next paper is built', () => {
    vi.stubGlobal('window', { localStorage: memoryStorage() });
    // Every short dialogue counts as practised; the target is the oldest, so it is evicted first.
    const target = BANK.listeningShort[0];
    const others = BANK.listeningShort.slice(1).map((item) => item.id);
    markSeen([target.id]);
    markSeen([...others, ...Array.from({ length: 400 }, (_, index) => `filler-${index}`)]);

    expect(loadSeen()).not.toContain(target.id);
    expect(loadReview()).toContain(target.id);

    const paper = generatePaper({
      mode: 'section',
      section: 'listening',
      seed: 3,
      seenIds: loadSeenHistory(),
    });
    const recycled = paper.questions.find((q) => q.sourceId === target.id);
    expect(recycled).toBeDefined();
    // The review mark must survive even though the id was pushed out of the recent-seen window.
    expect(recycled?.review).toBe(true);
  });
});
