import { afterEach, describe, expect, it, vi } from 'vitest';
import { generatePaper, paperSourceIds } from './exam';
import { adviceForTag, hasTagAdvice, sectionAdvice } from './advice';
import { scoreAttempt, type AttemptMeta } from './scoring';
import { loadAttempts, markSeen } from './storage';
import {
  DRILL_SECTIONS,
  DRILL_SECTION_INFO,
  DRILL_STORAGE_KEY,
  buildDrillPaper,
  buildDrillRecord,
  drillGuidance,
  drillRecordKind,
  groupWrongTags,
  isDrillSection,
  isReferenceSection,
  judgeAnswer,
  judgeQuestion,
  loadDrillRecords,
  referenceFeedback,
  saveDrillRecord,
  type DrillRecord,
} from './drill';
import type { ExamQuestion, Paper, SectionId } from '../types';

const meta = (): AttemptMeta => ({
  startedAt: new Date('2026-01-01T09:00:00Z').toISOString(),
  submittedAt: new Date('2026-01-01T09:05:00Z').toISOString(),
  durationUsedSec: 300,
  timeBySection: {},
  transcriptReveals: [],
  replayCounts: {},
});

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

/** Finds a real generated drill question matching a predicate, without hand-built fixtures. */
function findQuestion(
  section: SectionId,
  predicate: (q: ExamQuestion) => boolean,
): { paper: Paper; question: ExamQuestion } {
  for (let seed = 1; seed <= 80; seed += 1) {
    const paper = buildDrillPaper(section, { seed, seenIds: [] });
    const question = paper.questions.find(predicate);
    if (question) return { paper, question };
  }
  throw new Error(`no ${section} question matched after 80 seeds`);
}

