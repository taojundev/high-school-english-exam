import { describe, expect, it } from 'vitest';
import { generatePaper } from './exam';
import { examDeadline, resumeDraft, settleSectionTime } from './timing';
import type { ActiveDraft } from '../types';

const start = Date.parse('2026-01-01T10:00:00Z');

function draftAt(): ActiveDraft {
  const paper = generatePaper({ mode: 'section', section: 'listening', seed: 5 });
  return {
    paper,
    answers: {},
    startedAt: new Date(start).toISOString(),
    flagged: [],
    transcriptReveals: [],
    replayCounts: {},
    currentSection: 'listening',
    timeBySection: {},
    sectionEnteredAt: start,
    lastActiveAt: start,
  };
}

describe('section timing', () => {
  it('keeps time across save, exit and resume', () => {
    const firstVisit = settleSectionTime(draftAt(), start + 3_000);
    expect(firstVisit.timeBySection.listening).toBe(3);

    // Two minutes pass with the tab closed: offline time is not study time.
    const resumed = resumeDraft(firstVisit, start + 123_000);
    expect(resumed.timeBySection.listening).toBe(3);
    expect(resumed.sectionEnteredAt).toBe(start + 123_000);

    const submitted = settleSectionTime(resumed, start + 125_000);
    expect(submitted.timeBySection.listening).toBe(5);
    expect(submitted.timeBySection.listening).toBe(5);
  });

  it('credits only up to the last active heartbeat when a tab crashes', () => {
    const draft = { ...draftAt(), lastActiveAt: start + 3_000 };
    // The tab is reopened 10 minutes later; only the 3 seconds before the last autosave count.
    const resumed = resumeDraft(draft, start + 603_000);
    expect(resumed.timeBySection.listening).toBe(3);
  });

  it('clamps elapsed time at the exam deadline', () => {
    const draft = draftAt();
    const deadline = examDeadline(draft);
    expect(deadline).toBe(start + draft.paper.durationMin * 60_000);

    const late = settleSectionTime(draft, deadline + 600_000);
    expect(late.timeBySection.listening).toBe(draft.paper.durationMin * 60);
    expect(late.sectionEnteredAt).toBe(deadline);

    const stillLate = settleSectionTime(late, deadline + 900_000);
    expect(stillLate.timeBySection.listening).toBe(draft.paper.durationMin * 60);
    expect(stillLate.timeBySection.listening).toBeGreaterThanOrEqual(0);
  });

  it('does not add offline time for a legacy draft without lastActiveAt', () => {
    const legacy = draftAt();
    delete legacy.lastActiveAt;
    const resumed = resumeDraft(legacy, start + 900_000);
    expect(resumed.timeBySection.listening ?? 0).toBe(0);
  });
});
