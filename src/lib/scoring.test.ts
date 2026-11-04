import { describe, expect, it } from 'vitest';
import { generatePaper } from './exam';
import { countWords, keyPointCoverage, scoreAttempt, type AttemptMeta } from './scoring';
import type { Paper } from '../types';

const meta = (): AttemptMeta => ({
  startedAt: new Date('2026-01-01T09:00:00Z').toISOString(),
  submittedAt: new Date('2026-01-01T11:00:00Z').toISOString(),
  durationUsedSec: 7200,
  timeBySection: {},
  transcriptReveals: [],
  replayCounts: {},
});

function perfectAnswers(paper: Paper): Record<string, string> {
  const answers: Record<string, string> = {};
  for (const q of paper.questions) {
    if (q.type === 'mcq') answers[q.id] = String(q.answer);
    else if (q.type === 'fill' || q.type === 'vocab') answers[q.id] = q.answerText ?? '';
    else if (q.type === 'translation') answers[q.id] = q.reference ?? '';
    else if (q.type === 'summary' || q.type === 'writing') answers[q.id] = q.sample ?? '';
  }
  return answers;
}

describe('scoring', () => {
  it('gives full objective marks for a perfect paper', () => {
    const paper = generatePaper({ mode: 'full', seed: 55 });
    const attempt = scoreAttempt(paper, perfectAnswers(paper), meta());
    const objective = attempt.results.filter((r) => r.type === 'mcq' || r.type === 'fill' || r.type === 'vocab');
    expect(objective.every((r) => r.correct)).toBe(true);
    expect(attempt.sectionResults.find((s) => s.id === 'listening')?.score).toBe(25);
    expect(attempt.sectionResults.find((s) => s.id === 'reading')?.score).toBe(40);
    expect(attempt.sectionResults.find((s) => s.id === 'translation')?.score).toBe(15);
    expect(attempt.totalScore).toBeGreaterThanOrEqual(145);
  });

  it('gives zero for a blank paper', () => {
    const paper = generatePaper({ mode: 'full', seed: 56 });
    const attempt = scoreAttempt(paper, {}, meta());
    expect(attempt.totalScore).toBe(0);
    expect(attempt.results.every((r) => r.earned === 0)).toBe(true);
    expect(attempt.suggestions.length).toBeGreaterThan(0);
  });

  it('marks wrong grammar fill answers and accepts alternatives', () => {
    const paper = generatePaper({ mode: 'section', section: 'grammar', seed: 77 });
    const fill = paper.questions.find((q) => q.type === 'fill');
    expect(fill).toBeDefined();
    const answers = { [fill!.id]: 'definitely wrong' };
    const wrong = scoreAttempt(paper, answers, meta());
    expect(wrong.results.find((r) => r.id === fill!.id)?.earned).toBe(0);

    const accept = fill!.accept?.[0];
    if (accept) {
      const right = scoreAttempt(paper, { [fill!.id]: accept }, meta());
      expect(right.results.find((r) => r.id === fill!.id)?.earned).toBe(1);
    }
  });

  it('scores translation by key information coverage', () => {
    const paper = generatePaper({ mode: 'section', section: 'translation', seed: 88 });
    const q = paper.questions[0];
    const partial = scoreAttempt(paper, { [q.id]: q.reference?.split(' ').slice(0, 4).join(' ') ?? '' }, meta());
    const full = scoreAttempt(paper, { [q.id]: q.reference ?? '' }, meta());
    expect(partial.results[0].earned).toBeLessThan(full.results[0].earned);
    expect(full.results[0].earned).toBe(3);
    expect(full.results[0].covered?.every((c) => c.ok)).toBe(true);
  });

  it('scores summary and writing using coverage and language heuristics', () => {
    const paper = generatePaper({ mode: 'full', seed: 90 });
    const attempt = scoreAttempt(paper, perfectAnswers(paper), meta());
    const summary = attempt.results.find((r) => r.type === 'summary')!;
    const writing = attempt.results.find((r) => r.type === 'writing')!;
    expect(summary.earned).toBeGreaterThanOrEqual(9);
    expect(writing.earned).toBeGreaterThanOrEqual(21);
    expect(summary.covered?.every((c) => c.ok)).toBe(true);
    expect(writing.covered?.every((c) => c.ok)).toBe(true);
    expect(writing.feedback).toContain('内容要点');
  });

  it('builds tag stats and weak-point suggestions', () => {
    const paper = generatePaper({ mode: 'section', section: 'reading', seed: 92 });
    const attempt = scoreAttempt(paper, {}, meta());
    expect(attempt.tagStats.length).toBeGreaterThan(0);
    expect(attempt.suggestions.filter((s) => s.priority === 'high').length).toBeGreaterThan(0);
    expect(attempt.suggestions.filter((s) => s.priority === 'high').length).toBeLessThanOrEqual(2);
    expect(attempt.suggestions.length).toBeLessThanOrEqual(6);
    expect(attempt.sectionResults[0].accuracy).toBe(0);
  });

  it('counts English words without counting punctuation', () => {
    expect(countWords("It's a well-known fact, isn't it?")).toBe(6);
    expect(countWords('')).toBe(0);
  });

  it('matches key points with case-insensitive regexes', () => {
    const covered = keyPointCoverage('NOT UNTIL midnight did he realize...', [
      { label: 'not until', patterns: ['\\bnot until\\b'] },
      { label: 'realize', patterns: ['\\brealiz'] },
      { label: 'missing', patterns: ['\\bxyz\\b'] },
    ]);
    expect(covered.map((c) => c.ok)).toEqual([true, true, false]);
  });
});
