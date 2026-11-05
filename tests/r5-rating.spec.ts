import { expect, test } from '@playwright/test';

/**
 * r5 regression coverage:
 * 1. Rating must use objective marks only (injected attempts pin Result/Home/History).
 * 2. A pure subjective practice paper is an estimate, never a grade and never 0/0.
 * 3. Low-confidence subjective marks show the 50% cap note on the review card.
 */

type Outcome = 'objective' | 'estimated';

function result(id: string, section: string, type: string, points: number, earned: number, number: number, outcome: Outcome) {
  return {
    id,
    sourceId: id,
    section,
    type,
    number,
    points,
    earned,
    tags: [],
    difficulty: 2,
    ...(outcome === 'objective' ? { graded: 'objective', correct: earned === points } : { graded: 'estimated' }),
  };
}

function makeAttempt(id: string, objectiveScore: number, submittedAt: string) {
  const objective = Array.from({ length: 100 }, (_, index) =>
    result(`o${index}`, 'reading', 'mcq', 1, index < objectiveScore ? 1 : 0, index + 1, 'objective'),
  );
  const subjective = [
    result('sub-tr', 'translation', 'translation', 15, 13.5, 101, 'estimated'),
    result('sub-sum', 'summary', 'summary', 10, 9, 102, 'estimated'),
    result('sub-wr', 'writing', 'writing', 25, 22.5, 103, 'estimated'),
  ];
  const sectionResults = [
    {
      id: 'reading',
      name: '阅读理解',
      en: 'Reading',
      score: objectiveScore,
      max: 100,
      correct: objectiveScore,
      total: 100,
      scoreRate: objectiveScore / 100,
      accuracy: objectiveScore / 100,
      tagStats: [],
    },
    {
      id: 'translation',
      name: '翻译',
      en: 'Translation',
      score: 13.5,
      max: 15,
      correct: 0,
      total: 1,
      scoreRate: 0.9,
      accuracy: 0.9,
      tagStats: [],
    },
    {
      id: 'summary',
      name: '概要写作',
      en: 'Summary',
      score: 9,
      max: 10,
      correct: 0,
      total: 1,
      scoreRate: 0.9,
      accuracy: 0.9,
      tagStats: [],
    },
    {
      id: 'writing',
      name: '指导性写作',
      en: 'Guided Writing',
      score: 22.5,
      max: 25,
      correct: 0,
      total: 1,
      scoreRate: 0.9,
      accuracy: 0.9,
      tagStats: [],
    },
  ];
  return {
    id,
    answers: {},
    results: [...objective, ...subjective],
    sectionResults,
    tagStats: [],
    totalScore: objectiveScore + 45,
    maxScore: 150,
    objectiveScore,
    objectiveMax: 100,
    subjectiveEstimate: 45,
    subjectiveMax: 50,
    startedAt: new Date('2026-02-01T09:00:00Z').toISOString(),
    submittedAt,
    durationUsedSec: 7200,
    timeBySection: {},
    suggestions: [],
    transcriptReveals: [],
    replayCounts: {},
    scoringVersion: 3,
    paper: {
      version: 1,
      id: `paper-${id}`,
      seed: 1,
      createdAt: new Date('2026-02-01T09:00:00Z').toISOString(),
      mode: 'section',
      title: `构造成绩 ${id}`,
      durationMin: 120,
      sections: sectionResults.map((section) => ({
        id: section.id,
        name: section.name,
        en: section.en,
        points: section.max,
        minutes: 10,
        instructions: '',
        questionIds: [],
      })),
      questions: [],
      contexts: {},
      wordBanks: {},
      maxScore: 150,
    },
  };
}

function longLowConfidenceEssay(): string {
  const sentences = [
    'I am glad to welcome you to our school and share the club news.',
    'The English Drama Club meets every Friday afternoon in Room 302.',
    'The Photography Club also meets after school and explores the city.',
    'Could you let me know when you will arrive and which club interests you?',
    'I am looking forward to meeting you and showing you around the campus.',
    'Both clubs are friendly to new members and welcome every student.',
  ];
  const words: string[] = [];
  for (let index = 0; words.length < 485; index++) {
    words.push(...sentences[index % sentences.length].split(' '));
  }
  return words.slice(0, 485).join(' ');
}

