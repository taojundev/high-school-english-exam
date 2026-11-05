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

/** Sections whose marks are a rough estimate, never a verdict on correctness. */
const ESTIMATED_SECTIONS = new Set<SectionId>(['translation', 'summary', 'writing']);

/** An automatic estimate never claims full marks. */
const ESTIMATE_MAX_RATE = 0.9;
/** A low-confidence answer (word salad, way off length, copied text) is capped at half marks. */
const LOW_CONFIDENCE_MAX_RATE = 0.5;

export function isEstimatedSection(section: SectionId): boolean {
  return ESTIMATED_SECTIONS.has(section);
}

/** Old attempts have no `graded` field, so fall back to the section. */
export function isEstimatedResult(result: Pick<QuestionResult, 'section' | 'graded'>): boolean {
  return result.graded === 'estimated' || (result.graded === undefined && isEstimatedSection(result.section));
}

function estimateCap(points: number, lowConfidence: boolean): number {
  const ceiling = roundHalf(points * ESTIMATE_MAX_RATE);
  return lowConfidence ? Math.min(ceiling, points * LOW_CONFIDENCE_MAX_RATE) : ceiling;
}

/** Apply the estimate ceiling; low-confidence answers are also capped at half marks. */
function capEstimate(rawEarned: number, points: number, lowConfidence: boolean): number {
  return clamp(Math.min(rawEarned, estimateCap(points, lowConfidence)), 0, points);
}

export interface ScoreSplit {
  /** Real objective marks and their maximum. Rating is computed from these two only. */
  objectiveScore: number;
  objectiveMax: number;
  /** Estimated subjective marks and their maximum. Never part of the rating. */
  subjectiveEstimate: number;
  subjectiveMax: number;
  /** Objective + estimate, for display only. */
  totalScore: number;
  maxScore: number;
}

export function scoreSplit(results: QuestionResult[]): ScoreSplit {
  let objectiveScore = 0;
  let objectiveMax = 0;
  let subjectiveEstimate = 0;
  let subjectiveMax = 0;
  for (const result of results) {
    if (isEstimatedResult(result)) {
      subjectiveEstimate += result.earned;
      subjectiveMax += result.points;
    } else {
      objectiveScore += result.earned;
      objectiveMax += result.points;
    }
  }
  return {
    objectiveScore: roundHalf(objectiveScore),
    objectiveMax: roundHalf(objectiveMax),
    subjectiveEstimate: roundHalf(subjectiveEstimate),
    subjectiveMax: roundHalf(subjectiveMax),
    totalScore: roundHalf(objectiveScore + subjectiveEstimate),
    maxScore: roundHalf(objectiveMax + subjectiveMax),
  };
}

/** Attempts saved before r4 lack the split fields, so derive them from the stored results. */
export function attemptScoreSplit(attempt: Pick<Attempt, 'results'>): ScoreSplit {
  return scoreSplit(attempt.results);
}

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

interface Hit {
  label: string;
  ok: boolean;
  /** Token index ranges (inclusive) where the key point matched. */
  spans: Array<[number, number]>;
}

