import { describe, expect, it } from 'vitest';
import { BANK } from '../data';
import { generatePaper, groupQuestions, paperReplayOptions, paperSourceIds } from './exam';
import type { Paper } from '../types';

const sectionPoints = (paper: Paper) =>
  Object.fromEntries(paper.sections.map((s) => [s.id, s.points]));

describe('generatePaper', () => {
  it('builds a 150-point full paper with the expected structure', () => {
    const paper = generatePaper({ mode: 'full', seed: 20240601 });
    expect(paper.questions).toHaveLength(78);
    expect(paper.maxScore).toBe(150);
    expect(paper.durationMin).toBe(120);
    expect(sectionPoints(paper)).toEqual({
      listening: 25,
      grammar: 10,
      vocabulary: 10,
      cloze: 15,
      reading: 40,
      translation: 15,
      summary: 10,
      writing: 25,
    });
    expect(paper.sections).toHaveLength(8);
  });

  it('is deterministic for the same seed', () => {
    const a = generatePaper({ mode: 'full', seed: 42 });
    const b = generatePaper({ mode: 'full', seed: 42 });
    expect(paperSourceIds(a)).toEqual(paperSourceIds(b));
    expect(a.questions.map((q) => q.options)).toEqual(b.questions.map((q) => q.options));
    expect(a.questions.map((q) => q.answer)).toEqual(b.questions.map((q) => q.answer));
  });

  it('produces unique question keys and valid answers', () => {
    const paper = generatePaper({ mode: 'full', seed: 7 });
    expect(new Set(paper.questions.map((q) => q.id)).size).toBe(paper.questions.length);
    expect(new Set(paper.questions.map((q) => q.number)).size).toBe(paper.questions.length);
    for (const q of paper.questions) {
      if (q.type === 'mcq') {
        expect(q.options).toBeDefined();
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.options!.length);
        expect(q.options![q.answer!]).toBe(q.answerText);
      }
      if (q.type === 'fill' || q.type === 'vocab') {
        expect(Boolean(q.answerText)).toBe(true);
      }
    }
  });

  it('builds 11 unique words for each vocabulary bank', () => {
    const paper = generatePaper({ mode: 'full', seed: 99 });
    const banks = Object.values(paper.wordBanks);
    expect(banks).toHaveLength(1);
    expect(banks[0]).toHaveLength(11);
    expect(new Set(banks[0].map((w) => w.toLowerCase())).size).toBe(11);
    const vocab = paper.questions.filter((q) => q.type === 'vocab');
    expect(vocab).toHaveLength(10);
    for (const q of vocab) expect(banks[0]).toContain(q.answerText);
  });

  it('supports section practice with the right size', () => {
    const expected = {
      listening: 15,
      grammar: 10,
      vocabulary: 10,
      cloze: 15,
      reading: 20,
      translation: 15,
      summary: 10,
      writing: 25,
    } as const;
    for (const [section, points] of Object.entries(expected)) {
      const paper = generatePaper({
        mode: 'section',
        section: section as keyof typeof expected,
        seed: 123,
      });
      expect(paper.sections).toHaveLength(1);
      expect(paper.sections[0].id).toBe(section);
      expect(paper.maxScore).toBe(points);
      expect(paper.durationMin).toBeGreaterThan(0);
    }
  });

  it('honours the basic difficulty preference', () => {
    const paper = generatePaper({ mode: 'full', seed: 11, difficulty: 'basic' });
    expect(Math.max(...paper.questions.map((q) => q.difficulty))).toBeLessThanOrEqual(2);
  });

  it('honours the advanced difficulty preference', () => {
    const paper = generatePaper({ mode: 'full', seed: 11, difficulty: 'advanced' });
    expect(paper.questions.filter((q) => q.difficulty === 3).length).toBeGreaterThan(3);
    const avg = paper.questions.reduce((n, q) => n + q.difficulty, 0) / paper.questions.length;
    expect(avg).toBeGreaterThan(1.9);
  });

  it('reproduces the same paper from the stored seed and difficulty', () => {
    const original = generatePaper({ mode: 'full', seed: 42, difficulty: 'basic' });
    expect(original.difficulty).toBe('basic');
    const replay = generatePaper({ mode: original.mode, seed: original.seed, difficulty: original.difficulty });
    expect(paperSourceIds(replay)).toEqual(paperSourceIds(original));
    expect(replay.questions.map((q) => q.id)).toEqual(original.questions.map((q) => q.id));

    // Without the difficulty the paper really is different: the stored field is what makes replay work.
    const withoutDifficulty = generatePaper({ mode: original.mode, seed: original.seed });
    expect(paperSourceIds(withoutDifficulty)).not.toEqual(paperSourceIds(original));
  });

  it('rebuilds the stored paper from the result page replay options', () => {
    const original = generatePaper({ mode: 'full', seed: 42, difficulty: 'basic' });
    const options = paperReplayOptions(original);
    expect(options.mode).toBe('full');
    expect(options.section).toBeUndefined();
    expect(options.seed).toBe(42);
    expect(options.difficulty).toBe('basic');
    const replay = generatePaper(options);
    expect(replay.difficulty).toBe(original.difficulty);
    expect(paperSourceIds(replay)).toEqual(paperSourceIds(original));

    const practice = generatePaper({ mode: 'section', section: 'reading', seed: 7 });
    expect(paperReplayOptions(practice).section).toBe('reading');
  });

  it('avoids recently seen source ids when possible', () => {
    const first = generatePaper({ mode: 'section', section: 'reading', seed: 5 });
    const seen = first.questions.map((q) => q.sourceId);
    const second = generatePaper({ mode: 'section', section: 'reading', seed: 6, seenIds: seen });
    const overlap = second.questions.filter((q) => seen.includes(q.sourceId));
    expect(overlap.length).toBe(0);
  });

  it('groups questions by context', () => {
    const paper = generatePaper({ mode: 'full', seed: 3 });
    const reading = paper.questions.filter((q) => q.section === 'reading');
    const groups = groupQuestions(reading);
    expect(groups).toHaveLength(4);
    for (const group of groups) {
      expect(group).toHaveLength(5);
      expect(new Set(group.map((q) => q.groupId)).size).toBe(1);
    }
  });

  it('has a bank large enough for varied papers', () => {
    expect(BANK.listeningShort.length).toBeGreaterThanOrEqual(40);
    expect(BANK.reading.length).toBeGreaterThanOrEqual(24);
    expect(BANK.cloze.length).toBeGreaterThanOrEqual(5);
    expect(BANK.translation.length).toBeGreaterThanOrEqual(30);
    expect(BANK.writing.length).toBeGreaterThanOrEqual(12);
  });

  it('does not repeat reading passages across six consecutive full papers', () => {
    const seen: string[] = [];
    for (let i = 0; i < 6; i++) {
      const paper = generatePaper({ mode: 'full', seed: 5000 + i, seenIds: seen });
      const reading = paper.questions.filter((q) => q.section === 'reading');
      expect(reading.every((q) => !q.review)).toBe(true);
      seen.push(...paperSourceIds(paper));
    }
  });

  it('marks unavoidable repeats as review items', () => {
    const seen: string[] = [];
    const papers: Paper[] = [];
    for (let i = 0; i < 5; i++) {
      const paper = generatePaper({ mode: 'full', seed: 6000 + i, seenIds: seen });
      papers.push(paper);
      seen.push(...paperSourceIds(paper));
    }
    const shortOf = (paper: Paper) =>
      paper.questions.filter((q) => q.section === 'listening' && q.groupId.startsWith('ls-'));
    for (const paper of papers.slice(0, 4)) {
      expect(shortOf(paper).every((q) => !q.review)).toBe(true);
    }
    // 40 short dialogues cover four papers (10 each); the fifth must recycle and say so.
    expect(shortOf(papers[4]).every((q) => q.review)).toBe(true);
    expect(papers[4].questions.some((q) => q.review)).toBe(true);
  });

  it('takes the 11th vocabulary word from unselected distractors, never from answers', () => {
    const allAnswers = new Set(BANK.vocabulary.map((v) => v.answer.toLowerCase()));
    for (let seed = 1; seed <= 12; seed++) {
      const paper = generatePaper({ mode: 'full', seed, seenIds: [] });
      const words = Object.values(paper.wordBanks)[0];
      expect(words).toHaveLength(11);
      expect(new Set(words.map((w) => w.toLowerCase())).size).toBe(11);
      const vocabAnswers = new Set(
        paper.questions.filter((q) => q.type === 'vocab').map((q) => (q.answerText ?? '').toLowerCase()),
      );
      const extra = words.find((w) => !vocabAnswers.has(w.toLowerCase()));
      expect(extra).toBeDefined();
      expect(allAnswers.has(extra!.toLowerCase())).toBe(false);
    }
  });
});
