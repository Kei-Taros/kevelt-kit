import { test, expect } from '@playwright/test';

test.describe('Concept page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/concept');
  });

  test('Conceptページのメインメッセージが表示される', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Concept' })).toBeVisible();
    await expect(page.getByText('What’s KeveltKit ?')).toBeVisible();
  });

  test('What’s KeveltKitセクションが表示される', async ({ page }) => {
    await page
      .getByRole('button', { name: /SCROLL/i })
      .first()
      .click();

    await expect(page.getByRole('heading', { name: 'What’s KeveltKit' })).toBeVisible();
    await expect(page.getByAltText('KeveltKit Logo')).toBeVisible();
  });

  test('Craftセクションが表示される', async ({ page }) => {
    await page
      .getByRole('button', { name: /SCROLL/i })
      .first()
      .click();
    await page
      .getByRole('button', { name: /SCROLL/i })
      .nth(1)
      .click();

    await expect(page.getByRole('heading', { name: 'Craft' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'デザイン' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '設計' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '実装' })).toBeVisible();
  });

  test('Themeセクションが表示される', async ({ page }) => {
    await page
      .getByRole('button', { name: /SCROLL/i })
      .first()
      .click();
    await page
      .getByRole('button', { name: /SCROLL/i })
      .nth(1)
      .click();
    await page
      .getByRole('button', { name: /SCROLL/i })
      .nth(2)
      .click();

    await expect(page.getByRole('heading', { name: 'Theme' })).toBeVisible();

    await expect(page.getByRole('img', { name: 'About-Me' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Concept' }).nth(1)).toBeVisible();
    await expect(page.getByRole('img', { name: 'News' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'A-Break' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Works' })).toBeVisible();
  });

  test('SCROLLボタンを押した場合、次のセクションへ移動する', async ({ page }) => {
    await page
      .getByRole('button', { name: /SCROLL/i })
      .first()
      .click();

    await expect(page.getByRole('heading', { name: 'What’s KeveltKit' })).toBeVisible();
  });

  test('Conceptページの背景画像が表示される', async ({ page }) => {
    await expect(page.getByRole('img', { name: 'Concept' }).first()).toBeVisible();
  });
});