test('injected attempts rate on objective marks only across result, home and history', async ({ page }) => {
  const low = makeAttempt('low', 55, new Date('2026-02-02T10:00:00Z').toISOString());
  const high = makeAttempt('high', 100, new Date('2026-02-01T10:00:00Z').toISOString());

  await page.goto('/');
  await page.evaluate((attempts) => {
    localStorage.setItem('sh-exam.attempts.v1', JSON.stringify(attempts));
  }, [low, high]);
  await page.reload();

  // Home: the newest attempt (55/100 objective + 45/50 estimated) must not be lifted to 卓越.
  await page.goto('/#/');
  await expect(page.locator('.hero-score')).toContainText('55');
  await expect(page.locator('.hero-score')).toContainText('/ 100');
  await expect(page.locator('.hero-card')).toContainText('待提升');
  await expect(page.locator('.hero-card')).not.toContainText('卓越');

  const recent = page.locator('.recent-card');
  await expect(recent.nth(0)).toContainText('待提升');
  await expect(recent.nth(0)).not.toContainText('卓越');
  await expect(recent.nth(1)).toContainText('卓越');

  // History: the low card keeps the objective-only rubric; the average is 77.5, not 50.
  await page.goto('/#/history');
  const historyCards = page.locator('.history-card');
  await expect(historyCards.nth(0)).toContainText('待提升');
  await expect(historyCards.nth(0)).not.toContainText('卓越');
  await expect(historyCards.nth(1)).toContainText('卓越');
  await expect(page.locator('.history-stats')).toContainText('78');
  await expect(page.locator('.history-stats')).toContainText('100');

  // Result: 55/100 objective is 待提升 even though the estimate is 45/50.
  await page.goto('/#/history');
  await page.locator('.history-card').nth(0).getByRole('link', { name: /成绩单/ }).click();
  await expect(page).toHaveURL(/\/#\/result\/low/);
  await expect(page.locator('.result-hero h1')).toContainText('待提升');
  await expect(page.locator('.result-hero')).not.toContainText('卓越');
  await expect(page.locator('.score-ring')).toContainText('55');
  await expect(page.locator('.score-ring')).toContainText('/ 100');

  await page.goto('/#/history');
  await page.locator('.history-card').nth(1).getByRole('link', { name: /成绩单/ }).click();
  await expect(page).toHaveURL(/\/#\/result\/high/);
  await expect(page.locator('.result-hero h1')).toContainText('卓越');
  await expect(page.locator('.score-ring')).toContainText('100');
  await expect(page.locator('.score-ring')).toContainText('/ 100');
});

test('writing-only practice shows an estimate, never a grade or 0 / 0', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: /专项训练/ }).click();
  await page.getByRole('button', { name: /指导性写作/ }).click();
  await page.getByRole('button', { name: /生成试卷并开始/ }).click();
  await expect(page).toHaveURL(/\/#\/exam\//);

  await page.locator('.writing-area textarea').first().fill(longLowConfidenceEssay());
  await page.getByRole('button', { name: /检查并交卷|^交卷$/ }).last().click();
  await expect(page.getByRole('dialog')).toContainText('确认交卷');
  await page.getByRole('button', { name: /确认交卷/ }).click();
  await expect(page).toHaveURL(/\/#\/result\//);

  const resultPage = page.locator('.result-page');
  await expect(resultPage).not.toContainText('待提升');
  await expect(resultPage).not.toContainText('0 / 0');
  await expect(resultPage).toContainText('估分');
  await expect(page.locator('.result-hero h1')).toContainText('主观题');
  await expect(page.locator('.score-ring')).toContainText('估分');
  await expect(page.locator('.score-ring')).not.toContainText('/ 0');
  await page.screenshot({ path: 'test-results/r5-writing-subjective.png', fullPage: true });

  // Review card must state the low-confidence 50% cap next to the 12.5/25 estimate.
  await page.getByRole('link', { name: /逐题复盘/ }).first().click();
  await expect(page).toHaveURL(/\/#\/review\//);
  const writingItem = page.locator('.review-item').first();
  await expect(writingItem).toContainText('估分');
  await expect(writingItem).toContainText('低置信度：估分再按 50% 封顶');

  // History and Home keep the estimate wording and never render 0 / 0 or 待提升.
  await page.goto('/#/history');
  const firstCard = page.locator('.history-card').first();
  await expect(firstCard).toContainText('估分');
  await expect(firstCard).not.toContainText('待提升');
  await expect(firstCard).not.toContainText('0 / 0');
  await expect(page.locator('.history-stats')).toContainText('—');

  await page.goto('/#/');
  await expect(page.locator('.hero-card')).toContainText('估分');
  await expect(page.locator('.hero-card')).not.toContainText('待提升');
  await expect(page.locator('.hero-card')).not.toContainText('0 / 0');
});

test('reading-only practice does not show an empty subjective estimate', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: /专项训练/ }).click();
  await page.getByRole('button', { name: /阅读理解/ }).click();
  await page.getByRole('button', { name: /生成试卷并开始/ }).click();
  await expect(page).toHaveURL(/\/#\/exam\//);

  await page.locator('.question-card .option').first().click();
  await page.getByRole('button', { name: /检查并交卷|^交卷$/ }).last().click();
  await expect(page.getByRole('dialog')).toContainText('确认交卷');
  await page.getByRole('button', { name: /确认交卷/ }).click();
  await expect(page).toHaveURL(/\/#\/result\//);

  const resultPage = page.locator('.result-page');
  await expect(resultPage).not.toContainText('主观题估分 0/0');
  await expect(resultPage).not.toContainText('主观题估分');
  await expect(page.locator('.score-ring')).toContainText('/ 20');

  await page.goto('/#/history');
  const firstCard = page.locator('.history-card').first();
  await expect(firstCard).not.toContainText('主观估分 0/0');
  await expect(firstCard).not.toContainText('主观估分');

  await page.goto('/#/');
  await expect(page.locator('.hero-card')).not.toContainText('主观题估分 0/0');
  await expect(page.locator('.recent-card').first()).not.toContainText('主观估分 0/0');
  await page.screenshot({ path: 'test-results/r5-reading-objective.png', fullPage: true });
});
