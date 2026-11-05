import { describe, expect, it } from 'vitest';
import { BANK } from '../data';
import { generatePaper } from './exam';
import { buildSuggestions } from './advice';
import { gradeFor } from './format';
import {
  countWords,
  hasObjectiveMarks,
  isEstimatedResult,
  isSubjectiveOnly,
  keyPointCoverage,
  scoreAttempt,
  attemptScoreSplit,
  scoreSplit,
  type AttemptMeta,
} from './scoring';
import { isReviewWrong, reviewBadge } from './review';
import type { ExamQuestion, Paper, QuestionResult, SectionId, SectionResult } from '../types';

const meta = (): AttemptMeta => ({
  startedAt: new Date('2026-01-01T09:00:00Z').toISOString(),
  submittedAt: new Date('2026-01-01T11:00:00Z').toISOString(),
  durationUsedSec: 7200,
  timeBySection: {},
  transcriptReveals: [],
  replayCounts: {},
});

function paperWith(questions: Omit<ExamQuestion, 'id' | 'number'>[], contexts: Paper['contexts'] = {}): Paper {
  const built = questions.map((q, index) => ({ ...q, id: `q${index + 1}`, number: index + 1 }));
  const bySection = new Map<SectionId, ExamQuestion[]>();
  for (const q of built) bySection.set(q.section, [...(bySection.get(q.section) ?? []), q]);
  return {
    version: 1,
    id: 'test-paper',
    seed: 1,
    createdAt: new Date().toISOString(),
    mode: 'section',
    title: 'test',
    durationMin: 120,
    sections: [...bySection].map(([id, list]) => ({
      id,
      name: id,
      en: id,
      points: list.reduce((n, q) => n + q.points, 0),
      minutes: 20,
      instructions: '',
      questionIds: list.map((q) => q.id),
    })),
    questions: built,
    contexts,
    wordBanks: {},
    maxScore: built.reduce((n, q) => n + q.points, 0),
  };
}

function translationPaper(item: (typeof BANK.translation)[number]): Paper {
  return paperWith([
    {
      sourceId: item.id,
      section: 'translation',
      type: 'translation',
      points: 3,
      difficulty: item.difficulty,
      tags: item.tags,
      groupId: `tr-${item.id}`,
      stem: item.chinese,
      reference: item.reference,
      keyPoints: item.keyPoints,
      tips: item.tips,
    },
  ]);
}

const TEST_FUNCTION_WORDS = new Set([
  'a',
  'an',
  'the',
  'this',
  'that',
  'these',
  'those',
  'it',
  'its',
  'they',
  'them',
  'their',
  'i',
  'me',
  'my',
  'we',
  'us',
  'our',
  'you',
  'your',
  'he',
  'him',
  'his',
  'she',
  'her',
  'of',
  'to',
  'in',
  'on',
  'at',
  'by',
  'for',
  'with',
  'about',
  'into',
  'from',
  'as',
  'than',
  'and',
  'or',
  'but',
  'so',
  'if',
  'when',
  'while',
  'because',
  'although',
  'though',
  'is',
  'am',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'do',
  'does',
  'did',
  'can',
  'could',
  'will',
  'would',
  'shall',
  'should',
  'may',
  'might',
  'must',
  'has',
  'have',
  'had',
  'not',
  'no',
  'very',
  'more',
  'most',
  'also',
  'there',
  'here',
]);

