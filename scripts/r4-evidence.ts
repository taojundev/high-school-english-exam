/**
 * r4 acceptance probe: runs the real BANK through the real scorer (no fixtures).
 * Run with: npx vite-node scripts/r4-evidence.ts
 */
import { BANK } from '../src/data';
import { gradeFor } from '../src/lib/format';
import { generatePaper } from '../src/lib/exam';
import { countWords, isEstimatedResult, scoreAttempt, scoreSplit, type AttemptMeta } from '../src/lib/scoring';
import type { ExamQuestion, Paper, QuestionResult, SectionId } from '../src/types';

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
    id: 'probe',
    seed: 1,
    createdAt: new Date().toISOString(),
    mode: 'section',
    title: 'probe',
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

function summaryPaper(item: (typeof BANK.summary)[number]): Paper {
  return paperWith(
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
}

function writingPaper(item: (typeof BANK.writing)[number]): Paper {
  return paperWith([
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
}

const pick = (r: QuestionResult) => ({ earned: r.earned, estimated: isEstimatedResult(r), correct: r.correct });

const t01 = BANK.translation.find((item) => item.id === 't-01')!;
const salad = scoreAttempt(translationPaper(t01), { q1: 'Seeing the the the the Seeing volunteer moved' }, meta()).results[0];
const reference = scoreAttempt(translationPaper(t01), { q1: t01.reference }, meta()).results[0];
const s01 = BANK.summary[0];
const pasted = scoreAttempt(summaryPaper(s01), { q1: s01.text }, meta()).results[0];
const w06 = BANK.writing.find((item) => item.id === 'w-06')!;
const fourWords = scoreAttempt(writingPaper(w06), { q1: 'bund morning history remember' }, meta()).results[0];

console.log('## 主观题反例');
console.log('t-01 salad        ', pick(salad), 'lowConfidence=', salad.lowConfidence);
console.log('t-01 reference    ', pick(reference), 'lowConfidence=', reference.lowConfidence);
console.log(`s-01 pasted ${countWords(s01.text)} words`, pick(pasted), 'lowConfidence=', pasted.lowConfidence);
console.log('w-06 four words   ', pick(fourWords), 'lowConfidence=', fourWords.lowConfidence);

const translationEarned = new Set<number>();
for (const item of BANK.translation) {
  translationEarned.add(scoreAttempt(translationPaper(item), { q1: item.reference }, meta()).results[0].earned);
}
const summaryEarned = new Set<number>();
for (const item of BANK.summary) {
  summaryEarned.add(scoreAttempt(summaryPaper(item), { q1: item.sample }, meta()).results[0].earned);
}
const writingEarned = new Set<number>();
for (const item of BANK.writing) {
  writingEarned.add(scoreAttempt(writingPaper(item), { q1: item.sample }, meta()).results[0].earned);
}
console.log('\n## 参考译文 / 范文（应全部封顶）');
console.log(`translations (${BANK.translation.length}) earned set:`, [...translationEarned]);
console.log(`summaries (${BANK.summary.length}) earned set:`, [...summaryEarned]);
console.log(`writings (${BANK.writing.length}) earned set:`, [...writingEarned]);

const paper = generatePaper({ mode: 'full', seed: 55 });
const objective = paper.questions.filter((q) => q.type === 'mcq' || q.type === 'fill' || q.type === 'vocab');
const samples = [objective[0], objective.find((q) => q.type === 'fill') ?? objective[1], objective[2]];
const objectiveAnswers: Record<string, string> = {};
for (const q of samples) {
  if (q.type === 'mcq') objectiveAnswers[q.id] = String(q.answer);
  else objectiveAnswers[q.id] = q.answerText ?? '';
}
// Make one of the three deliberately wrong.
const wrong = samples[2];
objectiveAnswers[wrong.id] = wrong.type === 'mcq' ? String((wrong.answer ?? 0) + 1) : 'definitely wrong';
const objectiveAttempt = scoreAttempt(paper, objectiveAnswers, meta());
console.log('\n## 客观题抽样（correct 仍为 true/false）');
for (const q of samples) {
  const result = objectiveAttempt.results.find((r) => r.id === q.id)!;
  console.log(q.id, q.type, pick(result));
}

const make = (over: Partial<QuestionResult> & Pick<QuestionResult, 'id' | 'section' | 'type' | 'points' | 'earned'>): QuestionResult => ({
  sourceId: over.id,
  number: 1,
  tags: [],
  difficulty: 2,
  ...over,
});
const subjective = [
  make({ id: 'sub-1', section: 'translation', type: 'translation', points: 15, earned: 13.5, graded: 'estimated' }),
  make({ id: 'sub-2', section: 'summary', type: 'summary', points: 10, earned: 9, graded: 'estimated' }),
  make({ id: 'sub-3', section: 'writing', type: 'writing', points: 25, earned: 22.5, graded: 'estimated' }),
];
const objectiveResults = (earnedCount: number) =>
  Array.from({ length: 100 }, (_, i) =>
    make({
      id: `o${i}`,
      section: 'reading',
      type: 'mcq',
      points: 1,
      earned: i < earnedCount ? 1 : 0,
      graded: 'objective',
      correct: i < earnedCount,
    }),
  );

console.log('\n## 评级证据（客观分 + 主观估分 45/50）');
for (const earnedCount of [100, 55]) {
  const split = scoreSplit([...objectiveResults(earnedCount), ...subjective]);
  console.log(
    `objective ${split.objectiveScore}/${split.objectiveMax} + subjective ${split.subjectiveEstimate}/${split.subjectiveMax}`,
    '=>',
    gradeFor(split.objectiveScore, split.objectiveMax).label,
  );
}
