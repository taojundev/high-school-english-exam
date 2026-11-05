import { afterEach, describe, expect, it, vi } from 'vitest';
import { saveActive, saveAttempt, storageAvailable } from './storage';
import type { ActiveDraft, Attempt } from '../types';

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
});
