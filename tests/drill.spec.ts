import { expect, test } from '@playwright/test';
import { translation } from '../src/data/translation';

/**
 * 中文题干关键词 → 该句参考译文里必须出现的英文（大小写/词形按题库原句放宽）。
 * 每个关键词与英文片段都来自 src/data/translation.ts 的真实条目，不编造。
 * 覆盖全部 30 条，因为每次练习从题库随机抽 5 句。
 */
const TRANSLATION_KEYWORDS: Record<string, RegExp> = {
  社区服务: /community service/,
  钥匙: /\bkeys?\b/,
  中国文化: /chinese culture/i,
  桥: /\bbridge\b/,
  运动会: /sports meeting/,
  大声朗读: /\baloud\b/,
  妹妹: /\bsister\b/,
  躺下: /lay down/,
  塑料污染: /plastic pollution/,
  梦想: /\bdream\b/,
  上海博物馆: /shanghai museum/i,
  会议: /\bmeeting\b/,
  提问: /questions?/,
  英语口语: /spoken english/i,
  公园: /parks?\b/,
  地铁: /\bsubway\b/,
  户外: /outdoors?\b/,
  自行车: /\bbicycle\b/,
  增加: /\bincreased\b/,
  周五: /friday/i,
  成长: /\bgrowth\b/,
  回信: /hearing from you/,
  讨论: /\bdiscussing\b/,
  按时: /on time/,
  教室: /\bclassroom\b/,
  公交车: /\bbus\b/,
  嘲笑: /laughing at/,
  便利: /\bconvenient\b/,
  法语: /french/i,
  糖: /\bsugar\b/,
};

/**
 * A mock-exam draft that must survive every drill interaction byte for byte. There is only one
 * draft slot (`sh-exam.active.v1`) and the exam page owns it, so any write here loses user work.
 */
const DRAFT_SENTINEL = JSON.stringify({
  id: 'active-draft-sentinel',
  paperId: 'paper-sentinel',
  startedAt: '2026-01-01T08:00:00.000Z',
  answers: { 'sentinel-q1': 'A' },
  index: 3,
  sectionIndex: 1,
});

/** Reads the three storage slots the drill is allowed (not) to touch, as raw strings. */
async function readDraftState(page: import('@playwright/test').Page) {
  return page.evaluate(() => ({
    active: localStorage.getItem('sh-exam.active.v1'),
    attempts: localStorage.getItem('sh-exam.attempts.v1'),
    drill: localStorage.getItem('sh-exam.drill.v1'),
  }));
}

