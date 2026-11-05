import { expect, test } from '@playwright/test';

test.describe('Shanghai English mock exam', () => {
  test('home page and full exam flow', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('把每一次练习');
    await expect(page.getByText('题库小题')).toBeVisible();

    await page.getByRole('button', { name: /生成一套全真模拟卷/ }).first().click();
    await expect(page).toHaveURL(/\/#\/exam\//);
    await expect(page.locator('.timer')).toBeVisible();
    await expect(page.locator('.exam-rail')).toContainText('听力理解');

    // Answer the first listening question with option A.
    await page.locator('.question-card .option').first().click();
    await expect(page.locator('.sheet-cell.answered').first()).toBeVisible();

    // Walk through every section.
    for (let i = 0; i < 8; i++) {
      const next = page.getByRole('button', { name: /下一板块/ });
      if (await next.count()) {
        await next.click();
      } else {
        break;
      }
    }

    // Fill something in the last subjective sections.
    const textareas = page.locator('.writing-area textarea');
    const count = await textareas.count();
    for (let i = 0; i < count; i++) {
      await textareas.nth(i).fill(
        'Learning English takes time and practice. I read every day, keep a notebook of useful phrases, and try to speak with my classmates. When I make mistakes, I correct them and try again. This habit has helped me become more confident.',
      );
    }

    await page.getByRole('button', { name: /检查并交卷|^交卷$/ }).last().click();
    await expect(page.getByRole('dialog')).toContainText('确认交卷');
    await page.getByRole('button', { name: /确认交卷/ }).click();

    await expect(page).toHaveURL(/\/#\/result\//);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('这一次');
    await expect(page.getByText('下一步，这样练')).toBeVisible();
    await expect(page.locator('.score-ring')).toBeVisible();
    await expect(page.locator('.suggestion').first()).toBeVisible();

    await page.getByRole('link', { name: /逐题复盘/ }).first().click();
    await expect(page).toHaveURL(/\/#\/review\//);
    await expect(page.getByRole('heading', { name: '逐题复盘' })).toBeVisible();
    await page.getByRole('button', { name: /待订正/ }).click();
    await expect(page.locator('.review-item').first()).toBeVisible();

    await page.getByRole('link', { name: '成绩记录' }).click();
    await expect(page.getByRole('heading', { name: '成绩记录' })).toBeVisible();
    await expect(page.locator('.history-card').first()).toBeVisible();

    await page.getByRole('link', { name: '首页' }).click();
    await expect(page.getByText('有一场考试尚未交卷')).toHaveCount(0);
  });

  test('saves an in-progress exam and resumes it', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /生成一套全真模拟卷/ }).first().click();
    await expect(page).toHaveURL(/\/#\/exam\//);
    await page.locator('.question-card .option').first().click();
    const chosen = await page.locator('.option.selected .option-text').first().innerText();
    await page.getByRole('button', { name: /保存并退出/ }).click();
    await expect(page.getByText('有一场考试尚未交卷')).toBeVisible();
    await page.getByRole('link', { name: /继续考试/ }).click();
    await expect(page.locator('.option.selected .option-text').first()).toHaveText(chosen);
    await expect(page.locator('.sheet-cell.answered')).toHaveCount(1);
  });

  test('keeps per-section time across save, exit and resume', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /生成一套全真模拟卷/ }).first().click();
    await expect(page).toHaveURL(/\/#\/exam\//);

    await page.waitForTimeout(3200);
    await page.getByRole('button', { name: /保存并退出/ }).click();
    await expect(page.getByText('有一场考试尚未交卷')).toBeVisible();
    const saved = await page.evaluate(() => {
      const raw = localStorage.getItem('sh-exam.active.v1');
      if (!raw) throw new Error('missing active draft');
      return JSON.parse(raw).timeBySection.listening ?? 0;
    });
    expect(saved).toBeGreaterThanOrEqual(3);

    await page.getByRole('link', { name: /继续考试/ }).click();
    await expect(page).toHaveURL(/\/#\/exam\//);
    await page.waitForTimeout(2200);
    await page.getByRole('button', { name: /^交卷$/ }).first().click();
    await page.getByRole('button', { name: /确认交卷/ }).click();
    await expect(page).toHaveURL(/\/#\/result\//);

    const attempt = await page.evaluate(() => {
      const raw = localStorage.getItem('sh-exam.attempts.v1');
      if (!raw) throw new Error('missing attempts');
      const list = JSON.parse(raw);
      return {
        listening: list[0].timeBySection.listening ?? 0,
        timeBySection: list[0].timeBySection as Record<string, number>,
        durationUsedSec: list[0].durationUsedSec as number,
        durationMin: list[0].paper.durationMin as number,
      };
    });
    const total = attempt.listening;
    // 3s before save + 2s after resume; no offline gap, no double counting.
    expect(total).toBeGreaterThanOrEqual(5);
    expect(total).toBeLessThan(10);

    // Section times must never go negative, and the total must respect the exam deadline.
    for (const seconds of Object.values(attempt.timeBySection)) {
      expect(seconds).toBeGreaterThanOrEqual(0);
    }
    expect(attempt.durationUsedSec).toBeGreaterThanOrEqual(0);
    expect(attempt.durationUsedSec).toBeLessThanOrEqual(attempt.durationMin * 60);
    expect(
      Object.values(attempt.timeBySection).reduce((sum, seconds) => sum + seconds, 0),
    ).toBeLessThanOrEqual(attempt.durationUsedSec + 1);
  });

  test('auto-submits when the timer has expired', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /生成一套全真模拟卷/ }).first().click();
    await expect(page).toHaveURL(/\/#\/exam\//);
    await page.evaluate(() => {
      const raw = localStorage.getItem('sh-exam.active.v1');
      if (!raw) throw new Error('missing active draft');
      const draft = JSON.parse(raw);
      draft.startedAt = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      localStorage.setItem('sh-exam.active.v1', JSON.stringify(draft));
    });
    await page.reload();
    await expect(page).toHaveURL(/\/#\/result\//);
    await expect(page.getByText('未作答', { exact: true })).toBeVisible();
  });

  test('section practice only builds one section', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /专项训练/ }).click();
    await page.getByRole('button', { name: /语法与词汇/ }).click();
    await page.getByRole('button', { name: /生成试卷并开始/ }).click();
    await expect(page).toHaveURL(/\/#\/exam\//);
    await expect(page.locator('.exam-rail .rail-item')).toHaveCount(1);
    await expect(page.locator('.exam-rail')).toContainText('语法与词汇');
    await expect(page.getByText('10 分').first()).toBeVisible();
  });

  test('bank page browses and searches questions', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '浏览题库' }).click();
    await expect(page).toHaveURL(/\/#\/bank/);
    await expect(page.getByRole('heading', { name: '题库' })).toBeVisible();
    await expect(page.locator('.bank-item').first()).toBeVisible();
    await page.getByRole('tab', { name: /翻译/ }).click();
    await expect(page.locator('.bank-item').first()).toContainText('翻译');
    await page.getByRole('searchbox', { name: '搜索题库' }).fill('老师');
    await expect(page.locator('.bank-item').first()).toBeVisible();
  });
});