const TOKEN_RE = /[a-z0-9][a-z0-9'\-]*/g;

/** Key point coverage that also records which tokens matched, so callers can judge structure. */
function keyPointHits(text: string, points: KeyPoint[] | undefined): Hit[] {
  const normalized = normalizeText(text);
  const starts: number[] = [];
  TOKEN_RE.lastIndex = 0;
  for (let match = TOKEN_RE.exec(normalized); match; match = TOKEN_RE.exec(normalized)) {
    starts.push(match.index);
  }
  const tokenAt = (offset: number) => {
    let index = 0;
    for (let i = 0; i < starts.length; i++) {
      if (starts[i] <= offset) index = i;
      else break;
    }
    return index;
  };
  return (points ?? []).map((point) => {
    const spans: Array<[number, number]> = [];
    for (const pattern of point.patterns) {
      let regex: RegExp;
      try {
        regex = new RegExp(pattern, 'gi');
      } catch {
        const lower = pattern.toLowerCase();
        let at = normalized.indexOf(lower);
        while (at !== -1) {
          spans.push([tokenAt(at), tokenAt(at + lower.length - 1)]);
          at = normalized.indexOf(lower, at + lower.length);
        }
        continue;
      }
      for (let match = regex.exec(normalized); match; match = regex.exec(normalized)) {
        if (!match[0].length) {
          regex.lastIndex += 1;
          continue;
        }
        spans.push([tokenAt(match.index), tokenAt(match.index + match[0].length - 1)]);
      }
    }
    return { label: point.label, ok: spans.length > 0, spans };
  });
}

const AUX_AND_IRREGULAR = new Set([
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'has', 'have', 'had', 'do', 'does', 'did',
  'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'ought',
  'became', 'came', 'felt', 'fell', 'found', 'gave', 'got', 'grew', 'heard', 'held',
  'kept', 'knew', 'lay', 'led', 'left', 'lost', 'made', 'meant', 'met', 'paid', 'ran',
  'said', 'saw', 'sent', 'set', 'spoke', 'spent', 'stood', 'took', 'told', 'thought',
  'understood', 'went', 'wore', 'won', 'wrote', 'ate', 'bought', 'brought', 'built',
  'caught', 'chose', 'drove', 'fought', 'hit', 'hurt', 'read', 'rode', 'rose', 'sold',
  'slept', 'taught', 'threw', 'woke',
]);

const FUNCTION_WORDS = new Set([
  'a', 'an', 'the', 'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their',
  'i', 'me', 'my', 'we', 'us', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her',
  'of', 'to', 'in', 'on', 'at', 'by', 'for', 'with', 'about', 'into', 'from', 'as', 'than',
  'and', 'or', 'but', 'so', 'if', 'when', 'while', 'because', 'although', 'though', 'that',
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'do', 'does', 'did',
  'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must',
  'has', 'have', 'had', 'not', 'no', 'very', 'more', 'most', 'also', 'there', 'here',
]);

const VERB_BASES = new Set([
  'act', 'add', 'advise', 'affect', 'agree', 'allow', 'apply', 'argue', 'ask', 'attend',
  'avoid', 'become', 'begin', 'believe', 'block', 'bring', 'build', 'buy', 'call', 'catch',
  'cause', 'change', 'choose', 'close', 'combine', 'come', 'communicate', 'compare', 'complain',
  'compete', 'consider', 'continue', 'cover', 'create', 'cut', 'decide', 'decrease', 'describe',
  'design', 'develop', 'die', 'discuss', 'divide', 'drive', 'eat', 'encourage', 'end', 'enjoy',
  'exercise', 'exist', 'expect', 'explain', 'fall', 'feel', 'fight', 'find', 'finish', 'fix',
  'follow', 'forget', 'get', 'give', 'go', 'grow', 'hand', 'happen', 'hate', 'hear', 'help',
  'hold', 'hope', 'ignore', 'imagine', 'improve', 'include', 'increase', 'introduce', 'join',
  'keep', 'know', 'lead', 'learn', 'leave', 'let', 'lie', 'like', 'limit', 'live', 'look',
  'lose', 'make', 'matter', 'mean', 'meet', 'move', 'need', 'note', 'occur', 'offer', 'open',
  'operate', 'pass', 'pay', 'plan', 'play', 'postpone', 'practise', 'prefer', 'prepare',
  'present', 'prevent', 'produce', 'protect', 'provide', 'put', 'raise', 'reach', 'read',
  'realize', 'receive', 'recommend', 'reduce', 'refuse', 'release', 'remain', 'remember',
  'remove', 'repair', 'report', 'require', 'respect', 'respond', 'return', 'ride', 'rise',
  'run', 'say', 'see', 'seem', 'sell', 'send', 'share', 'show', 'sit', 'sleep', 'sound',
  'speak', 'spend', 'spread', 'stand', 'start', 'stay', 'stop', 'study', 'succeed', 'suggest',
  'support', 'survive', 'take', 'talk', 'teach', 'tell', 'thank', 'think', 'touch', 'travel',
  'try', 'turn', 'understand', 'use', 'visit', 'wait', 'walk', 'want', 'warn', 'wear',
  'welcome', 'win', 'wonder', 'work', 'worry', 'write',
]);

function baseForms(token: string): string[] {
  const forms = [token];
  const add = (value: string) => {
    if (!value) return;
    forms.push(value);
    if (/([b-df-hj-np-tv-z])\1$/.test(value)) forms.push(value.slice(0, -1));
  };
  if (token.endsWith('ies')) add(`${token.slice(0, -3)}y`);
  if (token.endsWith('es')) add(token.slice(0, -2));
  if (token.endsWith('s')) add(token.slice(0, -1));
  if (token.endsWith('ing')) {
    add(token.slice(0, -3));
    add(`${token.slice(0, -3)}e`);
  }
  if (token.endsWith('ed')) {
    add(token.slice(0, -2));
    add(token.slice(0, -1));
  }
  return forms;
}

function isVerbish(token: string): boolean {
  if (AUX_AND_IRREGULAR.has(token)) return true;
  if (FUNCTION_WORDS.has(token)) return false;
  if (VERB_BASES.has(token)) return true;
  return baseForms(token).some((form) => VERB_BASES.has(form));
}

interface ClauseShape {
  /** At least one sentence is long enough to be a real S-V(-O) clause. */
  clause: boolean;
  /** Covered key points only appear inside one short window of a longer answer. */
  crammed: boolean;
  /** Number of sentences that contain at least one covered key point. */
  spread: number;
}

const CRAM_WINDOW = 5;

const MIN_CONTENT_DENSITY = 0.4;
const MIN_PURE_FILLER_DENSITY = 0.25;
/** A back-to-back repeated filler token is a strong enough sign on its own at this density. */
const MIN_REPEATED_FILLER_DENSITY = 0.6;

/**
 * A padded answer made of function words ("... the the the") can still pass the word-count gate.
 * Treat it as low confidence when the content-word share is low and the padding either repeats a
 * token back to back or leaves almost no content words at all.
 *
 * A keyword list that happens to contain verbs ("Seeing the the the the Seeing volunteer moved")
 * can clear the clause gate, so immediate repetition must also flag a moderately content-light
 * answer. That only lowers the estimate; it does not change the coverage gates.
 */
function isLowContentDensity(text: string): boolean {
  const tokens = normalizeText(text).match(TOKEN_RE) ?? [];
  if (!tokens.length) return false;
  const content = tokens.filter(
    (token) => !FUNCTION_WORDS.has(token) && !AUX_AND_IRREGULAR.has(token),
  ).length;
  const ratio = content / tokens.length;
  const repeated = tokens.some((token, index) => index > 0 && token === tokens[index - 1]);
  return (
    (ratio < MIN_CONTENT_DENSITY && (repeated || ratio < MIN_PURE_FILLER_DENSITY)) ||
    (repeated && ratio < MIN_REPEATED_FILLER_DENSITY)
  );
}

function clauseShape(raw: string, hits: Hit[]): ClauseShape {
  const sentences = splitSentences(raw);
  const clause = sentences.some((sentence) => {
    const tokens = normalizeText(sentence).match(TOKEN_RE) ?? [];
    return tokens.length >= 6 && tokens.some(isVerbish);
  });
  const hitTokens: number[] = [];
  for (const hit of hits) {
    if (!hit.ok) continue;
    for (const [start, end] of hit.spans) {
      hitTokens.push(start, end);
    }
  }
  const window = hitTokens.length ? Math.max(...hitTokens) - Math.min(...hitTokens) + 1 : Number.POSITIVE_INFINITY;
  const words = countWords(raw);
  // Points squeezed into one short phrase of an otherwise longer answer are keyword stuffing,
  // not a translation. A short answer (<= window + 4 words) cannot help clustering them.
  const coveredCount = hits.filter((hit) => hit.ok).length;
  const crammed =
    coveredCount >= 2 && hitTokens.length > 0 && window <= CRAM_WINDOW && words > window + 4;
  const pointSentences = new Set<number>();
  for (const hit of hits) {
    if (!hit.ok) continue;
    for (const [start] of hit.spans) {
      let offset = 0;
      let seen = 0;
      for (const sentence of sentences) {
        const count = (normalizeText(sentence).match(TOKEN_RE) ?? []).length;
        if (start >= offset && start < offset + count) {
          pointSentences.add(seen);
          break;
        }
        offset += count;
        seen += 1;
      }
    }
  }
  return { clause, crammed, spread: pointSentences.size };
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
  const words = countWords(raw);
  const referenceWords = countWords(question.reference ?? '');
  // Longer answers are required: a keyword plus a couple of function words is not a translation.
  const minWords = Math.max(6, Math.ceil(referenceWords * 0.6));
  const maxWords = Math.max(minWords + 4, Math.ceil(referenceWords * 2.5));
  const hits = keyPointHits(raw, question.keyPoints);
  const covered = hits.map((hit) => ({ label: hit.label, ok: hit.ok }));
  const coveredCount = covered.filter((c) => c.ok).length;
  const total = covered.length || 1;
  const shape = clauseShape(raw, hits);
  const hasStructure = shape.clause && !shape.crammed;
  const tooShort = words > 0 && words < minWords;
  const tooLong = words > maxWords;

  let contentRatio = coveredCount / total;
  // Keyword lists ("seeing volunteer moved") are not a translation: no full coverage without a clause.
  if (!hasStructure) contentRatio = Math.min(contentRatio, 0.5);
  if (tooShort) contentRatio = Math.min(contentRatio, 0.4);
  if (tooLong) contentRatio = Math.min(contentRatio, 0.8);
  let rawEarned = raw.trim() ? roundHalf(contentRatio * question.points) : 0;
  // Missing length or clause quality caps the content item at 1 point, whatever the coverage.
  if (raw.trim() && (tooShort || !hasStructure)) rawEarned = Math.min(rawEarned, 1);
  const missing = covered.filter((c) => !c.ok).map((c) => c.label);
  // A padded answer can be long enough yet still mostly function words.
  const lowDensity = Boolean(raw.trim()) && isLowContentDensity(raw);
  const lowConfidence = Boolean(raw.trim()) && (!hasStructure || tooShort || tooLong || lowDensity);
  const earned = capEstimate(rawEarned, question.points, lowConfidence);
  const reason = !shape.clause
    ? '当前作答缺少完整句子，只能按关键词粗略初评'
    : shape.crammed
      ? '关键信息被压缩在同一个短语里，缺少完整句子支撑，只能按关键词粗略初评'
      : tooShort
        ? `当前 ${words} 词明显少于参考译文的 ${referenceWords} 词`
        : tooLong
          ? `当前 ${words} 词明显多于参考译文的 ${referenceWords} 词`
          : '实词比例过低，更像虚词填充而非译文';
  const feedback = raw.trim()
    ? `关键信息覆盖 ${coveredCount}/${total}${missing.length ? `；待补：${missing.join('、')}` : ''}。${lowConfidence ? `${reason}，以下为低置信度初评。` : '句法与篇幅基本达标。'}自动估分按关键信息覆盖规则估算，不判断语义是否等价，也不宣称满分，最终以人工阅卷为准。`
    : '未作答。先拆分中文句子的主干，再确定时态、语态和连接方式。';
  return { covered, earned, feedback, lowConfidence };
}

function scoreSummary(question: Paper['questions'][number], raw: string, source: string) {
  const words = countWords(raw);
  const hits = keyPointHits(raw, question.keyPoints);
  const covered = hits.map((hit) => ({ label: hit.label, ok: hit.ok }));
  const total = covered.length || 1;
  const coveredCount = covered.filter((c) => c.ok).length;
  const min = question.minWords ?? 50;
  const max = question.maxWords ?? 80;
  const sentences = splitSentences(raw);
  const hasClause = sentences.some((sentence) => countWords(sentence) >= 5);
  const shape = clauseShape(raw, hits);
  // A 46-word keyword list is one run-on "sentence" with every point crammed into it, not a summary.
  const listLike =
    sentences.length < 2 ||
    (sentences.length > 0 && words / sentences.length > 32) ||
    (coveredCount >= 2 && shape.spread < 2);
  const hasStructure = hasClause && !shape.crammed && !listLike;
  const copied = hasLongCopy(raw, source);
  const farTooLong = words > max * 1.25;
  const farTooShort = words > 0 && words < min * 0.8;

  let coverageScore = (coveredCount / total) * 6;
  // Copying the source, listing keywords, or blowing past the word limit must not earn full coverage.
  if (farTooLong) coverageScore = Math.min(coverageScore, 2);
  if (farTooShort || !hasStructure) coverageScore = Math.min(coverageScore, 2);
  if (copied) coverageScore *= 0.5;

  let lengthScore = 0;
  if (words > 0) {
    if (words >= min && words <= max) lengthScore = 2;
    else if (words >= min * 0.8 && words <= max * 1.25) lengthScore = 1;
    else lengthScore = 0.5;
  }
  let expression = raw.trim() ? 2 : 0;
  if (sentences.length < 2) expression -= 0.5;
  if (sentences.length > 6) expression -= 0.5;
  if (countLinkers(raw) < 2) expression -= 0.5;
  if (copied) expression -= 0.5;
  expression = Math.max(0, expression);
  const rawEarned = clamp(roundHalf(coverageScore + lengthScore + expression), 0, question.points);
  const missing = covered.filter((c) => !c.ok).map((c) => c.label);
  const lowConfidence = Boolean(raw.trim()) && (farTooLong || farTooShort || !hasStructure || copied);
  const earned = capEstimate(rawEarned, question.points, lowConfidence);
  const confidenceNote = copied
    ? '检测到与原文连续重合的片段，覆盖项按减半计分，这是低置信度初评。'
    : farTooLong
      ? `当前 ${words} 词远超 ${max} 词上限，覆盖项已封顶，这是低置信度初评。`
      : farTooShort
        ? `当前 ${words} 词明显少于 ${min} 词下限，覆盖项已封顶，这是低置信度初评。`
        : listLike
          ? `当前作答更像要点清单（${sentences.length} 句、要点集中在 ${shape.spread} 句内），缺少成句概括，覆盖项已封顶，这是低置信度初评。`
          : !hasStructure
            ? '当前作答没有完整句子，不能按要点完整计分，这是低置信度初评。'
            : '';
  const feedback = raw.trim()
    ? `要点覆盖 ${coveredCount}/${total}（${coverageScore.toFixed(1)}/6）；词数 ${words}（${lengthScore}/2）；连贯与压缩 ${expression.toFixed(1)}/2。${missing.length ? `待补要点：${missing.join('、')}。` : copied || farTooLong || farTooShort || !hasStructure ? '' : '要点较完整。'}${confidenceNote}自动估分按关键词覆盖规则估算，不判断语义是否等价，也不宣称满分，最终以人工阅卷为准。`
    : '未作答。先通读原文，划出主题句和每段关键词，再用自己的话压缩成 3–4 句。';
  return { covered, earned, feedback, lowConfidence };
}

function scoreWriting(question: Paper['questions'][number], raw: string) {
  const words = countWords(raw);
  const covered = keyPointCoverage(raw, question.keyPoints);
  const total = covered.length || 1;
  const coveredCount = covered.filter((c) => c.ok).length;
  const empty = words === 0;
  const min = question.minWords ?? 120;
  const max = question.maxWords ?? 150;
  const sentences = splitSentences(raw);
  const hasStructure = sentences.some((sentence) => countWords(sentence) >= 5);

  let content = (coveredCount / total) * 10;
  // A <80-word answer cannot have developed the required content, even if every keyword appears.
  if (words < 80) content = Math.min(content, 2);
  if (!hasStructure) content = Math.min(content, 2);

  let lengthScore = 0;
  if (words > 0) {
    if (words >= min && words <= max) lengthScore = 3;
    else if (words >= min * 0.8 && words <= max * 1.25) lengthScore = 2;
    else if (words >= min * 0.5) lengthScore = 1;
  }
  const average = sentences.length ? words / sentences.length : 0;
  const sentenceVariety = empty || !hasStructure
    ? 0
    : sentences.length >= 4 && average >= 8 && average <= 28
      ? 2
      : sentences.length >= 3
        ? 1
        : 0.5;
  const tokens = normalizeText(raw).match(/[a-z']+/g) ?? [];
  const uniqueRatio = tokens.length ? new Set(tokens).size / tokens.length : 0;
  let vocabulary = words === 0 ? 0 : uniqueRatio >= 0.45 ? 2 : uniqueRatio >= 0.35 ? 1.5 : 1;
  if (words > 0 && words < min * 0.4) vocabulary = Math.min(vocabulary, 1);
  const mechanics = words === 0 ? 0 : mechanicsScore(raw);
  const language = clamp(lengthScore + sentenceVariety + vocabulary + mechanics, 0, 8);
  const paragraphs = raw.split(/\n+/).filter((p) => p.trim()).length;
  let paragraphScore = empty ? 0 : paragraphs >= 3 ? 3 : paragraphs === 2 ? 2 : 1;
  const linkerScore = countLinkers(raw) >= 3 ? 2 : countLinkers(raw) >= 1 ? 1 : 0;
  const frameScore = empty ? 0 : sentences.length >= 4 ? 2 : 1;
  let organization = paragraphScore + linkerScore + frameScore;
  if (words > 0 && words < min * 0.4) {
    paragraphScore = Math.min(paragraphScore, 1);
    organization = Math.min(organization, 1);
  }
  const rawEarned = clamp(roundHalf(content + language + organization), 0, question.points);
  const missing = covered.filter((c) => !c.ok).map((c) => c.label);
  const farTooLong = words > max * 1.25;
  const farTooShort = words > 0 && words < min * 0.8;
  const lowConfidence = Boolean(raw.trim()) && (words < 80 || farTooShort || farTooLong || !hasStructure);
  const earned = capEstimate(rawEarned, question.points, lowConfidence);
  const confidenceNote = words < 80
    ? `当前仅 ${words} 词（建议 ${min}–${max} 词），内容项上限为 2/10，这是低置信度初评。`
    : farTooShort
      ? `当前 ${words} 词低于建议区间 ${min}–${max} 词，这是低置信度初评。`
      : farTooLong
        ? `当前 ${words} 词超出建议上限，内容与语言得分可能高估，这是低置信度初评。`
        : !hasStructure
          ? '当前作答没有完整句子，只能作低置信度初评。'
          : '';
  const feedback = `内容要点 ${coveredCount}/${total}（${content.toFixed(1)}/10）；语言 ${language.toFixed(1)}/8；结构 ${organization}/7；共 ${words} 词。${missing.length ? `可能遗漏：${missing.join('、')}。` : farTooShort || words < 80 ? '' : '要点覆盖较完整。'}${confidenceNote}自动估分按关键词覆盖规则估算，不判断语义是否等价，也不宣称满分，最终以人工阅卷为准。`;
  return { covered, earned, feedback, lowConfidence };
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
        graded: 'objective',
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
        graded: 'objective',
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
        graded: 'estimated',
        answerText: q.reference,
        userText: raw,
        covered: scored.covered,
        feedback: scored.feedback,
        lowConfidence: scored.lowConfidence,
      };
    }

    if (q.type === 'summary') {
      const source = paper.contexts[q.groupId]?.text ?? '';
      const scored = scoreSummary(q, raw, source);
      return {
        ...base,
        earned: scored.earned,
        graded: 'estimated',
        answerText: q.reference,
        userText: raw,
        covered: scored.covered,
        feedback: scored.feedback,
        lowConfidence: scored.lowConfidence,
      };
    }

    const scored = scoreWriting(q, raw);
    return {
      ...base,
      earned: scored.earned,
      graded: 'estimated',
      answerText: q.reference,
      userText: raw,
      covered: scored.covered,
      feedback: scored.feedback,
      lowConfidence: scored.lowConfidence,
    };
  });

  const sectionResults: SectionResult[] = paper.sections.map((section) => {
    const own = results.filter((r) => r.section === section.id);
    const score = roundHalf(own.reduce((n, r) => n + r.earned, 0));
    // "correct" is deliberately objective-only; subjective marks are tracked as score rate.
    const objectiveOwn = own.filter((r) => r.type === 'mcq' || r.type === 'fill' || r.type === 'vocab');
    const correct = objectiveOwn.filter((r) => r.correct).length;
    const scoreRate = section.points > 0 ? score / section.points : 0;
    const tagMap = new Map<string, { correct: number; total: number; earned: number; points: number }>();
    for (const result of own) {
      for (const tag of result.tags) {
        const entry = tagMap.get(tag) ?? { correct: 0, total: 0, earned: 0, points: 0 };
        entry.total += 1;
        entry.points += result.points;
        entry.earned += result.earned;
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
        earned: value.earned,
        points: value.points,
        accuracy: value.points ? value.earned / value.points : 0,
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
      scoreRate,
      accuracy: scoreRate,
      tagStats,
    };
  });

  const tagStats = sectionResults.flatMap((s) => s.tagStats);
  const split = scoreSplit(results);
  const totalScore = split.totalScore;
  const objectiveScore = split.objectiveScore;
  const objectiveMax = split.objectiveMax;
  const subjectiveEstimate = split.subjectiveEstimate;
  const subjectiveMax = split.subjectiveMax;
  const unanswered = results.filter((r) => !(answers[r.id] ?? '').trim()).length;
  const suggestions = buildSuggestions({
    results,
    sectionResults,
    tagStats,
    timeBySection: meta.timeBySection,
    objectiveScore,
    objectiveMax,
    subjectiveEstimate,
    subjectiveMax,
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
    objectiveScore,
    objectiveMax,
    subjectiveEstimate,
    subjectiveMax,
    startedAt: meta.startedAt,
    submittedAt: meta.submittedAt,
    durationUsedSec: meta.durationUsedSec,
    timeBySection: meta.timeBySection,
    suggestions,
    transcriptReveals: meta.transcriptReveals,
    replayCounts: meta.replayCounts,
    scoringVersion: 3,
  };
}

export function formatScore(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export type { Suggestion };
