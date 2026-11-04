import type { Bank } from '../types';
import { listeningLong, listeningShort } from './listening';
import { grammarFill, grammarMcq } from './grammar';
import { vocabulary } from './vocabulary';
import { cloze } from './cloze';
import { reading } from './reading';
import { translation } from './translation';
import { summary } from './summary';
import { writing } from './writing';

export const BANK: Bank = {
  listeningShort,
  listeningLong,
  grammarMcq,
  grammarFill,
  vocabulary,
  cloze,
  reading,
  translation,
  summary,
  writing,
};

export interface BankStat {
  key: keyof Bank;
  label: string;
  count: number;
  unit: string;
}

export const BANK_STATS: BankStat[] = [
  { key: 'listeningShort', label: '听力短对话', count: BANK.listeningShort.length, unit: '段' },
  { key: 'listeningLong', label: '听力长对话/独白', count: BANK.listeningLong.length, unit: '组' },
  { key: 'grammarMcq', label: '语法单选', count: BANK.grammarMcq.length, unit: '题' },
  { key: 'grammarFill', label: '语法填空', count: BANK.grammarFill.length, unit: '题' },
  { key: 'vocabulary', label: '选词填空素材', count: BANK.vocabulary.length, unit: '题' },
  { key: 'cloze', label: '完形填空', count: BANK.cloze.length, unit: '篇' },
  { key: 'reading', label: '阅读理解', count: BANK.reading.length, unit: '篇' },
  { key: 'translation', label: '中译英', count: BANK.translation.length, unit: '句' },
  { key: 'summary', label: '概要写作', count: BANK.summary.length, unit: '篇' },
  { key: 'writing', label: '指导性写作', count: BANK.writing.length, unit: '题' },
];

export function bankTotals() {
  const questions =
    BANK.listeningShort.length +
    BANK.listeningLong.reduce((n, g) => n + g.questions.length, 0) +
    BANK.grammarMcq.length +
    BANK.grammarFill.length +
    BANK.vocabulary.length +
    BANK.cloze.reduce((n, c) => n + c.blanks.length, 0) +
    BANK.reading.reduce((n, r) => n + r.questions.length, 0) +
    BANK.translation.length +
    BANK.summary.length +
    BANK.writing.length;
  return { questions, items: BANK_STATS.reduce((n, s) => n + s.count, 0) };
}
