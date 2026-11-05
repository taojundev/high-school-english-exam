export type SectionId =
  | 'listening'
  | 'grammar'
  | 'vocabulary'
  | 'cloze'
  | 'reading'
  | 'translation'
  | 'summary'
  | 'writing';

export type Difficulty = 1 | 2 | 3;

export type QuestionType = 'mcq' | 'fill' | 'vocab' | 'translation' | 'summary' | 'writing';

export interface KeyPoint {
  label: string;
  /** Regex fragments; any match counts as covered. */
  patterns: string[];
}

export interface ListeningShortItem {
  id: string;
  script: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  tags: string[];
  difficulty: Difficulty;
}

export interface ListeningLongQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  tags: string[];
  difficulty: Difficulty;
}

export interface ListeningLongItem {
  id: string;
  title: string;
  script: string;
  questions: ListeningLongQuestion[];
  difficulty: Difficulty;
}

export interface GrammarMCQItem {
  id: string;
  stem: string;
  options: string[];
  answer: number;
  explanation: string;
  tags: string[];
  difficulty: Difficulty;
}

export interface GrammarFillItem {
  id: string;
  stem: string;
  hint?: string;
  answer: string;
  accept?: string[];
  explanation: string;
  tags: string[];
  difficulty: Difficulty;
}

export interface VocabularyItem {
  id: string;
  sentence: string;
  answer: string;
  distractors: string[];
  explanation: string;
  tags: string[];
  difficulty: Difficulty;
}

export interface ClozeBlank {
  options: string[];
  answer: number;
  explanation: string;
  tags: string[];
}

export interface ClozeItem {
  id: string;
  title: string;
  text: string;
  blanks: ClozeBlank[];
  difficulty: Difficulty;
}

export interface ReadingQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  tags: string[];
  difficulty: Difficulty;
}

export interface ReadingItem {
  id: string;
  title: string;
  text: string;
  questions: ReadingQuestion[];
  difficulty: Difficulty;
}

export interface TranslationItem {
  id: string;
  chinese: string;
  reference: string;
  keyPoints: KeyPoint[];
  tips: string[];
  tags: string[];
  difficulty: Difficulty;
}

export interface SummaryItem {
  id: string;
  title: string;
  text: string;
  prompt: string;
  keyPoints: KeyPoint[];
  sample: string;
  minWords: number;
  maxWords: number;
  tips: string[];
  difficulty: Difficulty;
}

export interface WritingItem {
  id: string;
  title: string;
  prompt: string;
  requirements: string[];
  keyPoints: KeyPoint[];
  sample: string;
  minWords: number;
  maxWords: number;
  tips: string[];
  difficulty: Difficulty;
}

export interface Bank {
  listeningShort: ListeningShortItem[];
  listeningLong: ListeningLongItem[];
  grammarMcq: GrammarMCQItem[];
  grammarFill: GrammarFillItem[];
  vocabulary: VocabularyItem[];
  cloze: ClozeItem[];
  reading: ReadingItem[];
  translation: TranslationItem[];
  summary: SummaryItem[];
  writing: WritingItem[];
}

export interface QuestionContext {
  kind: 'dialogue' | 'monologue' | 'passage';
  title?: string;
  text?: string;
  audioScript?: string;
  audioLabel?: string;
}

export interface ExamQuestion {
  id: string;
  sourceId: string;
  section: SectionId;
  type: QuestionType;
  number: number;
  points: number;
  difficulty: Difficulty;
  tags: string[];
  groupId: string;
  stem: string;
  options?: string[];
  answer?: number;
  answerText?: string;
  accept?: string[];
  explanation?: string;
  reference?: string;
  keyPoints?: KeyPoint[];
  sample?: string;
  requirements?: string[];
  minWords?: number;
  maxWords?: number;
  tips?: string[];
  /** True when this item was drawn from the seen pool because the unseen pool ran out. */
  review?: boolean;
}

export interface PaperSection {
  id: SectionId;
  name: string;
  en: string;
  points: number;
  minutes: number;
  instructions: string;
  questionIds: string[];
}

export type ExamMode = 'full' | 'section';

