import { SECTION_MAP } from '../sections';
import type {
  ExamQuestion,
  GenerateOptions,
  Paper,
  QuestionResult,
  SectionId,
} from '../types';
import { adviceForTag, hasTagAdvice, type AdviceEntry } from './advice';
import { generatePaper } from './exam';
import { scoreAttempt, type AttemptMeta } from './scoring';
import { loadSeenHistory } from './storage';

/** Drills cover objective sections only; translation/summary/writing have no unique answer. */
export const DRILL_SECTIONS: SectionId[] = [
  'listening',
  'grammar',
  'vocabulary',
  'cloze',
  'reading',
];

export const DRILL_STORAGE_KEY = 'sh-exam.drill.v1';

const MAX_DRILL_RECORDS = 20;

export function isDrillSection(section: SectionId): boolean {
  return DRILL_SECTIONS.includes(section);
}

export interface DrillSectionInfo {
  id: SectionId;
  name: string;
  en: string;
  blurb: string;
  questions: number;
  points: number;
  minutes: number;
}

/**
 * Question count/points per section, measured from the real generator (seed 1) instead of being
 * hard-coded, so a bank change cannot make the landing page lie about the set size.
 */
export const DRILL_SECTION_INFO: DrillSectionInfo[] = DRILL_SECTIONS.map((id) => {
  const paper = generatePaper({ mode: 'section', section: id, seed: 1 });
  const meta = SECTION_MAP[id];
  return {
    id,
    name: meta.name,
    en: meta.en,
    blurb: meta.blurb,
    questions: paper.questions.length,
    points: paper.maxScore,
    minutes: meta.practiceMinutes,
  };
});

export interface DrillPaperOptions {
  seed?: number;
  difficulty?: GenerateOptions['difficulty'];
  /** Defaults to the real seen history, so a drill avoids recently practised items. */
  seenIds?: string[];
}

export function buildDrillPaper(section: SectionId, options: DrillPaperOptions = {}): Paper {
  if (!isDrillSection(section)) {
    throw new Error(`单项测试不支持该板块: ${section}`);
  }
  return generatePaper({
    mode: 'section',
    section,
    difficulty: options.difficulty,
    seed: options.seed,
    seenIds: options.seenIds ?? loadSeenHistory(),
  });
}

const OBJECTIVE_TYPES = new Set(['mcq', 'fill', 'vocab']);

export function isObjectiveQuestion(question: Pick<ExamQuestion, 'type'>): boolean {
  return OBJECTIVE_TYPES.has(question.type);
}

function drillMeta(): AttemptMeta {
  // Drill answers are judged one at a time; no draft, no clock and no transcript state is stored.
  const stamp = new Date().toISOString();
  return {
    startedAt: stamp,
    submittedAt: stamp,
    durationUsedSec: 0,
    timeBySection: {},
    transcriptReveals: [],
    replayCounts: {},
    id: `drill-single-${stamp}`,
  };
}

/**
 * A one-question paper that keeps the question (and its shuffled option order) untouched, so the
 * real scorer produces exactly the same QuestionResult it would inside the whole section paper.
 */
export function singleQuestionPaper(paper: Paper, question: ExamQuestion): Paper {
  const meta = SECTION_MAP[question.section];
  const context = paper.contexts[question.groupId];
  return {
    version: 1,
    id: `${paper.id}-single-${question.id}`,
    seed: paper.seed,
    difficulty: paper.difficulty,
    createdAt: paper.createdAt,
    mode: 'section',
    sectionFilter: question.section,
    title: paper.title,
    durationMin: meta.practiceMinutes,
    sections: [
      {
        id: question.section,
        name: meta.name,
        en: meta.en,
        points: question.points,
        minutes: meta.practiceMinutes,
        instructions: meta.instructions,
        questionIds: [question.id],
      },
    ],
    questions: [question],
    contexts: context ? { [question.groupId]: context } : {},
    wordBanks: {},
    maxScore: question.points,
  };
}

/** Judges one answer with the real scorer (D1). Subjective types are rejected, never graded. */
export function judgeQuestion(paper: Paper, question: ExamQuestion, raw: string): QuestionResult {
  if (!isObjectiveQuestion(question)) {
    throw new Error(`单项测试不判定主观题: ${question.type}`);
  }
  const attempt = scoreAttempt(singleQuestionPaper(paper, question), { [question.id]: raw }, drillMeta());
  return attempt.results[0];
}

export interface DrillGuidance extends AdviceEntry {
  tag: string;
  tags: string[];
  /** 'tag' = hand-written entry, 'section' = section fallback, 'generic' = neither existed. */
  source: 'tag' | 'section' | 'generic';
}