test.describe('单项测试 drill', () => {
  test('nav entry, landing cards, per-question feedback and summary', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '单项测试' }).click();
    await expect(page).toHaveURL(/#\/drill$/);
    await expect(page.getByRole('heading', { level: 1, name: '单项测试' })).toBeVisible();

    // Six sections with real counts/points, plus the excluded-sections note.
    const cards = page.locator('.drill-card');
    await expect(cards).toHaveCount(6);
    const reading = cards.filter({ has: page.getByRole('heading', { name: '阅读理解' }) });
    await expect(reading).toContainText('10 题');
    await expect(reading).toContainText('20 分');
    await expect(page.locator('.drill-excluded')).toContainText('翻译');
    await expect(page.locator('.drill-excluded')).toContainText('专项训练');

    await page.getByRole('button', { name: '开始阅读理解单项测试' }).click();
    await expect(page.locator('.drill-head h1')).toHaveText('阅读理解');
    await expect(page.getByText('第 1 / 10 题')).toBeVisible();
    await expect(page.getByRole('button', { name: '查看答案' })).toBeDisabled();

    // Answer the first question; only then can the answer key be opened.
    await page.locator('.drill-question .option').first().click();
    const chosen = (await page.locator('.drill-question .option.selected .option-text').innerText()).trim();
    await expect(page.getByRole('button', { name: '查看答案' })).toBeEnabled();
    await page.getByRole('button', { name: '查看答案' }).click();

    const verdict = page.locator('.drill-badge');
    await expect(verdict).toBeVisible();
    const answerKey = (await page.locator('.drill-answer dd').first().innerText()).trim();
    expect(answerKey.length).toBeGreaterThan(0);
    // The verdict must match the real comparison between the chosen option and the key.
    if (chosen === answerKey) {
      await expect(verdict).toContainText('答对了');
    } else {
      await expect(verdict).toContainText('答错了');
    }
    // Count every 答对了 the run actually saw; the saved record is cross-checked against it later.
    let observedCorrect = (await verdict.innerText()).includes('答对了') ? 1 : 0;
    await expect(page.locator('.drill-answer dd').nth(1)).toHaveText(chosen);

    // Explanation and tag guidance are real content, not placeholders.
    const explanation = (await page.locator('.drill-explain p').innerText()).trim();
    expect(explanation.length).toBeGreaterThan(10);
    await expect(page.locator('.drill-advice')).toContainText('指导意见');
    const adviceTitle = (await page.locator('.drill-advice h3').innerText()).trim();
    expect(adviceTitle.length).toBeGreaterThan(4);
    const adviceBody = (await page.locator('.drill-advice p').first().innerText()).trim();
    expect(adviceBody.length).toBeGreaterThan(10);

    // The answered question is locked: options are disabled and the key button stays used.
    await expect(page.locator('.drill-question .option input').first()).toBeDisabled();
    await expect(page.getByRole('button', { name: '已查看答案' })).toBeDisabled();

    await page.getByRole('button', { name: '下一题' }).click();
    await expect(page.getByText('第 2 / 10 题')).toBeVisible();
    await expect(page.getByRole('button', { name: '查看答案' })).toBeDisabled();
    await expect(page.locator('.drill-question .option.selected')).toHaveCount(0);

    // Walk the remaining questions to reach the summary card.
    for (let number = 2; number <= 10; number += 1) {
      await page.locator('.drill-question .option').first().click();
      await page.getByRole('button', { name: '查看答案' }).click();
      const badge = page.locator('.drill-badge');
      await expect(badge).toHaveText(/答对了|答错了/);
      if ((await badge.innerText()).includes('答对了')) observedCorrect += 1;
      await page
        .getByRole('button', { name: number < 10 ? '下一题' : '完成本节' })
        .click();
    }

    await expect(page.getByRole('heading', { level: 1, name: '本节小结' })).toBeVisible();
    await expect(page.locator('.drill-summary-stat').first()).toContainText('正确率');
    await expect(page.locator('.drill-summary-stat').first()).toContainText('/20 分');
    // The summary is rendered from the record, so it must agree with the verdicts seen above.
    // Reading questions are worth 2 points each: 10 questions, 20 points, no partial credit.
    await expect(page.locator('.drill-summary-stat').first()).toContainText(
      `答对 ${observedCorrect}/10 题`,
    );
    await expect(page.locator('.drill-summary-stat').first()).toContainText(
      `${observedCorrect * 2}/20 分`,
    );
    // The 用时 footnote must not point at answer cards that 完成本节 already unmounted.
    await expect(page.locator('.drill-summary-stat').nth(1)).toContainText('总时长');
    await expect(page.locator('.drill-wrong h2')).toHaveText('错题考点汇总');

    // One slim record in its own key; the exam history is untouched.
    const stored = await page.evaluate(() => ({
      drill: localStorage.getItem('sh-exam.drill.v1'),
      attempts: localStorage.getItem('sh-exam.attempts.v1'),
    }));
    expect(stored.attempts).toBeNull();
    const records = JSON.parse(stored.drill ?? '[]') as Record<string, unknown>[];
    expect(records).toHaveLength(1);
    expect(records[0].section).toBe('reading');
    expect(records[0].questions).toBe(10);
    expect(Number(records[0].points)).toBe(20);
    expect(records[0].paper).toBeUndefined();
    // Cross-check against what the browser actually showed, not against the record's own fields:
    // a record that always says 0 correct would pass `0 <= correct <= 10` but fails here.
    expect(Number(records[0].correct)).toBe(observedCorrect);
    expect(Number(records[0].earned)).toBe(observedCorrect * 2);

    // A fresh set of the same section starts at question 1 again.
    await page.getByRole('button', { name: /再来一组/ }).click();
    await expect(page.getByText('第 1 / 10 题')).toBeVisible();

    // Leaving returns to the landing page, which now lists the finished set.
    await page.getByRole('button', { name: '离开本节' }).click();
    await expect(page.getByRole('heading', { level: 1, name: '单项测试' })).toBeVisible();
    await expect(page.locator('.drill-recent')).toContainText('阅读理解');

    // Drill results must never show up in 成绩记录.
    await page.getByRole('link', { name: '成绩记录' }).click();
    await expect(page).toHaveURL(/#\/history$/);
    await expect(page.locator('.history-card')).toHaveCount(0);
  });

  test('translation drill only reveals a reference translation, never a verdict or score', async ({
    page,
  }) => {
    await page.goto('/#/drill');

    // The landing card is honest about not being graded: no point value anywhere on it.
    const translationCard = page
      .locator('.drill-card')
      .filter({ has: page.getByRole('heading', { name: '翻译' }) });
    await expect(translationCard).toContainText('5 题');
    await expect(translationCard).toContainText('不判分');
    await expect(translationCard).not.toContainText('15 分');
    await expect(page.locator('.drill-excluded')).toContainText('翻译已纳入单项测试');
    await expect(page.locator('.drill-excluded')).toContainText('概要写作');

    await page.getByRole('button', { name: '开始翻译单项测试' }).click();
    await expect(page.locator('.drill-head h1')).toHaveText('翻译');
    await expect(page.locator('.drill-head p')).toContainText('第 1 / 5 题');
    await expect(page.locator('.drill-head p')).toContainText('不判分');

    // 中译英：答案是多行 textarea，且没作答前不能看参考译文。
    const reveal = page.getByRole('button', { name: '查看参考译文' });
    await expect(reveal).toBeDisabled();
    await expect(page.locator('.drill-question textarea')).toHaveCount(1);
    const area = page.getByLabel('你的译文');
    await expect(area).toBeVisible();

    const myText = 'This is only my own translation, kept for comparison.';
    await area.fill(myText);
    await expect(reveal).toBeEnabled();
    await reveal.click();

    const card = page.locator('.drill-feedback');
    await expect(card).toBeVisible();
    const reference = (await card.locator('.reference-text').innerText()).trim();
    expect(reference.length).toBeGreaterThan(10);
    // 每揭示一题就记下「题干 + 实际显示的译文」，供后面证明译文确实属于当前这一题。
    const revealed: { stem: string; reference: string }[] = [
      { stem: (await page.locator('.translation-prompt').innerText()).trim(), reference },
    ];
    await expect(card.locator('.user-text')).toHaveText(myText);
    await expect(card).toContainText('本题用时');

    // The absence of grading is the feature: no ✓/✗ badge, no score, no explanation/advice.
    expect(await card.locator('.drill-badge').count()).toBe(0);
    expect(await card.locator('.drill-answer').count()).toBe(0);
    expect(await card.locator('.drill-explain').count()).toBe(0);
    expect(await card.locator('.drill-advice').count()).toBe(0);
    await expect(card).not.toContainText('答对了');
    await expect(card).not.toContainText('答错了');
    await expect(card).not.toContainText(/\d+\s*分/);

    // Revealed -> locked, exactly like the graded sections.
    await expect(area).not.toBeEditable();
    await expect(page.getByRole('button', { name: '已查看参考译文' })).toBeDisabled();

    for (let number = 2; number <= 5; number += 1) {
      await page.getByRole('button', { name: '下一题' }).click();
      await expect(page.locator('.drill-head p')).toContainText(`第 ${number} / 5 题`);
      await page.getByLabel('你的译文').fill(`My own translation number ${number}.`);
      await page.getByRole('button', { name: '查看参考译文' }).click();
      const text = (await page.locator('.drill-feedback .reference-text').innerText()).trim();
      expect(text.length).toBeGreaterThan(10);
      revealed.push({
        stem: (await page.locator('.translation-prompt').innerText()).trim(),
        reference: text,
      });
    }

    // 五条译文必须两两不同：一旦 ReferenceCard 的入参被固定成 paper.questions[0]，这里就红。
    expect(revealed).toHaveLength(5);
    expect(new Set(revealed.map((item) => item.reference)).size).toBe(5);

    // 而且每条译文必须是「当前这句题干」在题库里对应的那一句，不是同组里别句的译文。
    for (const { stem, reference: shown } of revealed) {
      const item = translation.find((entry) => entry.chinese === stem);
      expect(item, `题干不在翻译题库中：${stem}`).toBeDefined();
      expect(shown, `题干「${stem}」显示了别的题的译文`).toBe(item!.reference);
    }

    // 中文题干 → 英文译文的关键词对应（关键词取自题库真实数据）。至少两组必须命中。
    let keywordChecks = 0;
    for (const { stem, reference: shown } of revealed) {
      for (const [chinese, english] of Object.entries(TRANSLATION_KEYWORDS)) {
        if (!stem.includes(chinese)) continue;
        expect(shown, `题干含「${chinese}」，译文应含 ${english}`).toMatch(english);
        keywordChecks += 1;
      }
    }
    expect(keywordChecks).toBeGreaterThanOrEqual(2);
    await page.getByRole('button', { name: '完成本节' }).click();

    await expect(page.getByRole('heading', { level: 1, name: '本节小结' })).toBeVisible();
    const summary = page.locator('.drill-summary');
    await expect(summary).toContainText('完成 5/5 题');
    await expect(summary).toContainText('用时');
    await expect(page.locator('.drill-reference-note')).toContainText('翻译不判分');
    await expect(summary).not.toContainText('正确率');
    await expect(summary).not.toContainText('分');
    expect(await page.locator('.drill-wrong').count()).toBe(0);

    // The record says reference, with no invented scores, and the exam history stays empty.
    const stored = await page.evaluate(() => ({
      drill: localStorage.getItem('sh-exam.drill.v1'),
      attempts: localStorage.getItem('sh-exam.attempts.v1'),
    }));
    expect(stored.attempts).toBeNull();
    const records = JSON.parse(stored.drill ?? '[]') as Record<string, unknown>[];
    expect(records).toHaveLength(1);
    expect(records[0].kind).toBe('reference');
    expect(records[0].section).toBe('translation');
    expect(Number(records[0].answered)).toBe(5);
    expect(Number(records[0].earned)).toBe(0);
    expect(Number(records[0].points)).toBe(0);

    // 最近练习 must not promise a percentage for a reference record.
    await page.getByRole('button', { name: '换板块' }).click();
    const recent = page.locator('.drill-recent');
    await expect(recent).toContainText('翻译');
    await expect(recent).toContainText('完成 5 题');
    await expect(recent).not.toContainText('%');
  });

  test('renders a legacy drill record with no kind as a graded score in 最近练习', async ({ page }) => {
    // 旧记录：没有 kind，也没有 answered。它必须在「最近练习」里按判分口径渲染。
    await page.addInitScript(() => {
      localStorage.setItem(
        'sh-exam.drill.v1',
        JSON.stringify([
          {
            id: 'legacy-drill-1',
            section: 'grammar',
            at: '2026-01-01T08:00:00.000Z',
            questions: 10,
            correct: 8,
            earned: 16,
            points: 20,
            elapsedSec: 90,
            wrongTags: ['语法-时态'],
          },
        ]),
      );
    });
    await page.goto('/#/drill');

    const row = page.locator('.drill-recent-row').filter({ hasText: '语法与词汇' });
    await expect(row).toHaveCount(1);
    await expect(row).toContainText('8/10');
    await expect(row).toContainText('80%');
    // 掉进参考模式分支就会变成「完成 10 题 · 不判分」，这两个断言一起拦住它。
    await expect(row).not.toContainText('不判分');
    await expect(row).not.toContainText('完成');
  });

  test('keeps the cloze passage mounted and the vocabulary bank shared', async ({ page }) => {
    await page.goto('/#/drill');
    await page.getByRole('button', { name: '开始完形填空单项测试' }).click();
    await expect(page.getByText('第 1 / 15 题')).toBeVisible();

    const passage = page.locator('.drill-context .passage-text');
    const passageText = await passage.innerText();
    expect(passageText.length).toBeGreaterThan(200);

    await page.locator('.drill-question .option').first().click();
    await page.getByRole('button', { name: '查看答案' }).click();
    await page.getByRole('button', { name: '下一题' }).click();
    await expect(page.getByText('第 2 / 15 题')).toBeVisible();
    // Same passage, same text: the context block is not reloaded per question.
    await expect(page.locator('.drill-context .passage-text')).toHaveText(passageText);

    // Vocabulary: one 11-word bank shared by the whole 10-question group.
    await page.getByRole('button', { name: '离开本节' }).click();
    await page.getByRole('button', { name: '开始选词填空单项测试' }).click();
    await expect(page.getByText('第 1 / 10 题')).toBeVisible();
    await expect(page.locator('.vocab-bank .vocab-word')).toHaveCount(11);
    await expect(page.locator('.vocab-bank-card')).toContainText('11 选 10');
    // No answer can be revealed before the sentence is answered.
    await expect(page.getByRole('button', { name: '查看答案' })).toBeDisabled();

    await page.getByLabel('第 1 题选词').selectOption({ index: 1 });
    const picked = await page.getByLabel('第 1 题选词').inputValue();
    await page.getByRole('button', { name: '查看答案' }).click();
    await expect(page.locator('.drill-answer dd').first()).not.toBeEmpty();
    await expect(page.locator('.drill-answer dd').nth(1)).toHaveText(picked);
    // The used word is struck through in the shared bank.
    await expect(page.locator('.vocab-bank .vocab-word.used')).toHaveCount(1);
    await expect(page.locator('.vocab-select')).toBeDisabled();
  });
});

