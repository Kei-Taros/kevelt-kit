import { test, expect } from '@playwright/test';

test.describe('error page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/not-found-page');
  });

  test('404ページの内容が表示される', async ({ page }) => {
    await expect(page).toHaveTitle('404 | KeveltKit');

    await expect(page.getByRole('heading', { name: '404 Not Found', level: 1 })).toBeVisible();

    await expect(page.getByAltText('error')).toBeVisible();

    await expect(page.getByText('ご指定のページは見つかりませんでした。')).toBeVisible();
    await expect(
      page.getByText("Sorry, the page you're looking for can't be found.")
    ).toBeVisible();

    await expect(page.getByRole('button', { name: 'Home Page' })).toBeVisible();
  });

  test('Home Pageボタンを押した場合、トップページへ遷移する', async ({ page }) => {
    const homeButton = page.getByRole('button', { name: 'Home Page' });

    await expect(page).toHaveTitle('404 | KeveltKit');
    await expect(homeButton).toBeVisible();

    await page.waitForTimeout(500);

    await Promise.all([
      page.waitForURL((url) => url.pathname === '/', { timeout: 10000 }),
      homeButton.click()
    ]);

    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle('KeveltKit');
  });
});
