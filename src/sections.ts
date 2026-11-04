import type { SectionId } from './types';

export interface SectionMeta {
  id: SectionId;
  name: string;
  en: string;
  short: string;
  points: number;
  minutes: number;
  practicePoints: number;
  practiceMinutes: number;
  blurb: string;
  instructions: string;
}

export const SECTION_META: SectionMeta[] = [
  {
    id: 'listening',
    name: '听力理解',
    en: 'Listening Comprehension',
    short: '听力',
    points: 25,
    minutes: 20,
    practicePoints: 15,
    practiceMinutes: 15,
    blurb: '短对话 + 长对话/独白，训练抓取关键信息与言外之意。',
    instructions:
      '本部分共两节。每段录音播放前，你有时间阅读题目。正式考试只播放一遍，本工具允许重播并记录次数。',
  },
  {
    id: 'grammar',
    name: '语法与词汇',
    en: 'Grammar',
    short: '语法',
    points: 10,
    minutes: 8,
    practicePoints: 10,
    practiceMinutes: 10,
    blurb: '时态、非谓语、从句、介词与词形变化，一空一考点。',
    instructions: '阅读句子，从选项中选出最佳答案，或在空格处填入括号中单词的正确形式。',
  },
  {
    id: 'vocabulary',
    name: '选词填空',
    en: 'Vocabulary',
    short: '词汇',
    points: 10,
    minutes: 8,
    practicePoints: 10,
    practiceMinutes: 10,
    blurb: '11 词选 10，考查词义辨析、固定搭配与语境判断。',
    instructions: '从方框中选择合适的单词填入空格，每个单词只能使用一次，方框中有一个多余单词。',
  },
  {
    id: 'cloze',
    name: '完形填空',
    en: 'Cloze',
    short: '完形',
    points: 15,
    minutes: 10,
    practicePoints: 15,
    practiceMinutes: 12,
    blurb: '在语篇中恢复逻辑与词义，重点训练上下文线索。',
    instructions: '阅读短文，从每题所给的四个选项中选出可以填入空白处的最佳选项。',
  },
  {
    id: 'reading',
    name: '阅读理解',
    en: 'Reading',
    short: '阅读',
    points: 40,
    minutes: 28,
    practicePoints: 20,
    practiceMinutes: 20,
    blurb: '细节、主旨、推断、词义与态度，四篇不同体裁。',
    instructions: '阅读下列短文，从每题所给的四个选项中选出最佳选项。',
  },
  {
    id: 'translation',
    name: '翻译',
    en: 'Translation',
    short: '翻译',
    points: 15,
    minutes: 10,
    practicePoints: 15,
    practiceMinutes: 10,
    blurb: '五句中译英，考查句式转换、时态与词汇准确性。',
    instructions: '将下列句子译成英语。注意时态、语态、搭配与句子结构。',
  },
  {
    id: 'summary',
    name: '概要写作',
    en: 'Summary Writing',
    short: '概要',
    points: 10,
    minutes: 12,
    practicePoints: 10,
    practiceMinutes: 15,
    blurb: '压缩长文、保留要旨，用 60 词左右写出连贯概要。',
    instructions: '阅读短文，根据要求写一篇 60 词左右的概要。不得照抄原文句子。',
  },
  {
    id: 'writing',
    name: '指导性写作',
    en: 'Guided Writing',
    short: '写作',
    points: 25,
    minutes: 24,
    practicePoints: 25,
    practiceMinutes: 25,
    blurb: '应用文/议论文，按要点组织内容，兼顾语言与结构。',
    instructions: '根据提示写一篇 120–150 词的英语短文。',
  },
];

export const SECTION_MAP = Object.fromEntries(SECTION_META.map((s) => [s.id, s])) as Record<
  SectionId,
  SectionMeta
>;

export function sectionLabel(id: SectionId): string {
  return SECTION_MAP[id]?.short ?? id;
}