/** Walks a grammar set (6 mcq + 4 fill) to the summary card, answering every question. */
async function finishGrammarSet(page: import('@playwright/test').Page) {
  for (let number = 1; number <= 10; number += 1) {
    const fill = page.locator('.drill-question input.text-input');
    if (await fill.count()) {
      await fill.fill('form');
    } else {
      await page.locator('.drill-question .option').first().click();
    }
    await page.getByRole('button', { name: '查看答案' }).click();
    await expect(page.locator('.drill-badge')).toHaveText(/答对了|答错了/);
    await page
      .getByRole('button', { name: number < 10 ? '下一题' : '完成本节' })
      .click();
  }
}

test.describe('单项测试 drill safety rails', () => {
  test('never touches an in-progress mock-exam draft', async ({ page }) => {
    // Open the drill directly: the Home page parses the draft on mount, which would mask a leak.
    await page.goto('/#/drill');
    await page.evaluate((sentinel) => {
      localStorage.setItem('sh-exam.active.v1', sentinel);
      localStorage.removeItem('sh-exam.attempts.v1');
    }, DRAFT_SENTINEL);

    await page.getByRole('button', { name: '开始语法与词汇单项测试' }).click();
    await expect(page.getByText('第 1 / 10 题')).toBeVisible();
    // Two real reveals first, then the whole set through to the summary (which saves the record
    // and calls markSeen – the two side effects most likely to grab the draft slot).
    for (let number = 1; number <= 2; number += 1) {
      await page.locator('.drill-question .option').first().click();
      await page.getByRole('button', { name: '查看答案' }).click();
      await expect(page.locator('.drill-badge')).toHaveText(/答对了|答错了/);
      await page.getByRole('button', { name: '下一题' }).click();
    }
    await expect(page.getByText('第 3 / 10 题')).toBeVisible();
    for (let number = 3; number <= 10; number += 1) {
      const fill = page.locator('.drill-question input.text-input');
      if (await fill.count()) {
        await fill.fill('form');
      } else {
        await page.locator('.drill-question .option').first().click();
      }
      await page.getByRole('button', { name: '查看答案' }).click();
      await page
        .getByRole('button', { name: number < 10 ? '下一题' : '完成本节' })
        .click();
    }
    await expect(page.getByRole('heading', { level: 1, name: '本节小结' })).toBeVisible();

    const stored = await page.evaluate(() => ({
      active: localStorage.getItem('sh-exam.active.v1'),
      attempts: localStorage.getItem('sh-exam.attempts.v1'),
      drill: localStorage.getItem('sh-exam.drill.v1'),
    }));
    // Byte-identical draft, no history written, one slim drill record.
    expect(stored.active).toBe(DRAFT_SENTINEL);
    expect(stored.attempts).toBeNull();
    const records = JSON.parse(stored.drill ?? '[]') as Record<string, unknown>[];
    expect(records).toHaveLength(1);
    expect(records[0].section).toBe('grammar');
  });

  test('leaving a section mid-way keeps the in-progress draft byte-identical', async ({ page }) => {
    // The sentinel is seeded after boot here on purpose: this case isolates the leave() path
    // (「离开本节」), the most natural home for a future "clean up on exit" regression.
    await page.goto('/#/drill');
    await page.evaluate((sentinel) => {
      localStorage.setItem('sh-exam.active.v1', sentinel);
      localStorage.removeItem('sh-exam.attempts.v1');
      localStorage.removeItem('sh-exam.drill.v1');
    }, DRAFT_SENTINEL);

    await page.getByRole('button', { name: '开始阅读理解单项测试' }).click();
    await expect(page.getByText('第 1 / 10 题')).toBeVisible();
    await page.locator('.drill-question .option').first().click();
    await page.getByRole('button', { name: '查看答案' }).click();
    await expect(page.locator('.drill-badge')).toHaveText(/答对了|答错了/);

    // Abandon the set: no record saved, no markSeen, and above all no draft write.
    await page.getByRole('button', { name: '离开本节' }).click();
    await expect(page.getByRole('heading', { level: 1, name: '单项测试' })).toBeVisible();

    const stored = await readDraftState(page);
    expect(stored.active).toBe(DRAFT_SENTINEL);
    expect(stored.attempts).toBeNull();
    // Nothing was finished, so the drill log must stay empty as well.
    expect(stored.drill).toBeNull();
  });

  test('booting the drill page leaves an in-progress draft alone', async ({ page }) => {
    // addInitScript runs before any app code, so a mount-time "clean up an unfinished session"
    // regression is visible here; seeding after goto() would hide it.
    await page.addInitScript((sentinel) => {
      localStorage.setItem('sh-exam.active.v1', sentinel);
      localStorage.removeItem('sh-exam.attempts.v1');
      localStorage.removeItem('sh-exam.drill.v1');
    }, DRAFT_SENTINEL);

    await page.goto('/#/drill');
    await expect(page.getByRole('heading', { level: 1, name: '单项测试' })).toBeVisible();

    const afterBoot = await readDraftState(page);
    expect(afterBoot.active).toBe(DRAFT_SENTINEL);
    expect(afterBoot.attempts).toBeNull();

    // Starting a set mounts the question view (a second effect boundary): the draft survives it too.
    await page.getByRole('button', { name: '开始阅读理解单项测试' }).click();
    await expect(page.getByText('第 1 / 10 题')).toBeVisible();

    const afterStart = await readDraftState(page);
    expect(afterStart.active).toBe(DRAFT_SENTINEL);
    expect(afterStart.attempts).toBeNull();
  });

  test('locks a grammar fill answer once the answer key is revealed', async ({ page }) => {
    await page.goto('/#/drill');
    await page.getByRole('button', { name: '开始语法与词汇单项测试' }).click();
    await expect(page.getByText('第 1 / 10 题')).toBeVisible();

    // Grammar sets open with 6 mcq; walk to the first fill question (7).
    for (let number = 1; number <= 6; number += 1) {
      await page.locator('.drill-question .option').first().click();
      await page.getByRole('button', { name: '查看答案' }).click();
      await page.getByRole('button', { name: '下一题' }).click();
    }
    await expect(page.getByText('第 7 / 10 题')).toBeVisible();

    const fill = page.getByLabel('你的答案');
    await expect(fill).toBeVisible();
    await expect(fill).toBeEditable();
    // No reveal before the blank is answered.
    await expect(page.getByRole('button', { name: '查看答案' })).toBeDisabled();

    await fill.fill('whatever');
    await expect(page.getByRole('button', { name: '查看答案' })).toBeEnabled();
    await page.getByRole('button', { name: '查看答案' }).click();

    // Verdict, key, explanation and tag guidance are all real content.
    const verdict = page.locator('.drill-badge');
    await expect(verdict).toHaveText(/答对了|答错了/);
    await expect(page.locator('.drill-answer dd').first()).not.toBeEmpty();
    await expect(page.locator('.drill-answer dd').nth(1)).toHaveText('whatever');
    const explanation = (await page.locator('.drill-explain p').innerText()).trim();
    expect(explanation.length).toBeGreaterThan(10);
    await expect(page.locator('.drill-advice')).toContainText('指导意见');
    const adviceTitle = (await page.locator('.drill-advice h3').innerText()).trim();
    expect(adviceTitle.length).toBeGreaterThan(4);

    // The blank is locked: read-only, and typing over it cannot change the recorded answer.
    await expect(fill).not.toBeEditable();
    await fill.click();
    await fill.press('ControlOrMeta+a');
    await page.keyboard.type('forced-change');
    await expect(fill).toHaveValue('whatever');
    await expect(page.locator('.drill-answer dd').nth(1)).toHaveText('whatever');
    await expect(page.getByRole('button', { name: '已查看答案' })).toBeDisabled();
  });
});
