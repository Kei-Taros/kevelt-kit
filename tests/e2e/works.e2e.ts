import { test, expect, type Page } from '@playwright/test';

const waitForClientReady = async (page: Page) => {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(300);
};

const workCards = (page: Page) =>
  page.locator('button').filter({
    has: page.locator('h3')
  });

const openFirstWorkModal = async (page: Page) => {
  const firstCard = workCards(page).first();

  await firstCard.scrollIntoViewIfNeeded();
  await expect(firstCard).toBeVisible();

  await expect(async () => {
    await firstCard.click();
    await expect(page.getByRole('dialog')).toBeVisible();
  }).toPass({
    timeout: 10000,
    intervals: [200, 400, 800, 1000]
  });
};

test.describe('Works page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/works');
    await waitForClientReady(page);
  });

  test('Worksページの内容が表示される', async ({ page }) => {
    await expect(page).toHaveTitle('Works | KeveltKit');
    await expect(page.getByRole('heading', { name: 'Works' })).toBeVisible();

    const allButton = page.getByRole('button', { name: 'All', exact: true });
    await expect(allButton).toBeVisible();
    await expect(allButton).toHaveAttribute('aria-pressed', 'true');

    await expect(workCards(page).first()).toBeVisible();
  });

  test('カテゴリーフィルターを押した場合、選択状態が切り替わる', async ({ page }) => {
    const allButton = page.getByRole('button', { name: 'All', exact: true });
    const categoryButton = page.getByRole('button', { name: 'Web', exact: true });

    await expect(categoryButton).toBeVisible();

    await expect(async () => {
      await categoryButton.click();
      await expect(categoryButton).toHaveAttribute('aria-pressed', 'true');
      await expect(allButton).toHaveAttribute('aria-pressed', 'false');
    }).toPass({
      timeout: 10000,
      intervals: [200, 400, 800, 1000]
    });

    await expect(async () => {
      await allButton.click();
      await expect(allButton).toHaveAttribute('aria-pressed', 'true');
      await expect(categoryButton).toHaveAttribute('aria-pressed', 'false');
    }).toPass({
      timeout: 10000,
      intervals: [200, 400, 800, 1000]
    });
  });

  test('カードを押した場合、モーダルが開く', async ({ page }) => {
    await openFirstWorkModal(page);

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('button', { name: '閉じる' })).toBeVisible();
    await expect(dialog.getByRole('heading', { name: '業務内容' })).toBeVisible();
    await expect(dialog.getByRole('heading', { name: '実績・取り組み' })).toBeVisible();
  });

  test('モーダルの閉じるボタンを押した場合、モーダルが閉じる', async ({ page }) => {
    await openFirstWorkModal(page);

    const closeButton = page.getByRole('dialog').getByRole('button', { name: '閉じる' });

    await expect(async () => {
      await closeButton.click();
      await expect(page.getByRole('dialog')).toHaveCount(0);
    }).toPass({
      timeout: 10000,
      intervals: [200, 400, 800, 1000]
    });

    await expect(page).toHaveURL(/\/works$/);
  });

  test('スクロール後にモーダルを閉じた場合、スクロール位置が維持される', async ({ page }) => {
    const targetCard = workCards(page).last();

    await targetCard.scrollIntoViewIfNeeded();
    await expect(targetCard).toBeVisible();

    const scrollBeforeOpen = await page.evaluate(() => window.scrollY);
    expect(scrollBeforeOpen).toBeGreaterThan(0);

    await expect(async () => {
      await targetCard.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }).toPass({
      timeout: 10000,
      intervals: [200, 400, 800, 1000]
    });

    const closeButton = page.getByRole('dialog').getByRole('button', { name: '閉じる' });

    await closeButton.click();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThanOrEqual(scrollBeforeOpen - 5);
  });

  test('Escapeキーを押した場合、モーダルが閉じる', async ({ page }) => {
    await openFirstWorkModal(page);

    await expect(async () => {
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toHaveCount(0);
    }).toPass({
      timeout: 10000,
      intervals: [200, 400, 800, 1000]
    });

    await expect(page).toHaveURL(/\/works$/);
  });
});
