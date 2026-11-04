import type { SectionId } from '../types';

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.round(totalSeconds / 60);
  if (minutes < 60) return `${minutes} 分钟`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} 小时 ${m} 分钟` : `${h} 小时`;
}

export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const sameYear = d.getFullYear() === now.getFullYear();
    return d.toLocaleString('zh-CN', {
      year: sameYear ? undefined : 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function gradeFor(ratio: number): { label: string; note: string } {
  if (ratio >= 0.9) return { label: '卓越', note: '已具备冲刺高分的实力' };
  if (ratio >= 0.85) return { label: '优秀', note: '基础扎实，细节仍可提升' };
  if (ratio >= 0.75) return { label: '良好', note: '整体稳定，存在明显提分空间' };
  if (ratio >= 0.6) return { label: '及格', note: '基础尚可，需要系统补漏' };
  return { label: '待提升', note: '建议从高频考点开始重建基础' };
}

export const SECTION_ORDER: SectionId[] = [
  'listening',
  'grammar',
  'vocabulary',
  'cloze',
  'reading',
  'translation',
  'summary',
  'writing',
];

export function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
