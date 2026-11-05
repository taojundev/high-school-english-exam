import { BANK } from '../data';
import { SECTION_MAP, SECTION_META } from '../sections';
import type {
  Difficulty,
  ExamMode,
  ExamQuestion,
  GenerateOptions,
  Paper,
  PaperSection,
  QuestionContext,
  SectionId,
} from '../types';
import { mulberry32, randomSeed, sample, shuffle } from './random';

const shortPoint = 1;
const fullLongPoint = 2.5;
const practiceLongPoint = 3;

type HasId = { id: string; difficulty: Difficulty };

function idsOfGroup(group: { id: string; questions: { id: string }[] }): string[] {
  return [group.id, ...group.questions.map((q) => q.id)];
}

interface Picked<T> {
  items: T[];
  repeated: Set<T>;
}

function pickItems<T extends HasId>(
  items: readonly T[],
  count: number,
  rng: () => number,
  difficulty: GenerateOptions['difficulty'],
  seenOrder: Map<string, number>,
  idsOf: (item: T) => string[] = (item) => [item.id],
): Picked<T> {
  const recency = (item: T) => Math.min(...idsOf(item).map((id) => seenOrder.get(id) ?? Number.POSITIVE_INFINITY));
  const isSeen = (item: T) => Number.isFinite(recency(item));
  const unseen = items.filter((item) => !isSeen(item));
  // When the unseen pool is too small, prefer the content seen longest ago instead of
  // falling back to a completely unfiltered pool.
  const seenItems = items.filter(isSeen).sort((a, b) => recency(b) - recency(a));

  let pool: T[] = unseen;
  if (pool.length < count) pool = [...pool, ...seenItems.slice(0, count - pool.length)];

  let picked: T[];
  if (difficulty && difficulty !== 'mixed') {
    const target = difficulty === 'basic' ? 1 : 3;
    const preferred = pool.filter((item) => item.difficulty === target);
    const rest = pool
      .filter((item) => item.difficulty !== target)
      .sort((a, b) => Math.abs(a.difficulty - target) - Math.abs(b.difficulty - target));
    if (preferred.length >= count) picked = sample(preferred, count, rng);
    else {
      picked = [
        ...sample(preferred, preferred.length, rng),
        ...sample(rest, Math.max(0, count - preferred.length), rng),
      ].slice(0, count);
    }
  } else {
    picked = sample(pool, count, rng);
  }
  return { items: picked, repeated: new Set(picked.filter(isSeen)) };
}

function shuffleMcq(
  options: readonly string[],
  answer: number,
  rng: () => number,
): { options: string[]; answer: number } {
  const shuffled = shuffle(
    options.map((text, index) => ({ text, correct: index === answer })),
    rng,
  );
  return {
    options: shuffled.map((o) => o.text),
    answer: shuffled.findIndex((o) => o.correct),
  };
}

