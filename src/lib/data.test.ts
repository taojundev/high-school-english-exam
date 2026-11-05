import { describe, expect, it } from 'vitest';
import { BANK } from '../data';

const allIds = [
  ...BANK.listeningShort.map((x) => x.id),
  ...BANK.listeningLong.flatMap((x) => [x.id, ...x.questions.map((q) => q.id)]),
  ...BANK.grammarMcq.map((x) => x.id),
  ...BANK.grammarFill.map((x) => x.id),
  ...BANK.vocabulary.map((x) => x.id),
  ...BANK.cloze.map((x) => x.id),
  ...BANK.reading.flatMap((x) => [x.id, ...x.questions.map((q) => q.id)]),
  ...BANK.translation.map((x) => x.id),
  ...BANK.summary.map((x) => x.id),
  ...BANK.writing.map((x) => x.id),
];

const mcqs = [
  ...BANK.listeningShort,
  ...BANK.listeningLong.flatMap((x) => x.questions),
  ...BANK.grammarMcq,
  ...BANK.reading.flatMap((x) => x.questions),
  ...BANK.cloze.flatMap((x) => x.blanks),
];

describe('question bank integrity', () => {
  it('has unique ids', () => {
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it('has valid multiple-choice answers', () => {
    for (const item of mcqs) {
      expect(item.options.length).toBeGreaterThanOrEqual(4);
      expect(new Set(item.options).size).toBe(item.options.length);
      expect(item.answer).toBeGreaterThanOrEqual(0);
      expect(item.answer).toBeLessThan(item.options.length);
      expect(item.options[item.answer].trim().length).toBeGreaterThan(0);
    }
  });

  it('has 15 cloze blanks with matching markers', () => {
    expect(BANK.cloze.length).toBeGreaterThanOrEqual(5);
    for (const passage of BANK.cloze) {
      expect(passage.blanks).toHaveLength(15);
      const markers = [...passage.text.matchAll(/\((\d+)\)\s*_{2,}/g)].map((m) => Number(m[1]));
      expect(markers).toEqual(Array.from({ length: 15 }, (_, i) => i + 1));
    }
  });

  it('has 5 reading questions and 3 long-listening questions per set', () => {
    for (const passage of BANK.reading) expect(passage.questions).toHaveLength(5);
    for (const group of BANK.listeningLong) expect(group.questions).toHaveLength(3);
  });

  it('has unique vocabulary answers and enough distractors', () => {
    const answers = BANK.vocabulary.map((v) => v.answer.toLowerCase());
    expect(new Set(answers).size).toBe(answers.length);
    for (const item of BANK.vocabulary) {
      expect(item.distractors).toHaveLength(3);
      expect(item.sentence).toContain('______');
      expect(item.distractors.map((d) => d.toLowerCase())).not.toContain(item.answer.toLowerCase());
    }
  });

  it('has enough reading and short-listening material for the five-paper rotation', () => {
    expect(BANK.reading.length).toBeGreaterThanOrEqual(24);
    expect(BANK.listeningShort.length).toBeGreaterThanOrEqual(40);
    expect(new Set(BANK.reading.map((r) => r.id)).size).toBe(BANK.reading.length);
    expect(new Set(BANK.listeningShort.map((s) => s.id)).size).toBe(BANK.listeningShort.length);
  });

  it('has complete subjective task metadata', () => {
    for (const item of BANK.translation) {
      expect(item.keyPoints).toHaveLength(3);
      expect(item.reference.length).toBeGreaterThan(10);
    }
    for (const item of BANK.summary) {
      expect(item.keyPoints).toHaveLength(5);
      expect(item.sample.split(/\s+/).length).toBeGreaterThanOrEqual(item.minWords - 10);
      expect(item.sample.split(/\s+/).length).toBeLessThanOrEqual(item.maxWords + 10);
    }
    for (const item of BANK.writing) {
      expect(item.keyPoints.length).toBeGreaterThanOrEqual(4);
      expect(item.requirements.length).toBeGreaterThanOrEqual(3);
      const words = item.sample.split(/\s+/).filter(Boolean).length;
      expect(words).toBeGreaterThanOrEqual(item.minWords - 10);
      expect(words).toBeLessThanOrEqual(item.maxWords + 10);
    }
  });

  it('uses valid difficulty levels and non-empty prompts', () => {
    const items = [
      ...BANK.listeningShort,
      ...BANK.listeningLong,
      ...BANK.grammarMcq,
      ...BANK.grammarFill,
      ...BANK.vocabulary,
      ...BANK.cloze,
      ...BANK.reading,
      ...BANK.translation,
      ...BANK.summary,
      ...BANK.writing,
    ];
    for (const item of items) {
      expect([1, 2, 3]).toContain(item.difficulty);
    }
    for (const item of BANK.grammarFill) expect(item.answer.trim().length).toBeGreaterThan(0);
    for (const item of BANK.vocabulary) expect(item.explanation.trim().length).toBeGreaterThan(0);
  });
});
