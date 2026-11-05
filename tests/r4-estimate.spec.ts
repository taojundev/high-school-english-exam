import { expect, test } from '@playwright/test';

/**
 * Real-browser acceptance for r4: the subjective panel must never show a tick/cross,
 * and the report must separate the objective score from the subjective estimate.
 */
test('subjective sections show an estimate with no tick or cross', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /生成一套全真模拟卷/ }).first().click();
  await expect(page).toHaveURL(/\/#\/exam\//);

  const answer =
    'Volunteering teaches us responsibility and teamwork. Last month I joined a community clean-up project with my classmates and listened to the teacher patiently. We worked together and felt moved by what we achieved, so I believe students should take part in such service.';
  const fillVisibleAnswers = async () => {
    const areas = page.locator('.writing-area textarea');
    const count = await areas.count();
    for (let i = 0; i < count; i++) {
      await areas.nth(i).fill(answer);
    }
  };

  for (let i = 0; i < 8; i++) {
    await fillVisibleAnswers();
    const next = page.getByRole('button', { name: /下一板块/ });
    if (await next.count()) {
      await next.click();
    } else {
      break;
    }
  }
  await fillVisibleAnswers();

  await page.getByRole('button', { name: /检查并交卷|^交卷$/ }).last().click();
  await expect(page.getByRole('dialog')).toContainText('确认交卷');
  await page.getByRole('button', { name: /确认交卷/ }).click();
  await expect(page).toHaveURL(/\/#\/result\//);

  // The ring is the real objective score, and the estimate is labelled as not affecting the grade.
  await expect(page.locator('.score-ring')).toContainText('/ 100');
  await expect(page.getByText(/主观题估分 \d+(\.\d+)?\/50（不参与评级）/).first()).toBeVisible();

  await page.getByRole('link', { name: /逐题复盘/ }).first().click();
  await expect(page).toHaveURL(/\/#\/review\//);
  await page.getByLabel('按板块筛选').selectOption('translation');

  const items = page.locator('.review-item');
  await expect(items.first()).toBeVisible();
  const itemCount = await items.count();
  expect(itemCount).toBeGreaterThan(0);

  for (let i = 0; i < itemCount; i++) {
    const item = items.nth(i);
    await expect(item).toHaveClass(/status-estimated/);
    // No tick/cross icon anywhere in the subjective card.
    await expect(item.locator('.status-badge svg')).toHaveCount(0);
    await expect(item.locator('.coverage-chip svg')).toHaveCount(0);
    await expect(item.locator('.status-badge')).toContainText('估分');
    await expect(item.locator('.review-points')).toContainText('估分');
  }

  await page.screenshot({ path: 'test-results/r4-subjective-estimate.png', fullPage: true });
});
