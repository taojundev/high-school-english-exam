import type { ActiveDraft } from '../types';

/** Wall-clock deadline for the attempt (start + paper duration). */
export function examDeadline(draft: ActiveDraft): number {
  return new Date(draft.startedAt).getTime() + draft.paper.durationMin * 60_000;
}

function addSectionSeconds(
  timeBySection: ActiveDraft['timeBySection'],
  section: ActiveDraft['currentSection'],
  elapsed: number,
): ActiveDraft['timeBySection'] {
  if (elapsed <= 0) return timeBySection;
  return { ...timeBySection, [section]: (timeBySection[section] ?? 0) + elapsed };
}

/**
 * Checkpoint the current section: move the elapsed interval into timeBySection and
 * reset sectionEnteredAt. Everything is clamped at the attempt deadline so a tab
 * left open past the deadline can never produce negative or over-long section times.
 */
export function settleSectionTime(draft: ActiveDraft, nowMs: number): ActiveDraft {
  const deadline = examDeadline(draft);
  const cappedNow = Math.min(nowMs, deadline);
  const elapsed = Math.max(0, Math.round((cappedNow - draft.sectionEnteredAt) / 1000));
  return {
    ...draft,
    timeBySection: addSectionSeconds(draft.timeBySection, draft.currentSection, elapsed),
    sectionEnteredAt: cappedNow,
    lastActiveAt: nowMs,
  };
}

/**
 * Re-open a saved draft. Only the interval between the last checkpoint and the last
 * moment the tab was known to be active is credited; the time the tab was closed is
 * not study time. For legacy drafts without lastActiveAt, no offline time is credited.
 */
export function resumeDraft(draft: ActiveDraft, nowMs: number): ActiveDraft {
  const deadline = examDeadline(draft);
  const lastActive = Math.min(draft.lastActiveAt ?? draft.sectionEnteredAt, deadline);
  const elapsed = Math.max(0, Math.round((lastActive - draft.sectionEnteredAt) / 1000));
  return {
    ...draft,
    timeBySection: addSectionSeconds(draft.timeBySection, draft.currentSection, elapsed),
    sectionEnteredAt: Math.min(nowMs, deadline),
    lastActiveAt: nowMs,
  };
}