export function generatePaper(options: GenerateOptions): Paper {
  const bank = options.bank ?? BANK;
  const seed = options.seed ?? randomSeed();
  const rng = mulberry32(seed);
  const mode: ExamMode = options.mode;
  const seenOrder = new Map((options.seenIds ?? []).map((id, index) => [id, index]));
  const paperId = `paper-${seed.toString(36)}-${Math.floor(rng() * 1e6).toString(36)}`;
  const questions: ExamQuestion[] = [];
  const contexts: Record<string, QuestionContext> = {};
  const wordBanks: Record<string, string[]> = {};
  const sections: PaperSection[] = [];
  const wanted = (id: SectionId) => mode === 'full' || options.section === id;

  const push = (q: Omit<ExamQuestion, 'id' | 'number'>): string => {
    const number = questions.length + 1;
    const id = `q${number}`;
    questions.push({ ...q, id, number });
    return id;
  };

  if (wanted('listening')) {
    const ids: string[] = [];
    const shortCount = mode === 'full' ? 10 : 6;
    const longPick = pickItems(
      bank.listeningLong,
      mode === 'full' ? 2 : 1,
      rng,
      options.difficulty,
      seenOrder,
      idsOfGroup,
    );
    const longs = longPick.items;
    const usedShort = new Set(longs.flatMap((g) => g.questions.map((q) => q.question)));
    const shortPick = pickItems(
      bank.listeningShort.filter((s) => !usedShort.has(s.question)),
      shortCount,
      rng,
      options.difficulty,
      seenOrder,
    );
    const shorts = shortPick.items;
    shorts.forEach((item, index) => {
      const groupId = `ls-${item.id}`;
      contexts[groupId] = {
        kind: 'dialogue',
        title: `短对话 ${index + 1}`,
        audioLabel: `短对话 ${index + 1}`,
        audioScript: item.script,
      };
      const mcq = shuffleMcq(item.options, item.answer, rng);
      ids.push(
        push({
          sourceId: item.id,
          section: 'listening',
          type: 'mcq',
          points: shortPoint,
          difficulty: item.difficulty,
          tags: item.tags,
          groupId,
          stem: item.question,
          options: mcq.options,
          answer: mcq.answer,
          answerText: mcq.options[mcq.answer],
          explanation: item.explanation,
          review: shortPick.repeated.has(item),
        }),
      );
    });
    longs.forEach((item) => {
      const groupId = `ll-${item.id}`;
      contexts[groupId] = {
        kind: 'monologue',
        title: item.title,
        audioLabel: item.title,
        audioScript: item.script,
      };
      item.questions.forEach((sub) => {
        const mcq = shuffleMcq(sub.options, sub.answer, rng);
        ids.push(
          push({
            sourceId: sub.id,
            section: 'listening',
            type: 'mcq',
            points: mode === 'full' ? fullLongPoint : practiceLongPoint,
            difficulty: sub.difficulty,
            tags: sub.tags,
            groupId,
            stem: sub.question,
            options: mcq.options,
            answer: mcq.answer,
            answerText: mcq.options[mcq.answer],
            explanation: sub.explanation,
            review: longPick.repeated.has(item),
          }),
        );
      });
    });
    sections.push({
      id: 'listening',
      name: SECTION_MAP.listening.name,
      en: SECTION_MAP.listening.en,
      points: ids.reduce((n, id) => n + (questions.find((q) => q.id === id)?.points ?? 0), 0),
      minutes: mode === 'full' ? SECTION_MAP.listening.minutes : SECTION_MAP.listening.practiceMinutes,
      instructions: SECTION_MAP.listening.instructions,
      questionIds: ids,
    });
  }

  if (wanted('grammar')) {
    const ids: string[] = [];
    const mcqPick = pickItems(bank.grammarMcq, 6, rng, options.difficulty, seenOrder);
    const fillPick = pickItems(bank.grammarFill, 4, rng, options.difficulty, seenOrder);
    const mcqItems = mcqPick.items;
    const fillItems = fillPick.items;
    const repeatedGrammarIds = new Set([...mcqPick.repeated, ...fillPick.repeated].map((item) => item.id));
    [...mcqItems, ...fillItems].forEach((item) => {
      const groupId = `g-${item.id}`;
      const isMcq = 'options' in item;
      const mcq = 'options' in item ? shuffleMcq(item.options, item.answer, rng) : undefined;
      ids.push(
        push({
          sourceId: item.id,
          section: 'grammar',
          type: isMcq ? 'mcq' : 'fill',
          points: 1,
          difficulty: item.difficulty,
          tags: item.tags,
          groupId,
          stem: item.stem,
          options: mcq?.options,
          answer: mcq?.answer,
          answerText: isMcq ? mcq!.options[mcq!.answer] : item.answer,
          accept: 'options' in item ? undefined : item.accept,
          explanation: item.explanation,
          review: repeatedGrammarIds.has(item.id),
        }),
      );
    });
    sections.push({
      id: 'grammar',
      name: SECTION_MAP.grammar.name,
      en: SECTION_MAP.grammar.en,
      points: ids.length,
      minutes: mode === 'full' ? SECTION_MAP.grammar.minutes : SECTION_MAP.grammar.practiceMinutes,
      instructions: SECTION_MAP.grammar.instructions,
      questionIds: ids,
    });
  }

  if (wanted('vocabulary')) {
    const ids: string[] = [];
    const vocabPick = pickItems(bank.vocabulary, 10, rng, options.difficulty, seenOrder);
    const items = vocabPick.items;
    const groupId = `vocab-bank-${paperId}`;
    const allAnswers = new Set(bank.vocabulary.map((v) => v.answer.toLowerCase()));
    const usedWords = new Set<string>();
    const words: string[] = [];
    for (const item of items) {
      if (!usedWords.has(item.answer.toLowerCase())) {
        usedWords.add(item.answer.toLowerCase());
        words.push(item.answer);
      }
    }
    // The 11th word comes from the distractors of unselected items. It must not be any
    // answer in the bank (otherwise it would be a second correct option).
    const extraPool = bank.vocabulary
      .filter((v) => !items.includes(v))
      .flatMap((v) => v.distractors)
      .filter((word) => {
        const lower = word.toLowerCase();
        return !usedWords.has(lower) && !allAnswers.has(lower);
      });
    const extra = extraPool.length ? extraPool[Math.floor(rng() * extraPool.length)] : undefined;
    if (extra) {
      usedWords.add(extra.toLowerCase());
      words.push(extra);
    }
    wordBanks[groupId] = shuffle(words, rng);
    items.forEach((item) => {
      ids.push(
        push({
          sourceId: item.id,
          section: 'vocabulary',
          type: 'vocab',
          points: 1,
          difficulty: item.difficulty,
          tags: item.tags,
          groupId,
          stem: item.sentence,
          answerText: item.answer,
          explanation: item.explanation,
          review: vocabPick.repeated.has(item),
        }),
      );
    });
    sections.push({
      id: 'vocabulary',
      name: SECTION_MAP.vocabulary.name,
      en: SECTION_MAP.vocabulary.en,
      points: ids.length,
      minutes: mode === 'full' ? SECTION_MAP.vocabulary.minutes : SECTION_MAP.vocabulary.practiceMinutes,
      instructions: SECTION_MAP.vocabulary.instructions,
      questionIds: ids,
    });
  }

  if (wanted('cloze')) {
    const ids: string[] = [];
    const clozePick = pickItems(bank.cloze, 1, rng, options.difficulty, seenOrder);
    const [item] = clozePick.items;
    const groupId = `cloze-${item.id}`;
    contexts[groupId] = { kind: 'passage', title: item.title, text: item.text };
    item.blanks.forEach((blank, index) => {
      const mcq = shuffleMcq(blank.options, blank.answer, rng);
      ids.push(
        push({
          sourceId: item.id,
          section: 'cloze',
          type: 'mcq',
          points: 1,
          difficulty: item.difficulty,
          tags: blank.tags,
          groupId,
          stem: `第 ${index + 1} 空`,
          options: mcq.options,
          answer: mcq.answer,
          answerText: mcq.options[mcq.answer],
          explanation: blank.explanation,
          review: clozePick.repeated.has(item),
        }),
      );
    });
    sections.push({
      id: 'cloze',
      name: SECTION_MAP.cloze.name,
      en: SECTION_MAP.cloze.en,
      points: ids.length,
      minutes: mode === 'full' ? SECTION_MAP.cloze.minutes : SECTION_MAP.cloze.practiceMinutes,
      instructions: SECTION_MAP.cloze.instructions,
      questionIds: ids,
    });
  }

  if (wanted('reading')) {
    const ids: string[] = [];
    const readingPick = pickItems(
      bank.reading,
      mode === 'full' ? 4 : 2,
      rng,
      options.difficulty,
      seenOrder,
      idsOfGroup,
    );
    const groups = readingPick.items;
    groups.forEach((item) => {
      const groupId = `reading-${item.id}`;
      contexts[groupId] = { kind: 'passage', title: item.title, text: item.text };
      item.questions.forEach((sub) => {
        const mcq = shuffleMcq(sub.options, sub.answer, rng);
        ids.push(
          push({
            sourceId: sub.id,
            section: 'reading',
            type: 'mcq',
            points: 2,
            difficulty: sub.difficulty,
            tags: sub.tags,
            groupId,
            stem: sub.question,
            options: mcq.options,
            answer: mcq.answer,
            answerText: mcq.options[mcq.answer],
            explanation: sub.explanation,
            review: readingPick.repeated.has(item),
          }),
        );
      });
    });
    sections.push({
      id: 'reading',
      name: SECTION_MAP.reading.name,
      en: SECTION_MAP.reading.en,
      points: ids.length * 2,
      minutes: mode === 'full' ? SECTION_MAP.reading.minutes : SECTION_MAP.reading.practiceMinutes,
      instructions: SECTION_MAP.reading.instructions,
      questionIds: ids,
    });
  }

  if (wanted('translation')) {
    const ids: string[] = [];
    const translationPick = pickItems(bank.translation, 5, rng, options.difficulty, seenOrder);
    const items = translationPick.items;
    items.forEach((item) => {
      ids.push(
        push({
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
          review: translationPick.repeated.has(item),
        }),
      );
    });
    sections.push({
      id: 'translation',
      name: SECTION_MAP.translation.name,
      en: SECTION_MAP.translation.en,
      points: ids.length * 3,
      minutes:
        mode === 'full' ? SECTION_MAP.translation.minutes : SECTION_MAP.translation.practiceMinutes,
      instructions: SECTION_MAP.translation.instructions,
      questionIds: ids,
    });
  }

  if (wanted('summary')) {
    const ids: string[] = [];
    const summaryPick = pickItems(bank.summary, 1, rng, options.difficulty, seenOrder);
    const [item] = summaryPick.items;
    const groupId = `summary-${item.id}`;
    contexts[groupId] = { kind: 'passage', title: item.title, text: item.text };
    ids.push(
      push({
        sourceId: item.id,
        section: 'summary',
        type: 'summary',
        points: 10,
        difficulty: item.difficulty,
        tags: ['概要写作'],
        groupId,
        stem: item.prompt,
        reference: item.sample,
        sample: item.sample,
        keyPoints: item.keyPoints,
        minWords: item.minWords,
        maxWords: item.maxWords,
        tips: item.tips,
        review: summaryPick.repeated.has(item),
      }),
    );
    sections.push({
      id: 'summary',
      name: SECTION_MAP.summary.name,
      en: SECTION_MAP.summary.en,
      points: 10,
      minutes: mode === 'full' ? SECTION_MAP.summary.minutes : SECTION_MAP.summary.practiceMinutes,
      instructions: SECTION_MAP.summary.instructions,
      questionIds: ids,
    });
  }

  if (wanted('writing')) {
    const ids: string[] = [];
    const writingPick = pickItems(bank.writing, 1, rng, options.difficulty, seenOrder);
    const [item] = writingPick.items;
    const groupId = `writing-${item.id}`;
    ids.push(
      push({
        sourceId: item.id,
        section: 'writing',
        type: 'writing',
        points: 25,
        difficulty: item.difficulty,
        tags: ['写作'],
        groupId,
        stem: item.prompt,
        requirements: item.requirements,
        reference: item.sample,
        sample: item.sample,
        keyPoints: item.keyPoints,
        minWords: item.minWords,
        maxWords: item.maxWords,
        tips: item.tips,
        review: writingPick.repeated.has(item),
      }),
    );
    sections.push({
      id: 'writing',
      name: SECTION_MAP.writing.name,
      en: SECTION_MAP.writing.en,
      points: 25,
      minutes: mode === 'full' ? SECTION_MAP.writing.minutes : SECTION_MAP.writing.practiceMinutes,
      instructions: SECTION_MAP.writing.instructions,
      questionIds: ids,
    });
  }

  if (sections.length === 0) {
    throw new Error('No section selected');
  }

  const title =
    mode === 'full'
      ? '上海高考英语全真模拟卷'
      : `专项训练 · ${SECTION_MAP[options.section ?? sections[0].id].name}`;

  return {
    version: 1,
    id: paperId,
    seed,
    difficulty: options.difficulty,
    createdAt: new Date().toISOString(),
    mode,
    sectionFilter: options.section,
    title,
    durationMin:
      mode === 'full'
        ? SECTION_META.reduce((n, s) => n + s.minutes, 0)
        : SECTION_MAP[options.section ?? sections[0].id].practiceMinutes,
    sections,
    questions,
    contexts,
    wordBanks,
    maxScore: questions.reduce((n, q) => n + q.points, 0),
  };
}

/** Options that rebuild a stored paper exactly; the result page replay must go through this. */
export function paperReplayOptions(paper: Paper): GenerateOptions {
  return {
    mode: paper.mode,
    section: paper.mode === 'section' ? paper.sectionFilter ?? paper.sections[0].id : undefined,
    seed: paper.seed,
    difficulty: paper.difficulty,
  };
}

export function paperSourceIds(paper: Paper): string[] {
  return paper.questions.map((q) => q.sourceId);
}

export function questionsBySection(paper: Paper, section: SectionId): ExamQuestion[] {
  const meta = paper.sections.find((s) => s.id === section);
  if (!meta) return [];
  const ids = new Set(meta.questionIds);
  return paper.questions.filter((q) => ids.has(q.id));
}

export function groupQuestions(questions: ExamQuestion[]): ExamQuestion[][] {
  const groups: ExamQuestion[][] = [];
  const index = new Map<string, number>();
  for (const q of questions) {
    const existing = index.get(q.groupId);
    if (existing === undefined) {
      index.set(q.groupId, groups.length);
      groups.push([q]);
    } else {
      groups[existing].push(q);
    }
  }
  return groups;
}
