import { isEstimatedResult } from './scoring';
import type { QuestionResult } from '../types';

export type ReviewStatus = 'correct' | 'wrong' | 'blank' | 'estimated';

export interface ReviewBadge {
  status: ReviewStatus;
  label: string;
  /** Estimated items never get a tick or a cross. */
  icon: 'check' | 'cross' | null;
  estimated: boolean;
}

type ReviewResult = Pick<QuestionResult, 'section' | 'graded' | 'correct' | 'lowConfidence'>;

export function reviewBadge(result: ReviewResult, answered: boolean): ReviewBadge {
  if (isEstimatedResult(result)) {
    return {
      status: 'estimated',
      label: result.lowConfidence ? '估分（低置信度）' : '估分',
      icon: null,
      estimated: true,
    };
  }
  if (result.correct) return { status: 'correct', label: '正确', icon: 'check', estimated: false };
  if (answered) return { status: 'wrong', label: '错误', icon: 'cross', estimated: false };
  return { status: 'blank', label: '未作答', icon: null, estimated: false };
}

/** "待订正" only makes sense for objective questions; estimated items have no right/wrong. */
export function isReviewWrong(result: ReviewResult): boolean {
  return !isEstimatedResult(result) && result.correct === false;
}
