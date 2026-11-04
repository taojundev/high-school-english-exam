import { SECTION_MAP } from '../sections';
import type {
  Attempt,
  KeyPoint,
  KeyPointResult,
  Paper,
  QuestionResult,
  SectionId,
  SectionResult,
  Suggestion,
  TagStat,
} from '../types';
import { buildSuggestions } from './advice';

const roundHalf = (n: number) => Math.round(n * 2) / 2;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export function normalizeText(value: string): string {
  return value
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function normalizeAnswer(value: string): string {
  return normalizeText(value).replace(/[.,;:!?'"]+$/g, '');
}

export function countWords(value: string): number {
  const matches = value.trim().match(/[A-Za-z0-9][A-Za-z0-9'’\-]*/g);
  return matches ? matches.length : 0;
}

export function splitSentences(value: string): string[] {
  return value
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function keyPointCoverage(text: string, points: KeyPoint[] | undefined): KeyPointResult[] {
  const normalized = normalizeText(text);
  return (points ?? []).map((point) => {
    const ok = point.patterns.some((pattern) => {
      try {
        return new RegExp(pattern, 'i').test(normalized);
      } catch {
        return normalized.includes(pattern.toLowerCase());
      }
    });
    return { label: point.label, ok };
  });
}

function matchesObjective(question: { type: string; answerText?: string; accept?: string[] }, raw: string) {
  if (!raw.trim() || !question.answerText) return false;
  const user = normalizeAnswer(raw);
  const accepted = [question.answerText, ...(question.accept ?? [])].map(normalizeAnswer);
  return accepted.includes(user);
}

function hasLongCopy(text: string, source: string): boolean {
  const tokenize = (s: string) => s.toLowerCase().match(/[a-z0-9']+/g) ?? [];
  const sourceWords = tokenize(source);
  const answerWords = tokenize(text);
  if (sourceWords.length < 8 || answerWords.length < 8) return false;
  const sourceShingles = new Set<string>();
  for (let i = 0; i <= sourceWords.length - 8; i++) {
    sourceShingles.add(sourceWords.slice(i, i + 8).join(' '));
  }
  for (let i = 0; i <= answerWords.length - 8; i++) {
    if (sourceShingles.has(answerWords.slice(i, i + 8).join(' '))) return true;
  }
  return false;
}

const LINKERS = [
  'however',
  'therefore',
  'moreover',
  'furthermore',
  'in addition',
  'as a result',
  'for example',
  'for instance',
  'on the other hand',
  'in conclusion',
  'although',
  'while',
  'because',
  'since',
  'but',
  'so',
  'which',
  'finally',
  'first',
  'second',
];

function countLinkers(text: string): number {
  const lower = normalizeText(text);
  return LINKERS.filter((linker) => new RegExp(`\\b${linker}\\b`, 'i').test(lower)).length;
}

function mechanicsScore(text: string): number {
  let score = 1;
  if (/[\u4e00-\u9fff]/.test(text)) score -= 0.5;
  if (/[!?]{2,}|\.{3,}/.test(text)) score -= 0.25;
  const after = text.split(/[.!?]\s+/).slice(1).filter(Boolean);
  const lowercaseStarts = after.filter((s) => /^[a-z]/.test(s)).length;
  if (lowercaseStarts > 0) score -= Math.min(0.5, lowercaseStarts * 0.25);
  return clamp(score, 0, 1);
}

function scoreTranslation(question: Paper['questions'][number], raw: string) {
  const covered = keyPointCoverage(raw, question.keyPoints);
  const coveredCount = covered.filter((c) => c.ok).length;
  const total = covered.length || 1;
  const earned = raw.trim() ? roundHalf((coveredCount / total) * question.points) : 0;
  const missing = covered.filter((c) => !c.ok).map((c) => c.label);
  const feedback = raw.trim()
    ? `关键信息覆盖 ${coveredCount}/${total}${missing.length ? `；待补：${missing.join('、')}` : '，表达完整'}。自动初评按关键信息给分，最终以人工阅卷为准。`
    : '未作答。先拆分中文句子的主干，再确定时态、语态和连接方式。';
  return {
    covered,
    earned,
    correct: earned >= question.points * 0.66,
    feedback,
  };
}

function scoreSummary(question: Paper['questions'][number], raw: string, source: string) {
  const words = countWords(raw);
  const covered = keyPointCoverage(raw, question.keyPoints);
  const total = covered.length || 1;
  const coveredCount = covered.filter((c) => c.ok).length;
  const min = question.minWords ?? 50;
  const max = question.maxWords ?? 80;
  const coverageScore = (coveredCount / total) * 6;
  let lengthScore = 0;
  if (words > 0) {
    if (words >= min && words <= max) lengthScore = 2;
    else if (words >= min * 0.8 && words <= max * 1.25) lengthScore = 1;
    else lengthScore = 0.5;
  }
  const sentences = splitSentences(raw);
  let expression = raw.trim() ? 2 : 0;
  if (sentences.length < 2) expression -= 0.5;
  if (sentences.length > 6) expression -= 0.5;
  if (countLinkers(raw) < 2) expression -= 0.5;
  if (hasLongCopy(raw, source)) expression -= 0.5;
  expression = Math.max(0, expression);
  const earned = clamp(roundHalf(coverageScore + lengthScore + expression), 0, question.points);
  const missing = covered.filter((c) => !c.ok).map((c) => c.label);
  const feedback = raw.trim()
    ? `要点覆盖 ${coveredCount}/${total}（${coverageScore.toFixed(1)}/6）；词数 ${words}（${lengthScore}/2）；连贯与压缩 ${expression.toFixed(1)}/2。${missing.length ? `待补要点：${missing.join('、')}。` : '要点较完整。'}自动初评仅供练习参考。`
    : '未作答。先通读原文，划出主题句和每段关键词，再用自己的话压缩成 3–4 句。';
  return {
    covered,
    earned,
    correct: earned >= question.points * 0.6,
    feedback,
  };
}

function scoreWriting(question: Paper['questions'][number], raw: string) {
  const words = countWords(raw);
  const covered = keyPointCoverage(raw, question.keyPoints);
  const total = covered.length || 1;
  const coveredCount = covered.filter((c) => c.ok).length;
  const content = (coveredCount / total) * 10;
  const empty = words === 0;
  const min = question.minWords ?? 120;
  const max = question.maxWords ?? 150;
  let lengthScore = 0;
  if (words > 0) {
    if (words >= min && words <= max) lengthScore = 3;
    else if (words >= min * 0.8 && words <= max * 1.25) lengthScore = 2;
    else lengthScore = 1;
  }
  const sentences = splitSentences(raw);
  const average = sentences.length ? words / sentences.length : 0;
  const sentenceVariety = empty
    ? 0
    : sentences.length >= 4 && average >= 8 && average <= 28
      ? 2
      : sentences.length >= 3
        ? 1
        : 0.5;
  const tokens = normalizeText(raw).match(/[a-z']+/g) ?? [];
  const uniqueRatio = tokens.length ? new Set(tokens).size / tokens.length : 0;
  const vocabulary = words === 0 ? 0 : uniqueRatio >= 0.45 ? 2 : uniqueRatio >= 0.35 ? 1.5 : 1;
  const mechanics = words === 0 ? 0 : mechanicsScore(raw);
  const language = clamp(lengthScore + sentenceVariety + vocabulary + mechanics, 0, 8);
  const paragraphs = raw.split(/\n+/).filter((p) => p.trim()).length;
  const paragraphScore = empty ? 0 : paragraphs >= 3 ? 3 : paragraphs === 2 ? 2 : 1;
  const linkerScore = countLinkers(raw) >= 3 ? 2 : countLinkers(raw) >= 1 ? 1 : 0;
  const frameScore = empty ? 0 : sentences.length >= 4 ? 2 : 1;
  const organization = paragraphScore + linkerScore + frameScore;
  const earned = clamp(roundHalf(content + language + organization), 0, question.points);
  const missing = covered.filter((c) => !c.ok).map((c) => c.label);
  const feedback = `内容要点 ${coveredCount}/${total}（${content.toFixed(1)}/10）；语言 ${language.toFixed(1)}/8；结构 ${organization}/7；共 ${words} 词。${missing.length ? `可能遗漏：${missing.join('、')}。` : '要点覆盖较完整。'}自动估分仅供练习参考，请结合评分细则与范文自评。`;
  return {
    covered,
    earned,
    correct: earned >= question.points * 0.6,
    feedback,
  };
}

export interface AttemptMeta {
  startedAt: string;
  submittedAt: string;
  durationUsedSec: number;
  timeBySection: Partial<Record<SectionId, number>>;
  transcriptReveals: string[];
  replayCounts: Record<string, number>;
  id?: string;
}

export function scoreAttempt(
  paper: Paper,
  answers: Record<string, string>,
  meta: AttemptMeta,
): Attempt {
  const results: QuestionResult[] = paper.questions.map((q) => {
    const raw = answers[q.id] ?? '';
    const base = {
      id: q.id,
      sourceId: q.sourceId,
      section: q.section,
      type: q.type,
      number: q.number,
      points: q.points,
      tags: q.tags,
      difficulty: q.difficulty,
    };

    if (q.type === 'mcq') {
      const selected = raw === '' ? undefined : Number(raw);
      const correct = selected === q.answer;
      return {
        ...base,
        earned: correct ? q.points : 0,
        correct,
        selected,
        answer: q.answer,
        answerText: q.answerText,
        userText: selected === undefined ? '' : q.options?.[selected] ?? '',
      };
    }

    if (q.type === 'fill' || q.type === 'vocab') {
      const correct = matchesObjective(q, raw);
      return {
        ...base,
        earned: correct ? q.points : 0,
        correct,
        answerText: q.answerText,
        userText: raw,
      };
    }

    if (q.type === 'translation') {
      const scored = scoreTranslation(q, raw);
      return {
        ...base,
        earned: scored.earned,
        correct: scored.correct,
        answerText: q.reference,
        userText: raw,
        covered: scored.covered,
        feedback: scored.feedback,
      };
    }

    if (q.type === 'summary') {
      const source = paper.contexts[q.groupId]?.text ?? '';
      const scored = scoreSummary(q, raw, source);
      return {
        ...base,
        earned: scored.earned,
        correct: scored.correct,
        answerText: q.reference,
        userText: raw,
        covered: scored.covered,
        feedback: scored.feedback,
      };
    }

    const scored = scoreWriting(q, raw);
    return {
      ...base,
      earned: scored.earned,
      correct: scored.correct,
      answerText: q.reference,
      userText: raw,
      covered: scored.covered,
      feedback: scored.feedback,
    };
  });

  const sectionResults: SectionResult[] = paper.sections.map((section) => {
    const own = results.filter((r) => r.section === section.id);
    const score = roundHalf(own.reduce((n, r) => n + r.earned, 0));
    const correct = own.filter((r) => r.correct).length;
    const tagMap = new Map<string, { correct: number; total: number }>();
    for (const result of own) {
      for (const tag of result.tags) {
        const entry = tagMap.get(tag) ?? { correct: 0, total: 0 };
        entry.total += 1;
        if (result.correct) entry.correct += 1;
        tagMap.set(tag, entry);
      }
    }
    const tagStats: TagStat[] = [...tagMap.entries()]
      .map(([tag, value]) => ({
        tag,
        section: section.id,
        correct: value.correct,
        total: value.total,
        accuracy: value.total ? value.correct / value.total : 0,
      }))
      .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total);
    return {
      id: section.id,
      name: SECTION_MAP[section.id].name,
      en: SECTION_MAP[section.id].en,
      score,
      max: section.points,
      correct,
      total: own.length,
      accuracy: own.length ? correct / own.length : 0,
      tagStats,
    };
  });

  const tagStats = sectionResults.flatMap((s) => s.tagStats);
  const totalScore = roundHalf(results.reduce((n, r) => n + r.earned, 0));
  const unanswered = results.filter((r) => !(answers[r.id] ?? '').trim()).length;
  const suggestions = buildSuggestions({
    results,
    sectionResults,
    tagStats,
    timeBySection: meta.timeBySection,
    totalScore,
    maxScore: paper.maxScore,
    paper,
    unanswered,
  });

  return {
    id: meta.id ?? `attempt-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e5).toString(36)}`,
    paper,
    answers,
    results,
    sectionResults,
    tagStats,
    totalScore,
    maxScore: paper.maxScore,
    startedAt: meta.startedAt,
    submittedAt: meta.submittedAt,
    durationUsedSec: meta.durationUsedSec,
    timeBySection: meta.timeBySection,
    suggestions,
    transcriptReveals: meta.transcriptReveals,
    replayCounts: meta.replayCounts,
  };
}

export function formatScore(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export type { Suggestion };