const tokenize = (text: string) => text.match(/[A-Za-z0-9][A-Za-z0-9'’\-]*/g) ?? [];

/** First key-point keyword plus the next 1..3 function words of the reference. */
function truncatedVariants(reference: string, patterns: string[]): string[] {
  const words = tokenize(reference);
  let start = 0;
  let end = 0;
  for (const pattern of patterns) {
    let regex: RegExp;
    try {
      regex = new RegExp(pattern, 'i');
    } catch {
      continue;
    }
    const match = regex.exec(reference);
    if (!match) continue;
    start = tokenize(reference.slice(0, match.index)).length;
    end = start + Math.max(0, tokenize(match[0]).length - 1);
    break;
  }
  const base = words.slice(start, end + 1);
  return [1, 2, 3].map((wanted) => {
    const extra: string[] = [];
    for (let i = end + 1; i < words.length && extra.length < wanted; i++) {
      if (TEST_FUNCTION_WORDS.has(words[i].toLowerCase().replace(/’/g, "'"))) extra.push(words[i]);
    }
    return [...base, ...extra].join(' ');
  });
}

function expectEstimated(result: QuestionResult, label?: string) {
  expect(result.graded, label).toBe('estimated');
  expect(result.correct, label).toBeUndefined();
}

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
    expect(attempt.sectionResults.find((s) => s.id === 'translation')?.score).toBe(12.5);
    expect(attempt.objectiveScore).toBe(100);
    expect(attempt.objectiveMax).toBe(100);
    expect(attempt.subjectiveEstimate).toBe(44);
    expect(attempt.subjectiveMax).toBe(50);
    expect(attempt.totalScore).toBe(144);
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
    expect(full.results[0].earned).toBe(2.5);
    expectEstimated(full.results[0]);
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

  it('does not reward a keyword list as a translation', () => {
    const item = BANK.translation[0];
    const paper = paperWith([
      {
        sourceId: item.id,
        section: 'translation',
        type: 'translation',
        points: 3,
        difficulty: item.difficulty,
        tags: item.tags,
        groupId: `tr-${item.id}`,
        stem: item.chinese,
        reference: item.reference,
        keyPoints: item.keyPoints,
        tips: item.tips,
      },
    ]);
    const weird = scoreAttempt(paper, { q1: 'seeing volunteer moved' }, meta()).results[0];
    const full = scoreAttempt(paper, { q1: item.reference }, meta()).results[0];
    expect(weird.earned).toBeLessThanOrEqual(1);
    expectEstimated(weird);
    expect(weird.lowConfidence).toBe(true);
    expect(full.earned).toBe(2.5);
    expectEstimated(full);
  });

  it('caps a padded counterexample translation', () => {
    // Warden's counterexample: keyword list plus two function words used to earn 3/3.
    const item = BANK.translation[0];
    const result = scoreAttempt(translationPaper(item), { q1: 'seeing volunteer moved the teacher' }, meta()).results[0];
    expect(result.earned).toBeLessThanOrEqual(1);
    expectEstimated(result);
    expect(result.lowConfidence).toBe(true);
  });

  it('caps a same-window padded translation at one point', () => {
    // Without the 1-point cap this answer earns roundHalf(0.5 * 3) = 1.5, so this pins the cap itself.
    const item = BANK.translation[0];
    const padded = 'Seeing volunteer moved the the the the the the';
    const minWords = Math.max(6, Math.ceil(countWords(item.reference) * 0.6));
    expect(countWords(padded)).toBeGreaterThanOrEqual(minWords);
    const result = scoreAttempt(translationPaper(item), { q1: padded }, meta()).results[0];
    // Guard against a vacuous test: the keyword window really does cover every content point.
    expect(result.covered?.every((c) => c.ok)).toBe(true);
    expect(result.earned).toBeLessThanOrEqual(1);
    expectEstimated(result);
  });

  it('never lets a truncated keyword variant pass as a translation', () => {
    for (const item of BANK.translation) {
      const paper = translationPaper(item);
      for (const variant of truncatedVariants(item.reference, item.keyPoints[0].patterns)) {
        const result = scoreAttempt(paper, { q1: variant }, meta()).results[0];
        expect(result.earned, `${item.id}: "${variant}"`).toBeLessThanOrEqual(1);
        expectEstimated(result, `${item.id}: "${variant}"`);
        expect(result.lowConfidence, `${item.id}: "${variant}"`).toBe(true);
      }
    }
  });

  it('caps function-word padded translations at half marks', () => {
    // Each answer is long enough and clause-shaped, so only the content-density check can flag it.
    const padding: Array<[string, string, number]> = [
      ['t-01', 'Seeing the students the volunteer the the the', 1.5],
      ['t-02', 'Not until midnight did he realize the the the the', 1.5],
      ['t-03', 'Not only is the book interesting but it also the the the', 1],
      ['t-29', 'He can speak not only the the', 1.5],
      ['t-30', 'The doctor advised him to eat less sugar and the the the the the the the', 1.5],
    ];
    for (const [id, text, earned] of padding) {
      const item = BANK.translation.find((t) => t.id === id)!;
      const result = scoreAttempt(translationPaper(item), { q1: text }, meta()).results[0];
      expect(result.lowConfidence, `${id}: ${text}`).toBe(true);
      // Low-confidence estimates are capped at half of the question's marks.
      expect(result.earned, `${id}: ${text}`).toBe(earned);
      expectEstimated(result, `${id}: ${text}`);
      expect(result.feedback, `${id}: ${text}`).toContain('实词比例过低');
    }
  });

  it('never flags reference answers and model essays as low confidence', () => {
    for (const item of BANK.translation) {
      const result = scoreAttempt(translationPaper(item), { q1: item.reference }, meta()).results[0];
      expect(result.lowConfidence, item.id).toBe(false);
    }
    for (const item of BANK.summary) {
      const paper = paperWith(
        [
          {
            sourceId: item.id,
            section: 'summary',
            type: 'summary',
            points: 10,
            difficulty: item.difficulty,
            tags: ['概要写作'],
            groupId: `summary-${item.id}`,
            stem: item.prompt,
            reference: item.sample,
            sample: item.sample,
            keyPoints: item.keyPoints,
            minWords: item.minWords,
            maxWords: item.maxWords,
            tips: item.tips,
          },
        ],
        { [`summary-${item.id}`]: { kind: 'passage', title: item.title, text: item.text } },
      );
      const result = scoreAttempt(paper, { q1: item.sample }, meta()).results[0];
      expect(result.lowConfidence, item.id).toBe(false);
    }
    for (const item of BANK.writing) {
      const paper = paperWith([
        {
          sourceId: item.id,
          section: 'writing',
          type: 'writing',
          points: 25,
          difficulty: item.difficulty,
          tags: ['写作'],
          groupId: `writing-${item.id}`,
          stem: item.prompt,
          requirements: item.requirements,
          reference: item.sample,
          sample: item.sample,
          keyPoints: item.keyPoints,
          minWords: item.minWords,
          maxWords: item.maxWords,
          tips: item.tips,
        },
      ]);
      const result = scoreAttempt(paper, { q1: item.sample }, meta()).results[0];
      expect(result.lowConfidence, item.id).toBe(false);
    }
  });

  it('caps every bank reference translation at the 90% estimate ceiling', () => {
    for (const item of BANK.translation) {
      const result = scoreAttempt(translationPaper(item), { q1: item.reference }, meta()).results[0];
      expect(result.earned, item.id).toBe(2.5);
      expectEstimated(result, item.id);
      expect(result.lowConfidence, item.id).toBe(false);
    }
  });

  it('keeps a reasonable 8-10 word rewrite near full marks', () => {
    const item = BANK.translation[0];
    const rewrite = 'Seeing students volunteer for community service, the teacher was moved.';
    expect(countWords(rewrite)).toBeGreaterThanOrEqual(8);
    expect(countWords(rewrite)).toBeLessThanOrEqual(10);
    const result = scoreAttempt(translationPaper(item), { q1: rewrite }, meta()).results[0];
    expect(result.earned).toBe(2.5);
    expectEstimated(result);
    expect(result.lowConfidence).toBe(false);
  });

  it('caps a pasted summary and refuses to call it complete', () => {
    const item = BANK.summary[0];
    const paper = paperWith(
      [
        {
          sourceId: item.id,
          section: 'summary',
          type: 'summary',
          points: 10,
          difficulty: item.difficulty,
          tags: ['概要写作'],
          groupId: `summary-${item.id}`,
          stem: item.prompt,
          reference: item.sample,
          sample: item.sample,
          keyPoints: item.keyPoints,
          minWords: item.minWords,
          maxWords: item.maxWords,
          tips: item.tips,
        },
      ],
      { [`summary-${item.id}`]: { kind: 'passage', title: item.title, text: item.text } },
    );
    const pasted = scoreAttempt(paper, { q1: item.text }, meta()).results[0];
    expect(countWords(item.text)).toBeGreaterThan(item.maxWords * 1.25);
    expect(pasted.covered?.every((c) => c.ok)).toBe(true);
    expect(pasted.earned).toBeLessThan(5);
    expectEstimated(pasted);
    expect(pasted.lowConfidence).toBe(true);
    expect(pasted.feedback).toContain('低置信度初评');
    expect(pasted.feedback).not.toContain('要点较完整');
  });

  it('does not accept a 46-word keyword checklist as a summary', () => {
    const item = BANK.summary[0];
    const checklist =
      'bike sharing and the spread because it is convenient with cheap in the green but the traffic and the pollution then park and damage and block the rules and the accident so the company with the parking and the together so the responsibility and the company';
    expect(countWords(checklist)).toBe(46);
    const paper = paperWith(
      [
        {
          sourceId: item.id,
          section: 'summary',
          type: 'summary',
          points: 10,
          difficulty: item.difficulty,
          tags: ['概要写作'],
          groupId: `summary-${item.id}`,
          stem: item.prompt,
          reference: item.sample,
          sample: item.sample,
          keyPoints: item.keyPoints,
          minWords: item.minWords,
          maxWords: item.maxWords,
          tips: item.tips,
        },
      ],
      { [`summary-${item.id}`]: { kind: 'passage', title: item.title, text: item.text } },
    );
    const result = scoreAttempt(paper, { q1: checklist }, meta()).results[0];
    expect(result.covered?.every((c) => c.ok)).toBe(true);
    expect(result.earned).toBeLessThanOrEqual(5);
    expectEstimated(result);
    expect(result.lowConfidence).toBe(true);
    expect(result.feedback).not.toContain('要点较完整');
  });

  it('keeps every bank summary sample at full marks', () => {
    for (const item of BANK.summary) {
      const paper = paperWith(
        [
          {
            sourceId: item.id,
            section: 'summary',
            type: 'summary',
            points: 10,
            difficulty: item.difficulty,
            tags: ['概要写作'],
            groupId: `summary-${item.id}`,
            stem: item.prompt,
            reference: item.sample,
            sample: item.sample,
            keyPoints: item.keyPoints,
            minWords: item.minWords,
            maxWords: item.maxWords,
            tips: item.tips,
          },
        ],
        { [`summary-${item.id}`]: { kind: 'passage', title: item.title, text: item.text } },
      );
      const result = scoreAttempt(paper, { q1: item.sample }, meta()).results[0];
      expect(result.earned, item.id).toBe(9);
      expectEstimated(result, item.id);
    }
  });

  it('caps content and never marks a four-word essay correct', () => {
    // w-06 is the case where the keyword list really covers 4/4, so only the content cap can stop it.
    const item = BANK.writing[5];
    const paper = paperWith([
      {
        sourceId: item.id,
        section: 'writing',
        type: 'writing',
        points: 25,
        difficulty: item.difficulty,
        tags: ['写作'],
        groupId: `writing-${item.id}`,
        stem: item.prompt,
        requirements: item.requirements,
        reference: item.sample,
        sample: item.sample,
        keyPoints: item.keyPoints,
        minWords: item.minWords,
        maxWords: item.maxWords,
        tips: item.tips,
      },
    ]);
    const attempt = scoreAttempt(paper, { q1: 'bund morning history remember' }, meta());
    const writing = attempt.results[0];
    // Guard against a vacuous test: the keyword list must actually hit the content points.
    expect(writing.covered?.filter((c) => c.ok).length ?? 0).toBeGreaterThan(0);
    expect(writing.covered?.filter((c) => c.ok).length).toBe(item.keyPoints.length);
    expect(writing.earned).toBeLessThanOrEqual(5);
    expectEstimated(writing);
    expect(writing.lowConfidence).toBe(true);
    expect(writing.feedback).toContain('低置信度初评');
    const section = attempt.sectionResults[0];
    expect(section.accuracy).toBe(section.score / section.max);
    expect(section.accuracy).toBeLessThan(0.7);
    expect(attempt.suggestions.some((s) => s.section === 'writing')).toBe(true);
    expect(attempt.suggestions.some((s) => s.title.includes('冲击高分'))).toBe(false);
  });

  it('caps a short but well-structured writing answer', () => {
    const item = BANK.writing[5];
    const paper = paperWith([
      {
        sourceId: item.id,
        section: 'writing',
        type: 'writing',
        points: 25,
        difficulty: item.difficulty,
        tags: ['写作'],
        groupId: `writing-${item.id}`,
        stem: item.prompt,
        requirements: item.requirements,
        reference: item.sample,
        sample: item.sample,
        keyPoints: item.keyPoints,
        minWords: item.minWords,
        maxWords: item.maxWords,
        tips: item.tips,
      },
    ]);
    const answer =
      'Remember to visit the Bund in the morning. the history museum and the garden are great...';
    expect(countWords(answer)).toBeGreaterThanOrEqual(5);
    expect(countWords(answer)).toBeLessThan(80);
    const result = scoreAttempt(paper, { q1: answer }, meta()).results[0];
    expect(result.covered?.filter((c) => c.ok).length).toBe(item.keyPoints.length);
    // The answer has full sentences, so only the <80-word content cap can keep it at 5 or below.
    expect(result.earned).toBeLessThanOrEqual(5);
    expectEstimated(result);
    expect(result.lowConfidence).toBe(true);
    expect(result.feedback).toContain('内容项上限为 2/10');
  });

  it('never suggests aiming higher while a subjective section is below 70%', () => {
    const paper = generatePaper({ mode: 'full', seed: 3 });
    const writingResult = {
      id: 'q1',
      sourceId: 'w-01',
      section: 'writing',
      type: 'writing',
      number: 78,
      points: 25,
      earned: 10,
      tags: ['写作'],
      difficulty: 2,
      correct: false,
    } as QuestionResult;
    const writingSection = {
      id: 'writing',
      name: '指导性写作',
      en: 'Guided Writing',
      score: 10,
      max: 25,
      correct: 0,
      total: 1,
      scoreRate: 0.4,
      accuracy: 0.4,
      tagStats: [],
    } as SectionResult;
    const suggestions = buildSuggestions({
      results: [writingResult],
      sectionResults: [writingSection],
      tagStats: [],
      timeBySection: {},
      objectiveScore: 90,
      objectiveMax: 100,
      subjectiveEstimate: 10,
      subjectiveMax: 25,
      paper,
      unanswered: 0,
    });
    expect(suggestions.some((s) => s.title.includes('冲击高分'))).toBe(false);
    expect(suggestions.some((s) => s.section === 'writing')).toBe(true);
  });

  it('never writes a correct flag on estimated questions', () => {
    const paper = generatePaper({ mode: 'full', seed: 55 });
    const attempt = scoreAttempt(paper, perfectAnswers(paper), meta());
    const estimated = attempt.results.filter((r) => isEstimatedResult(r));
    const objective = attempt.results.filter((r) => !isEstimatedResult(r));
    expect(estimated.length).toBeGreaterThan(0);
    expect(estimated.every((r) => r.graded === 'estimated' && r.correct === undefined)).toBe(true);
    expect(objective.every((r) => r.graded === 'objective' && typeof r.correct === 'boolean')).toBe(true);
  });

  it('caps a word-salad translation at 1.5/3 and never calls it correct', () => {
    const item = BANK.translation[0];
    const salad = 'Seeing the the the the Seeing volunteer moved';
    const result = scoreAttempt(translationPaper(item), { q1: salad }, meta()).results[0];
    expect(result.earned).toBeLessThanOrEqual(1.5);
    expectEstimated(result);
    expect(result.lowConfidence).toBe(true);
  });

  it('caps every bank writing sample at 22.5/25', () => {
    for (const item of BANK.writing) {
      const paper = paperWith([
        {
          sourceId: item.id,
          section: 'writing',
          type: 'writing',
          points: 25,
          difficulty: item.difficulty,
          tags: ['写作'],
          groupId: `writing-${item.id}`,
          stem: item.prompt,
          requirements: item.requirements,
          reference: item.sample,
          sample: item.sample,
          keyPoints: item.keyPoints,
          minWords: item.minWords,
          maxWords: item.maxWords,
          tips: item.tips,
        },
      ]);
      const result = scoreAttempt(paper, { q1: item.sample }, meta()).results[0];
      expect(result.earned, item.id).toBe(22.5);
      expectEstimated(result, item.id);
      expect(result.lowConfidence, item.id).toBe(false);
    }
  });

  it('rates only on objective marks, never on the subjective estimate', () => {
    const make = (over: Partial<QuestionResult> & Pick<QuestionResult, 'id' | 'section' | 'type' | 'points' | 'earned'>): QuestionResult => ({
      sourceId: over.id,
      number: 1,
      tags: [],
      difficulty: 2,
      ...over,
    });
    const objectivePerfect = Array.from({ length: 100 }, (_, i) =>
      make({
        id: `o${i}`,
        section: 'reading',
        type: 'mcq',
        points: 1,
        earned: 1,
        graded: 'objective',
        correct: true,
      }),
    );
    const objectiveWeak = objectivePerfect.map((result, i) => ({ ...result, earned: i < 55 ? 1 : 0, correct: i < 55 }));
    const subjective = [
      make({ id: 'sub-1', section: 'translation', type: 'translation', points: 15, earned: 13.5, graded: 'estimated' }),
      make({ id: 'sub-2', section: 'summary', type: 'summary', points: 10, earned: 9, graded: 'estimated' }),
      make({ id: 'sub-3', section: 'writing', type: 'writing', points: 25, earned: 22.5, graded: 'estimated' }),
    ];

    const high = scoreSplit([...objectivePerfect, ...subjective]);
    expect(high.objectiveScore).toBe(100);
    expect(high.objectiveMax).toBe(100);
    expect(high.subjectiveEstimate).toBe(45);
    expect(high.subjectiveMax).toBe(50);
    expect(gradeFor(high.objectiveScore, high.objectiveMax).label).toBe('卓越');

    const low = scoreSplit([...objectiveWeak, ...subjective]);
    expect(low.objectiveScore).toBe(55);
    expect(low.objectiveMax).toBe(100);
    expect(low.subjectiveEstimate).toBe(45);
    // Folding the estimate into the rating would give 100/150 = 良好 here; the objective-only
    // rating must stay identical to grading the objective marks directly.
    expect(gradeFor(low.objectiveScore, low.objectiveMax)).toEqual(gradeFor(55, 100));
    expect(gradeFor(low.objectiveScore, low.objectiveMax).label).not.toBe('卓越');
  });

  it('treats legacy attempts without graded flags as estimates and never renders a tick', () => {
    const legacy = {
      id: 'legacy-1',
      sourceId: 'w-01',
      section: 'writing',
      type: 'writing',
      number: 78,
      points: 25,
      earned: 18,
      tags: ['写作'],
      difficulty: 2,
      correct: false,
    } as QuestionResult;
    expect(isEstimatedResult(legacy)).toBe(true);
    const badge = reviewBadge(legacy, true);
    expect(badge.status).toBe('estimated');
    expect(badge.label).toContain('估分');
    expect(badge.icon).toBeNull();
    expect(isReviewWrong(legacy)).toBe(false);

    const split = attemptScoreSplit({ results: [legacy] } as Parameters<typeof attemptScoreSplit>[0]);
    expect(split.subjectiveEstimate).toBe(18);
    expect(split.subjectiveMax).toBe(25);
    expect(split.objectiveMax).toBe(0);

    const legacyObjective = { ...legacy, id: 'legacy-2', section: 'reading', type: 'mcq', points: 2, earned: 0 } as QuestionResult;
    expect(isEstimatedResult(legacyObjective)).toBe(false);
    expect(reviewBadge(legacyObjective, true).icon).toBe('cross');
    expect(isReviewWrong(legacyObjective)).toBe(true);
  });

  it('decides ratability from the objective maximum only', () => {
    const make = (over: Partial<QuestionResult> & Pick<QuestionResult, 'id' | 'section' | 'type' | 'points' | 'earned'>): QuestionResult => ({
      sourceId: over.id,
      number: 1,
      tags: [],
      difficulty: 2,
      ...over,
    });
    const objectiveOnly = scoreSplit([
      make({ id: 'o-1', section: 'reading', type: 'mcq', points: 2, earned: 2, graded: 'objective', correct: true }),
    ]);
    expect(objectiveOnly.objectiveMax).toBe(2);
    expect(hasObjectiveMarks(objectiveOnly)).toBe(true);
    expect(isSubjectiveOnly(objectiveOnly)).toBe(false);

    const subjectiveOnly = scoreSplit([
      make({ id: 's-1', section: 'writing', type: 'writing', points: 25, earned: 20, graded: 'estimated' }),
    ]);
    expect(subjectiveOnly.objectiveMax).toBe(0);
    expect(hasObjectiveMarks(subjectiveOnly)).toBe(false);
    expect(isSubjectiveOnly(subjectiveOnly)).toBe(true);

    const mixed = scoreSplit([
      make({ id: 'o-2', section: 'reading', type: 'mcq', points: 2, earned: 1, graded: 'objective', correct: false }),
      make({ id: 's-2', section: 'summary', type: 'summary', points: 10, earned: 8, graded: 'estimated' }),
    ]);
    expect(hasObjectiveMarks(mixed)).toBe(true);
    expect(isSubjectiveOnly(mixed)).toBe(false);

    // An empty split has neither denominator, so it is neither ratable nor subjective-only
    // and every consumer must fall back to its "no record" wording.
    const empty = scoreSplit([]);
    expect(hasObjectiveMarks(empty)).toBe(false);
    expect(isSubjectiveOnly(empty)).toBe(false);
  });

  it('never lets a high subjective estimate lift the objective rating advice', () => {
    const paper = generatePaper({ mode: 'full', seed: 3 });
    const writingResult = {
      id: 'q1',
      sourceId: 'w-01',
      section: 'writing',
      type: 'writing',
      number: 78,
      points: 25,
      earned: 12,
      tags: ['写作'],
      difficulty: 2,
      graded: 'estimated',
    } as QuestionResult;
    const writingSection = {
      id: 'writing',
      name: '指导性写作',
      en: 'Guided Writing',
      score: 12,
      max: 25,
      correct: 0,
      total: 1,
      scoreRate: 0.48,
      accuracy: 0.48,
      tagStats: [],
    } as SectionResult;
    const suggestions = buildSuggestions({
      results: [writingResult],
      sectionResults: [writingSection],
      tagStats: [],
      timeBySection: {},
      objectiveScore: 60,
      objectiveMax: 100,
      subjectiveEstimate: 45,
      subjectiveMax: 50,
      paper,
      unanswered: 0,
    });
    expect(suggestions.some((s) => s.title.includes('冲击高分'))).toBe(false);
    const writingSuggestion = suggestions.find((s) => s.section === 'writing');
    expect(writingSuggestion?.detail).toContain('估分');
    expect(writingSuggestion?.detail).toContain('不参与评级');
  });

  it('caps a low-confidence 485-word writing answer at half marks', () => {
    const item = BANK.writing[0];
    const paper = paperWith([
      {
        sourceId: item.id,
        section: 'writing',
        type: 'writing',
        points: 25,
        difficulty: item.difficulty,
        tags: ['写作'],
        groupId: `writing-${item.id}`,
        stem: item.prompt,
        requirements: item.requirements,
        reference: item.sample,
        sample: item.sample,
        keyPoints: item.keyPoints,
        minWords: item.minWords,
        maxWords: item.maxWords,
        tips: item.tips,
      },
    ]);
    const sentences = [
      'I am glad to welcome you to our school and share the club news.',
      'The English Drama Club meets every Friday afternoon in Room 302.',
      'The Photography Club also meets after school and explores the city.',
      'Could you let me know when you will arrive and which club interests you?',
      'I am looking forward to meeting you and showing you around the campus.',
      'Both clubs are friendly to new members and welcome every student.',
    ];
    let essay = '';
    for (let i = 0; countWords(essay) < 485; i++) {
      essay += `${sentences[i % sentences.length]} `;
    }
    essay = essay.trim().split(/\s+/).slice(0, 485).join(' ');
    expect(countWords(essay)).toBe(485);
    expect(countWords(essay)).toBeGreaterThan(item.maxWords * 1.25);

    const result = scoreAttempt(paper, { q1: essay }, meta()).results[0];
    // Guard against a vacuous test: the essay really does cover every task point.
    expect(result.covered?.every((c) => c.ok)).toBe(true);
    expect(result.lowConfidence).toBe(true);
    expect(result.earned).toBeLessThanOrEqual(12.5);
    expect(result.earned).toBe(12.5);
    expectEstimated(result);
  });

  it('caps a low-confidence summary at half marks', () => {
    const item = BANK.summary[0];
    const paper = paperWith(
      [
        {
          sourceId: item.id,
          section: 'summary',
          type: 'summary',
          points: 10,
          difficulty: item.difficulty,
          tags: ['概要写作'],
          groupId: `summary-${item.id}`,
          stem: item.prompt,
          reference: item.sample,
          sample: item.sample,
          keyPoints: item.keyPoints,
          minWords: item.minWords,
          maxWords: item.maxWords,
          tips: item.tips,
        },
      ],
      { [`summary-${item.id}`]: { kind: 'passage', title: item.title, text: item.text } },
    );
    // One copied 8-word source shingle inside an otherwise valid 60-word summary: still in range,
    // so only the low-confidence (copied) cap can keep this at half marks.
    const answer = `${item.sample} Bike sharing has spread quickly in cities around.`;
    expect(countWords(answer)).toBeGreaterThanOrEqual(item.minWords);
    expect(countWords(answer)).toBeLessThanOrEqual(item.maxWords * 1.25);

    const result = scoreAttempt(paper, { q1: answer }, meta()).results[0];
    expect(result.covered?.every((c) => c.ok)).toBe(true);
    expect(result.lowConfidence).toBe(true);
    expect(result.earned).toBeLessThanOrEqual(5);
    expect(result.earned).toBe(5);
    expectEstimated(result);
  });

  it('never lets the 90% ceiling reach full marks on 1- and 2-point items', () => {
    const item = BANK.translation[0];
    for (const [points, expected] of [
      [1, 0.5],
      [2, 1.5],
    ] as const) {
      const paper = paperWith([
        {
          sourceId: item.id,
          section: 'translation',
          type: 'translation',
          points,
          difficulty: item.difficulty,
          tags: item.tags,
          groupId: `tr-${item.id}`,
          stem: item.chinese,
          reference: item.reference,
          keyPoints: item.keyPoints,
          tips: item.tips,
        },
      ]);
      const result = scoreAttempt(paper, { q1: item.reference }, meta()).results[0];
      expect(result.lowConfidence).toBe(false);
      expect(result.earned, `points=${points}`).toBe(expected);
      expect(result.earned, `points=${points}`).toBeLessThan(points);
      expectEstimated(result, `points=${points}`);
    }
  });
});