export interface Paper {
  version: 1;
  id: string;
  seed: number;
  /** Difficulty filter used to build the paper; needed to reproduce it from its seed. */
  difficulty?: GenerateOptions['difficulty'];
  createdAt: string;
  mode: ExamMode;
  sectionFilter?: SectionId;
  title: string;
  durationMin: number;
  sections: PaperSection[];
  questions: ExamQuestion[];
  contexts: Record<string, QuestionContext>;
  wordBanks: Record<string, string[]>;
  maxScore: number;
}

export interface KeyPointResult {
  label: string;
  ok: boolean;
}

export interface QuestionResult {
  id: string;
  sourceId: string;
  section: SectionId;
  type: QuestionType;
  number: number;
  points: number;
  earned: number;
  tags: string[];
  difficulty: Difficulty;
  /** Objective items only: true/false. Estimated (subjective) items omit it, so no tick/cross can render. */
  correct?: boolean;
  /**
   * 'objective' = graded against the answer key; 'estimated' = translation/summary/writing rough estimate.
   * Optional so attempts saved before r4 keep working; `isEstimatedResult` falls back to the section.
   */
  graded?: 'objective' | 'estimated';
  selected?: number;
  answer?: number;
  answerText?: string;
  userText?: string;
  covered?: KeyPointResult[];
  feedback?: string;
  /** Subjective answer sits far outside the expected length / has no sentence structure. */
  lowConfidence?: boolean;
}

export interface TagStat {
  tag: string;
  section: SectionId;
  correct: number;
  total: number;
  /** Score-based rate: objective items earn 0/1, subjective items earn partial marks. */
  earned?: number;
  points?: number;
  accuracy: number;
}

export interface SectionResult {
  id: SectionId;
  name: string;
  en: string;
  score: number;
  max: number;
  correct: number;
  total: number;
  /** earned / max. For subjective sections this replaces the old correct-count ratio. */
  scoreRate?: number;
  accuracy: number;
  tagStats: TagStat[];
}

export type SuggestionPriority = 'high' | 'medium' | 'low';

export interface Suggestion {
  priority: SuggestionPriority;
  title: string;
  detail: string;
  action: string;
  section?: SectionId;
  tag?: string;
}

export interface Attempt {
  id: string;
  paper: Paper;
  answers: Record<string, string>;
  results: QuestionResult[];
  sectionResults: SectionResult[];
  tagStats: TagStat[];
  /** All points, objective + estimated. Kept for older reports; the grade ignores the estimated part. */
  totalScore: number;
  maxScore: number;
  /** Real marks from objective questions only (听力/语法/词汇/完形/阅读). Rating uses this pair. */
  objectiveScore?: number;
  objectiveMax?: number;
  /** Rough estimate for translation/summary/writing; never part of the rating. */
  subjectiveEstimate?: number;
  subjectiveMax?: number;
  startedAt: string;
  submittedAt: string;
  durationUsedSec: number;
  timeBySection: Partial<Record<SectionId, number>>;
  suggestions: Suggestion[];
  transcriptReveals: string[];
  replayCounts: Record<string, number>;
  /** 3 = subjective marks are estimates only (90% ceiling, 50% for low confidence) and no longer graded true/false. Older attempts keep their original marks. */
  scoringVersion?: number;
}

export interface ActiveDraft {
  paper: Paper;
  answers: Record<string, string>;
  startedAt: string;
  flagged: string[];
  transcriptReveals: string[];
  replayCounts: Record<string, number>;
  currentSection: SectionId;
  timeBySection: Partial<Record<SectionId, number>>;
  /** Start of the current, not-yet-settled interval for the active section. */
  sectionEnteredAt: number;
  /** Last moment the draft was known to be open in this browser tab (used to avoid counting offline gaps). */
  lastActiveAt?: number;
}

export interface Settings {
  name: string;
  speechRate: number;
  autoNext: boolean;
}

export interface GenerateOptions {
  mode: ExamMode;
  section?: SectionId;
  difficulty?: 'mixed' | 'basic' | 'advanced';
  seed?: number;
  seenIds?: string[];
  bank?: Bank;
}