export function drillGuidance(question: ExamQuestion, correct: boolean): DrillGuidance {
  const tags = question.tags;
  const hit = tags.find((tag) => hasTagAdvice(tag));
  const entry = adviceForTag(hit ?? tags[0] ?? '', question.section);
  const source: DrillGuidance['source'] = hit ? 'tag' : tags.length ? 'section' : 'generic';
  const label = tags.length ? tags.join(' · ') : SECTION_MAP[question.section].short;
  return {
    tag: hit ?? tags[0] ?? '',
    tags,
    source,
    title: entry.title,
    detail: correct
      ? `答对了：「${label}」这一步的判断是准的，保持同样的顺序——先找依据，再比对选项，最后排除。`
      : entry.detail,
    action: entry.action,
  };
}

export interface DrillFeedback {
  questionId: string;
  correct: boolean;
  earned: number;
  points: number;
  answerText: string;
  userText: string;
  explanation: string;
  guidance: DrillGuidance;
}

/** Everything the reveal card renders: verdict, answer key, explanation and tag guidance. */
export function judgeAnswer(paper: Paper, question: ExamQuestion, raw: string): DrillFeedback {
  const result = judgeQuestion(paper, question, raw);
  if (result.graded !== 'objective' || result.correct === undefined) {
    throw new Error(`单项测试不判定主观题: ${question.type}`);
  }
  return {
    questionId: question.id,
    correct: result.correct,
    earned: result.earned,
    points: result.points,
    answerText: result.answerText ?? question.answerText ?? '',
    userText: result.userText ?? raw,
    explanation:
      question.explanation ?? question.tips?.join(' ') ?? adviceForTag(question.tags[0] ?? '', question.section).detail,
    guidance: drillGuidance(question, result.correct),
  };
}

/** Slim record: never stores the paper (it embeds whole passages and scripts). */
export interface DrillRecord {
  id: string;
  section: SectionId;
  at: string;
  questions: number;
  correct: number;
  earned: number;
  points: number;
  elapsedSec: number;
  wrongTags: string[];
}

export interface DrillRecordInput {
  section: SectionId;
  questions: ExamQuestion[];
  /** Per-question verdicts keyed by question id; unanswered questions are not counted as correct. */
  verdicts: Record<string, { correct: boolean; earned: number; points: number }>;
  elapsedSec: number;
  at?: string;
  id?: string;
}

export function buildDrillRecord({
  section,
  questions,
  verdicts,
  elapsedSec,
  at,
  id,
}: DrillRecordInput): DrillRecord {
  const answered = questions.filter((q) => verdicts[q.id]);
  const correct = answered.filter((q) => verdicts[q.id]?.correct).length;
  const earned = Math.round(answered.reduce((sum, q) => sum + (verdicts[q.id]?.earned ?? 0), 0) * 100) / 100;
  const points = questions.reduce((sum, q) => sum + q.points, 0);
  const wrongTags = answered
    .filter((q) => !verdicts[q.id]?.correct)
    .flatMap((q) => q.tags);
  const stamp = at ?? new Date().toISOString();
  return {
    id: id ?? `drill-${Date.parse(stamp).toString(36)}-${Math.floor(Math.random() * 1e5).toString(36)}`,
    section,
    at: stamp,
    questions: questions.length,
    correct,
    earned,
    points,
    elapsedSec: Math.max(0, Math.round(elapsedSec)),
    wrongTags,
  };
}

/** Groups repeated wrong tags into "tag × count", most frequent first. */
export function groupWrongTags(tags: string[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const tag of tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

function storageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadDrillRecords(): DrillRecord[] {
  if (!storageAvailable()) return [];
  try {
    const raw = window.localStorage.getItem(DRILL_STORAGE_KEY);
    const list = raw ? (JSON.parse(raw) as DrillRecord[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/** Newest first; never touches sh-exam.attempts.v1, so drill runs stay out of 成绩记录/评级. */
export function saveDrillRecord(record: DrillRecord): boolean {
  if (!storageAvailable()) return false;
  try {
    const list = loadDrillRecords().filter((item) => item.id !== record.id);
    list.unshift(record);
    window.localStorage.setItem(DRILL_STORAGE_KEY, JSON.stringify(list.slice(0, MAX_DRILL_RECORDS)));
    return true;
  } catch {
    return false;
  }
}

export function clearDrillRecords(): void {
  if (!storageAvailable()) return;
  try {
    window.localStorage.removeItem(DRILL_STORAGE_KEY);
  } catch {
    // Nothing to do: an unavailable storage already behaves like an empty drill history.
  }
}