/** Judges through the real whole-paper scorer, then through the drill path, and compares. */
function expectSameVerdict(paper: Paper, question: ExamQuestion, raw: string) {
  const full = scoreAttempt(paper, { [question.id]: raw }, meta()).results.find(
    (result) => result.id === question.id,
  );
  if (!full) throw new Error(`scorer dropped ${question.id}`);
  const single = judgeQuestion(paper, question, raw);
  // Same object as the exam would produce: same id, number, points, correct, earned, userText.
  expect(single).toEqual(full);

  const feedback = judgeAnswer(paper, question, raw);
  expect(feedback.correct).toBe(full.correct);
  expect(feedback.earned).toBe(full.earned);
  expect(feedback.points).toBe(question.points);
  expect(feedback.answerText).toBe(full.answerText ?? '');
  expect(feedback.userText).toBe(full.userText ?? '');
  return feedback;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('drill set building', () => {
  it('keeps the practice-mode question count and grouping for all six sections', () => {
    const expected: Record<string, number> = {
      listening: 9,
      grammar: 10,
      vocabulary: 10,
      cloze: 15,
      reading: 10,
      translation: 5,
    };
    expect(DRILL_SECTIONS).toEqual([
      'listening',
      'grammar',
      'vocabulary',
      'cloze',
      'reading',
      'translation',
    ]);

    for (const section of DRILL_SECTIONS) {
      for (const seed of [1, 2, 3, 11]) {
        const drill = buildDrillPaper(section, { seed, seenIds: [] });
        const direct = generatePaper({ mode: 'section', section, seed });
        expect(drill.questions.length).toBe(expected[section]);
        expect(drill.questions.length).toBe(direct.questions.length);
        // Same items, same groups: a drill must not split a group or re-shuffle differently.
        expect(drill.questions.map((q) => q.groupId)).toEqual(direct.questions.map((q) => q.groupId));
        expect(drill.questions.map((q) => q.sourceId)).toEqual(direct.questions.map((q) => q.sourceId));
        expect(drill.questions.map((q) => q.points)).toEqual(direct.questions.map((q) => q.points));
        expect(drill.maxScore).toBe(direct.maxScore);
      }
      const info = DRILL_SECTION_INFO.find((item) => item.id === section);
      expect(info?.questions).toBe(expected[section]);
      expect(info?.points).toBe(generatePaper({ mode: 'section', section, seed: 1 }).maxScore);
    }
  });

  it('refuses subjective sections and subjective questions', () => {
    expect(isDrillSection('reading')).toBe(true);
    expect(isDrillSection('translation')).toBe(true);
    expect(isDrillSection('summary')).toBe(false);
    expect(isDrillSection('writing')).toBe(false);
    expect(() => buildDrillPaper('summary', { seed: 1, seenIds: [] })).toThrow(/单项测试/);
    expect(() => buildDrillPaper('writing', { seed: 1, seenIds: [] })).toThrow(/单项测试/);

    // 翻译可以练（参考模式），但永远不能进入判分路径。
    const translation = generatePaper({ mode: 'section', section: 'translation', seed: 1 });
    expect(translation.questions).toHaveLength(5);
    for (const question of translation.questions) {
      expect(question.type).toBe('translation');
      expect(() => judgeQuestion(translation, question, 'anything')).toThrow(/主观题/);
      expect(() => judgeAnswer(translation, question, 'anything')).toThrow(/主观题/);
    }
  });
});

describe('single-question judging matches scoreAttempt', () => {
  it('agrees on mcq right, mcq wrong and blank', () => {
    const { paper, question: mcq } = findQuestion('grammar', (q) => q.type === 'mcq');
    const options = mcq.options ?? [];
    expect(options.length).toBeGreaterThan(1);

    const right = expectSameVerdict(paper, mcq, String(mcq.answer));
    expect(right.correct).toBe(true);
    expect(right.earned).toBe(mcq.points);
    expect(right.answerText).toBe(options[mcq.answer ?? 0]);
    expect(right.userText).toBe(options[mcq.answer ?? 0]);

    const wrongIndex = ((mcq.answer ?? 0) + 1) % options.length;
    const wrong = expectSameVerdict(paper, mcq, String(wrongIndex));
    expect(wrong.correct).toBe(false);
    expect(wrong.earned).toBe(0);
    // The revealed "your answer" is the real option text, not the raw index.
    expect(wrong.userText).toBe(options[wrongIndex]);
    expect(wrong.answerText).toBe(options[mcq.answer ?? 0]);

    const blank = expectSameVerdict(paper, mcq, '');
    expect(blank.correct).toBe(false);
    expect(blank.earned).toBe(0);
    expect(blank.userText).toBe('');
  });

  it('agrees on fill exact, accept variant and case/space/punctuation noise', () => {
    const { paper, question: fill } = findQuestion(
      'grammar',
      (q) => q.type === 'fill' && Boolean(q.answerText) && !q.accept?.length,
    );
    const exact = expectSameVerdict(paper, fill, fill.answerText ?? '');
    expect(exact.correct).toBe(true);

    const noisy = expectSameVerdict(paper, fill, `  ${(fill.answerText ?? '').toUpperCase()}!!  `);
    expect(noisy.correct).toBe(true);

    const variant = findQuestion('grammar', (q) => q.type === 'fill' && Boolean(q.accept?.length));
    const accepted = variant.question.accept?.[0] ?? '';
    expect(accepted.length).toBeGreaterThan(0);
    const viaAccept = expectSameVerdict(variant.paper, variant.question, accepted);
    expect(viaAccept.correct).toBe(true);
    // The canonical answer still works next to the accept variant.
    expect(expectSameVerdict(variant.paper, variant.question, variant.question.answerText ?? '').correct).toBe(
      true,
    );
    // A real miss stays a miss.
    const miss = expectSameVerdict(variant.paper, variant.question, `${accepted} and something else`);
    expect(miss.correct).toBe(false);
  });

  it('agrees on vocabulary, including case-insensitive answers', () => {
    const { paper, question: vocab } = findQuestion('vocabulary', (q) => q.type === 'vocab');
    const answer = vocab.answerText ?? '';
    expect(answer.length).toBeGreaterThan(0);

    const lower = expectSameVerdict(paper, vocab, answer.toLowerCase());
    expect(lower.correct).toBe(true);
    expect(lower.answerText).toBe(answer);

    const upper = expectSameVerdict(paper, vocab, ` ${answer.toUpperCase()} `);
    expect(upper.correct).toBe(true);

    const miss = expectSameVerdict(paper, vocab, `${answer}s`);
    expect(miss.correct).toBe(false);
  });
});

describe('advice for a single tag', () => {
  it('always returns non-empty guidance for every tag a drill set can produce', () => {
    let checked = 0;
    for (const section of DRILL_SECTIONS) {
      const paper = buildDrillPaper(section, { seed: 6, seenIds: [] });
      const tags = [...new Set(paper.questions.flatMap((q) => q.tags))];
      expect(tags.length).toBeGreaterThan(0);
      for (const tag of tags) {
        const entry = adviceForTag(tag, section);
        expect(entry.title.trim().length).toBeGreaterThan(0);
        expect(entry.detail.trim().length).toBeGreaterThan(0);
        expect(entry.action.trim().length).toBeGreaterThan(0);
        checked += 1;
      }
      // Every question must end up with a usable guidance block, right or wrong.
      for (const question of paper.questions) {
        for (const correct of [true, false]) {
          const guidance = drillGuidance(question, correct);
          expect(guidance.title.trim().length).toBeGreaterThan(0);
          expect(guidance.detail.trim().length).toBeGreaterThan(0);
          expect(guidance.action.trim().length).toBeGreaterThan(0);
          expect(guidance.detail).not.toBe(guidance.action);
        }
      }
    }
    expect(checked).toBeGreaterThan(30);
  });

  it('falls back to section advice for an unmapped tag and to generic advice for an unknown tag', () => {
    // 完形-介词 appears in the bank but has no hand-written entry in TAG_ADVICE.
    expect(hasTagAdvice('完形-介词')).toBe(false);
    expect(adviceForTag('完形-介词')).toEqual(sectionAdvice('cloze'));
    // The tag prefix is enough: no section argument needed.
    expect(adviceForTag('阅读-语气')).toEqual(sectionAdvice('reading'));

    const unknown = adviceForTag('未知-考点');
    expect(unknown.title.trim().length).toBeGreaterThan(0);
    expect(unknown.detail.trim().length).toBeGreaterThan(0);
    expect(unknown.action.trim().length).toBeGreaterThan(0);

    // A known tag must still win over the fallback.
    expect(hasTagAdvice('听力-数字')).toBe(true);
    expect(adviceForTag('听力-数字', 'reading').title).toBe('听力数字题：边听边记，别心算');
  });
});

describe('drill records stay out of the exam history', () => {
  it('writes a slim record to the drill key only', () => {
    vi.stubGlobal('window', { localStorage: memoryStorage() });

    const paper = buildDrillPaper('grammar', { seed: 8, seenIds: [] });
    const question = paper.questions[0];
    const wrong = judgeAnswer(paper, question, 'definitely-not-the-answer');
    expect(wrong.correct).toBe(false);

    const record = buildDrillRecord({
      section: 'grammar',
      questions: paper.questions,
      verdicts: { [question.id]: { correct: wrong.correct, earned: wrong.earned, points: wrong.points } },
      elapsedSec: 125.4,
      at: '2026-01-01T10:00:00.000Z',
      id: 'drill-test-1',
    });
    expect(record.questions).toBe(10);
    expect(record.points).toBe(paper.maxScore);
    expect(record.correct).toBe(0);
    expect(record.earned).toBe(0);
    expect(record.elapsedSec).toBe(125);
    expect(record.wrongTags).toEqual(question.tags);

    expect(saveDrillRecord(record)).toBe(true);
    const rawDrill = window.localStorage.getItem(DRILL_STORAGE_KEY);
    expect(rawDrill).toBeTruthy();
    const stored = JSON.parse(rawDrill ?? '[]');
    expect(stored).toHaveLength(1);
    // Slim: no paper, no passages, no scripts, no per-question objects.
    expect(stored[0]).not.toHaveProperty('paper');
    expect(stored[0]).not.toHaveProperty('answers');
    expect(stored[0]).not.toHaveProperty('results');
    expect(JSON.stringify(stored[0])).not.toContain('passage');

    expect(loadDrillRecords()).toHaveLength(1);
    // The drill key is a separate key, so nothing leaks into 成绩记录/评级.
    expect(window.localStorage.getItem('sh-exam.attempts.v1')).toBeNull();
    expect(loadAttempts()).toEqual([]);
  });

  it('counts only judged questions and groups repeated wrong tags', () => {
    const paper = buildDrillPaper('reading', { seed: 4, seenIds: [] });
    const verdicts = {
      [paper.questions[0].id]: { correct: true, earned: 2, points: 2 },
      [paper.questions[1].id]: { correct: false, earned: 0, points: 2 },
    };
    const record = buildDrillRecord({
      section: 'reading',
      questions: paper.questions,
      verdicts,
      elapsedSec: 60,
      at: '2026-02-02T10:00:00.000Z',
      id: 'drill-test-2',
    });
    expect(record.correct).toBe(1);
    expect(record.earned).toBe(2);
    expect(record.questions).toBe(paper.questions.length);
    expect(record.wrongTags).toEqual(paper.questions[1].tags);

    expect(groupWrongTags(['a', 'b', 'a'])).toEqual([
      { tag: 'a', count: 2 },
      { tag: 'b', count: 1 },
    ]);
    expect(groupWrongTags([])).toEqual([]);
  });
});

describe('vocabulary drills keep the shared word bank', () => {
  it('builds one group of 10 questions sharing a single 11-word bank', () => {
    const paper = buildDrillPaper('vocabulary', { seed: 9, seenIds: [] });
    expect(paper.questions).toHaveLength(10);
    expect(new Set(paper.questions.map((q) => q.groupId)).size).toBe(1);

    const bankIds = Object.keys(paper.wordBanks);
    expect(bankIds).toHaveLength(1);
    const bank = paper.wordBanks[bankIds[0]];
    expect(bank).toHaveLength(11);

    const answers = paper.questions.map((q) => (q.answerText ?? '').toLowerCase());
    expect(new Set(answers).size).toBe(10);
    expect(answers).not.toContain('');

    const bankLower = bank.map((word) => word.toLowerCase());
    for (const answer of answers) expect(bankLower).toContain(answer);
    // Exactly one extra word, and it is not any question's answer.
    const extra = bank.filter((word) => !answers.includes(word.toLowerCase()));
    expect(extra).toHaveLength(1);

    for (const question of paper.questions) {
      // No per-question choice list: a single-question view cannot leak the other nine answers.
      expect(question.options).toBeUndefined();
      expect(question.groupId).toBe(bankIds[0]);
    }
  });
});

/**
 * 翻译是参考模式（D5/D6/D7）：可以练、可以给参考译文，但绝不判分，也绝不把不判分的板块
 * 拟合成「0 分 / 0% 正确率」这种假数据。
 */
describe('translation drill runs in reference mode', () => {
  it('is a drill section with five questions and is marked as not graded', () => {
    expect(isDrillSection('translation')).toBe(true);
    expect(isReferenceSection('translation')).toBe(true);
    for (const section of ['listening', 'grammar', 'vocabulary', 'cloze', 'reading'] as SectionId[]) {
      expect(isReferenceSection(section)).toBe(false);
    }

    const paper = buildDrillPaper('translation', { seed: 3, seenIds: [] });
    expect(paper.questions).toHaveLength(5);
    expect(paper.questions.every((q) => q.type === 'translation')).toBe(true);

    const info = DRILL_SECTION_INFO.find((item) => item.id === 'translation');
    expect(info?.graded).toBe(false);
    expect(info?.questions).toBe(5);
    for (const graded of DRILL_SECTION_INFO.filter((item) => item.id !== 'translation')) {
      expect(graded.graded).toBe(true);
    }
  });

  it('reveals the reference translation plus the user text and nothing gradeable', () => {
    const paper = buildDrillPaper('translation', { seed: 2, seenIds: [] });
    const question = paper.questions[0];
    expect((question.reference ?? '').length).toBeGreaterThan(10);

    const feedback = referenceFeedback(question, '  My own English sentence.  ');
    expect(feedback.kind).toBe('reference');
    expect(feedback.questionId).toBe(question.id);
    expect(feedback.referenceText).toBe(question.reference);
    // 原样保存用户输入，不做任何归一化或判定。
    expect(feedback.userText).toBe('  My own English sentence.  ');
    // 拒绝判分的形状：没有对错、得分、指导意见字段可读。
    expect(feedback).not.toHaveProperty('correct');
    expect(feedback).not.toHaveProperty('earned');
    expect(feedback).not.toHaveProperty('guidance');

    // 客观题不能走参考模式（反向护栏）。
    const reading = buildDrillPaper('reading', { seed: 1, seenIds: [] });
    expect(() => referenceFeedback(reading.questions[0], 'x')).toThrow(/参考模式/);
  });

  it('records a reference run without fabricating scores and leaves the draft alone', () => {
    const draftSentinel = JSON.stringify({ id: 'active-draft-sentinel', answers: { q1: 'A' } });
    const store = memoryStorage();
    store.setItem('sh-exam.active.v1', draftSentinel);
    vi.stubGlobal('window', { localStorage: store });

    const paper = buildDrillPaper('translation', { seed: 5, seenIds: [] });
    const record = buildDrillRecord({
      section: 'translation',
      questions: paper.questions,
      answered: 4,
      elapsedSec: 200.6,
      at: '2026-03-03T10:00:00.000Z',
      id: 'drill-reference-1',
    });
    expect(record.kind).toBe('reference');
    expect(record.section).toBe('translation');
    expect(record.questions).toBe(5);
    expect(record.answered).toBe(4);
    // 不判分板块不做分数口径：没有得分、没有正确率、没有错题考点。
    expect(record.correct).toBe(0);
    expect(record.earned).toBe(0);
    expect(record.points).toBe(0);
    expect(record.wrongTags).toEqual([]);
    expect(record.elapsedSec).toBe(201);

    expect(saveDrillRecord(record)).toBe(true);
    expect(loadDrillRecords()[0].kind).toBe('reference');
    // 仍然只写在 drill key 里，草稿字节不变。
    expect(window.localStorage.getItem('sh-exam.attempts.v1')).toBeNull();
    expect(store.getItem('sh-exam.active.v1')).toBe(draftSentinel);
    expect(loadAttempts()).toEqual([]);

    // answered 不会超过题量。
    const over = buildDrillRecord({
      section: 'translation',
      questions: paper.questions,
      answered: 99,
      elapsedSec: 1,
    });
    expect(over.answered).toBe(5);
  });

  it('keeps graded records shaped as before and reads legacy records as graded', () => {
    const paper = buildDrillPaper('reading', { seed: 4, seenIds: [] });
    const record = buildDrillRecord({
      section: 'reading',
      questions: paper.questions,
      verdicts: { [paper.questions[0].id]: { correct: true, earned: 2, points: 2 } },
      elapsedSec: 30,
      at: '2026-04-04T10:00:00.000Z',
      id: 'drill-graded-1',
    });
    expect(record.kind).toBe('graded');
    expect(record.correct).toBe(1);
    expect(record.earned).toBe(2);
    expect(record.points).toBe(paper.maxScore);
    expect(record.answered).toBe(1);
    expect(drillRecordKind(record)).toBe('graded');

    // 旧记录没有 kind（也没有 answered）：读取时按 graded 处理，不迁移、不改存储键。
    const legacy = {
      id: 'legacy-drill',
      section: 'grammar',
      at: '2026-01-01T00:00:00.000Z',
      questions: 10,
      correct: 8,
      earned: 16,
      points: 20,
      elapsedSec: 90,
      wrongTags: ['语法-时态'],
    } as DrillRecord;
    expect(legacy).not.toHaveProperty('kind');
    expect(drillRecordKind(legacy)).toBe('graded');
    // 旧记录项仍然进 成绩记录吗？不进：drill 记录永不进成绩记录（D2）。
    expect(drillRecordKind({ kind: 'reference' })).toBe('reference');
  });
});

/**
 * The single most dangerous failure mode of this feature: sh-exam.active.v1 is the only draft slot,
 * so any refactor that calls saveActive()/clearActive() from a drill path silently destroys a user's
 * in-progress mock exam while every other test stays green. The drill runs the whole write path
 * (judge -> record -> save -> markSeen) against a seeded draft and history and must leave both
 * keys byte-identical.
 */
describe('a drill never touches the mock-exam draft or history', () => {
  it('leaves sh-exam.active.v1 and sh-exam.attempts.v1 byte-identical through a whole drill', () => {
    const draftSentinel = JSON.stringify({
      id: 'active-draft-sentinel',
      paperId: 'paper-sentinel',
      startedAt: '2026-01-01T08:00:00.000Z',
      answers: { 'sentinel-q1': 'A' },
      index: 3,
      sectionIndex: 1,
    });
    const attemptsSentinel = JSON.stringify([
      {
        id: 'attempt-sentinel',
        at: '2025-12-31T09:00:00.000Z',
        paperTitle: 'sentinel paper',
        questions: [],
        results: [],
      },
    ]);
    const store = memoryStorage();
    store.setItem('sh-exam.active.v1', draftSentinel);
    store.setItem('sh-exam.attempts.v1', attemptsSentinel);
    vi.stubGlobal('window', { localStorage: store });

    const paper = buildDrillPaper('grammar', { seed: 5 });
    const rawAnswer = (question: ExamQuestion) =>
      question.type === 'mcq' ? String(question.answer) : question.answerText ?? '';
    const verdicts: Record<string, { correct: boolean; earned: number; points: number }> = {};
    for (const question of paper.questions) {
      const feedback = judgeAnswer(paper, question, rawAnswer(question));
      verdicts[question.id] = {
        correct: feedback.correct,
        earned: feedback.earned,
        points: feedback.points,
      };
    }

    const record = buildDrillRecord({
      section: 'grammar',
      questions: paper.questions,
      verdicts,
      elapsedSec: 240,
      at: '2026-01-01T10:00:00.000Z',
      id: 'drill-guard-1',
    });
    expect(saveDrillRecord(record)).toBe(true);
    markSeen(paperSourceIds(paper));

    // Byte-identical: not "still parses", not "still has an id" – the exact strings survive.
    expect(store.getItem('sh-exam.active.v1')).toBe(draftSentinel);
    expect(store.getItem('sh-exam.attempts.v1')).toBe(attemptsSentinel);
    expect(window.localStorage.getItem('sh-exam.active.v1')).toBe(draftSentinel);
    expect(window.localStorage.getItem('sh-exam.attempts.v1')).toBe(attemptsSentinel);
    expect(loadAttempts()).toHaveLength(1);

    // Exactly one slim record, in the drill key only.
    const records = loadDrillRecords();
    expect(records).toHaveLength(1);
    expect(records[0].id).toBe('drill-guard-1');
    expect(records[0].section).toBe('grammar');
    expect(records[0].questions).toBe(paper.questions.length);
    expect(records[0]).not.toHaveProperty('paper');
    expect(records[0]).not.toHaveProperty('answers');
    expect(records[0]).not.toHaveProperty('results');
  });
});
