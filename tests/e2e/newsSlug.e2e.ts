import { test, expect, type Page, type Locator } from '@playwright/test';

const waitForClientReady = async (page: Page) => {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(300);
};

const getFirstNewsSlug = async (page: Page): Promise<string> => {
  await page.goto('/news');
  await waitForClientReady(page);

  const firstNewsLink = page.locator('a[href^="/news/"]').first();

  await expect(firstNewsLink).toBeVisible();

  const href = await firstNewsLink.getAttribute('href');

  if (href == null) {
    throw new Error('ニュース詳細ページへのリンクが見つかりませんでした');
  }

  return href;
};

const getNewsSlugByIndex = async (page: Page, index: number): Promise<string | null> => {
  await page.goto('/news');
  await waitForClientReady(page);

  const newsLink = page.locator('a[href^="/news/"]').nth(index);

  if ((await newsLink.count()) === 0) {
    return null;
  }

  await expect(newsLink).toBeVisible();

  return await newsLink.getAttribute('href');
};

const getToc = (page: Page): Locator => page.getByRole('navigation', { name: '目次' });

test.describe('News slug page', () => {
  test.beforeEach(async ({ page }) => {
    const firstNewsSlug = await getFirstNewsSlug(page);

    await page.goto(firstNewsSlug);
    await waitForClientReady(page);
  });

  test('News詳細ページの内容が表示される', async ({ page }) => {
    await expect(page).toHaveURL(/\/news\/[^/]+$/);

    await expect(page.getByRole('heading', { name: 'News', exact: true })).toBeVisible();

    const article = page.locator('article');

    await expect(article.getByRole('heading', { level: 2 }).first()).toBeVisible();
    await expect(article.getByRole('img').first()).toBeVisible();
  });

  test('サムネイル画像が表示される', async ({ page }) => {
    const thumbnail = page.locator('article img').first();

    await expect(thumbnail).toBeVisible();

    const src = await thumbnail.getAttribute('src');
    const alt = await thumbnail.getAttribute('alt');

    expect(src).toBeTruthy();
    expect(alt).toBeTruthy();
  });

  test('記事本文が表示される', async ({ page }) => {
    const article = page.locator('article');

    await expect(article.locator('p, h3, ul, ol').first()).toBeVisible();
  });

  test('記事内にh3がある場合、目次が表示される', async ({ page }) => {
    const article = page.locator('article');
    const h3Elements = article.locator('h3');

    const h3Count = await h3Elements.count();

    if (h3Count === 0) {
      await expect(getToc(page)).toHaveCount(0);
      return;
    }

    const toc = getToc(page);

    await expect(toc).toBeVisible();
    await expect(toc.getByText('目次', { exact: true })).toBeVisible();

    const tocLinks = toc.getByRole('link');

    await expect(tocLinks.first()).toBeVisible();
    await expect(tocLinks).toHaveCount(h3Count);
  });

  test('目次リンクを押した場合、対応する見出しへスクロールしてURLにハッシュが付く', async ({
    page
  }) => {
    const toc = getToc(page);

    if ((await toc.count()) === 0) {
      await expect(toc).toHaveCount(0);
      return;
    }

    const firstTocLink = toc.getByRole('link').first();

    await expect(firstTocLink).toBeVisible();

    const href = await firstTocLink.getAttribute('href');

    if (href == null) {
      throw new Error('目次リンクのhrefが見つかりませんでした');
    }

    await firstTocLink.click();

    await expect(page).toHaveURL(new RegExp(`${href}$`));

    const target = page.locator(href);

    await expect(target).toBeVisible();
  });

  test('Topボタンを押した場合、News一覧ページへ遷移する', async ({ page }) => {
    const topButton = page.getByRole('link', { name: 'Top', exact: true });

    await expect(topButton).toBeVisible();

    await topButton.click();

    await expect(page).toHaveURL(/\/news$/);
  });

  test('next Newsボタンが表示されている場合、別のニュース詳細ページへ遷移する', async ({
    page
  }) => {
    const secondNewsSlug = await getNewsSlugByIndex(page, 1);

    if (secondNewsSlug == null) {
      return;
    }

    await page.goto(secondNewsSlug);
    await waitForClientReady(page);

    const nextButton = page.getByRole('link', { name: '← next News', exact: true });

    if ((await nextButton.count()) === 0) {
      await expect(nextButton).toHaveCount(0);
      return;
    }

    await expect(nextButton).toBeVisible();

    const beforeUrl = page.url();
    const href = await nextButton.getAttribute('href');

    if (href == null) {
      throw new Error('next Newsボタンのhrefが見つかりませんでした');
    }

    await nextButton.click();

    await expect(page).toHaveURL(new RegExp(`${href}$`));
    expect(page.url()).not.toBe(beforeUrl);
  });

  test('prev Newsボタンが表示されている場合、別のニュースページへ遷移する', async ({ page }) => {
    const secondNewsSlug = await getNewsSlugByIndex(page, 1);

    if (secondNewsSlug == null) {
      return;
    }

    await page.goto(secondNewsSlug);
    await waitForClientReady(page);

    const prevButton = page.getByRole('link', { name: 'prev News →', exact: true });

    if ((await prevButton.count()) === 0) {
      await expect(prevButton).toHaveCount(0);
      return;
    }

    await expect(prevButton).toBeVisible();

    const beforeUrl = page.url();
    const href = await prevButton.getAttribute('href');

    if (href == null) {
      throw new Error('prev Newsボタンのhrefが見つかりませんでした');
    }

    await prevButton.click();

    await expect(page).toHaveURL(new RegExp(`${href}$`));
    expect(page.url()).not.toBe(beforeUrl);
  });
});
