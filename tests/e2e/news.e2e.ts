import { test, expect, type Page, type Locator } from '@playwright/test';

const waitForClientReady = async (page: Page) => {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(300);
};

const getLatestSection = (page: Page): Locator =>
  page
    .locator('section')
    .filter({
      has: page.getByRole('heading', { name: 'Latest', exact: true })
    })
    .last();

const getNewsListSection = (page: Page): Locator =>
  page
    .locator('section')
    .filter({
      has: page.getByRole('heading', { name: 'News List', exact: true })
    })
    .last();

test.describe('News page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/news');
    await waitForClientReady(page);
  });

  test('Newsページの内容が表示される', async ({ page }) => {
    await expect(page).toHaveTitle('News | KeveltKit');
    await expect(page).toHaveURL(/\/news$/);

    await expect(page.getByRole('heading', { name: 'News', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Latest', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'News List', exact: true })).toBeVisible();
  });

  test('Latestセクションに最新ニュースカードが最大3件表示される', async ({ page }) => {
    const latestSection = getLatestSection(page);
    const latestLinks = latestSection.getByRole('link');

    await expect(latestSection.getByRole('heading', { name: 'Latest', exact: true })).toBeVisible();
    await expect(latestLinks.first()).toBeVisible();

    const count = await latestLinks.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(3);
  });

  test('News Listセクションの初期表示は最大10件である', async ({ page }) => {
    const newsListSection = getNewsListSection(page);
    const itemHeadings = newsListSection.getByRole('heading', { level: 3 });

    await expect(
      newsListSection.getByRole('heading', { name: 'News List', exact: true })
    ).toBeVisible();
    await expect(itemHeadings.first()).toBeVisible();

    const count = await itemHeadings.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(10);
  });

  test('Load Moreボタンが表示されている場合、押すと表示件数が増える', async ({ page }) => {
    const newsListSection = getNewsListSection(page);
    const itemHeadings = newsListSection.getByRole('heading', { level: 3 });
    const loadMoreButton = newsListSection.getByRole('button', { name: 'Load More', exact: true });

    const initialCount = await itemHeadings.count();

    if ((await loadMoreButton.count()) === 0) {
      expect(initialCount).toBeLessThanOrEqual(10);
      return;
    }

    await expect(loadMoreButton).toBeVisible();
    await loadMoreButton.click();

    await expect(async () => {
      const nextCount = await itemHeadings.count();
      expect(nextCount).toBeGreaterThan(initialCount);
    }).toPass({
      timeout: 10000,
      intervals: [200, 400, 800, 1000]
    });
  });

  test('Latestセクションのカードを押した場合、ニュース詳細ページへ遷移する', async ({ page }) => {
    const latestSection = getLatestSection(page);
    const firstLink = latestSection.getByRole('link').first();

    await expect(firstLink).toBeVisible();
    await firstLink.click();

    await expect(page).toHaveURL(/\/news\/[^/]+$/);
  });

  test('News Listにサンプル用のページが表示されない', async ({ page }) => {
    const newsListSection = getNewsListSection(page);
    const sampleLink = newsListSection.locator('a[href="/news/yyyymmdd"]');

    await expect(sampleLink).toHaveCount(0);
  });
});
