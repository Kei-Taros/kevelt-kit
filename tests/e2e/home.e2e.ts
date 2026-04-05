import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('メッセージが表示される', async ({ page }) => {
    await expect(page).toHaveTitle('KeveltKit');

    await expect(page.getByText('一旦やってみる')).toBeVisible();
    await expect(page.getByText('難しいことはそれから考えよう')).toBeVisible();
    await expect(page.getByText('Try first. Think later.')).toBeVisible();
  });

  test('Contentsセクションが表示される', async ({ page }) => {
    const contentsHeading = page.getByRole('heading', { name: 'Contents' });
    await expect(contentsHeading).toBeVisible();

    const contentsSection = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'Contents' })
    });

    await expect(contentsSection.getByRole('link', { name: /About Me/i })).toBeVisible();
    await expect(contentsSection.getByRole('link', { name: /Concept/i })).toBeVisible();
    await expect(contentsSection.getByRole('link', { name: /News/i })).toBeVisible();
    await expect(contentsSection.getByRole('link', { name: /A Break/i })).toBeVisible();
    await expect(contentsSection.getByRole('link', { name: /Works/i })).toBeVisible();
  });

  test.describe('Contentsリンク遷移', () => {
    const contentsLinks = [
      { name: 'About Me', path: '/about-me' },
      { name: 'Concept', path: '/concept' },
      { name: 'News', path: '/news' },
      { name: 'A Break', path: '/a-break' },
      { name: 'Works', path: '/works' }
    ];

    for (const item of contentsLinks) {
      test(`Contentsの${item.name}リンクを押した場合、${item.path}へ遷移する`, async ({ page }) => {
        const contentsSection = page.locator('section').filter({
          has: page.getByRole('heading', { name: 'Contents' })
        });

        await contentsSection.getByRole('link', { name: item.name }).click();
        await expect(page).toHaveURL(new RegExp(`${item.path}$`));
      });
    }
  });

  test('Worksセクションが表示される', async ({ page }) => {
    const worksHeading = page.getByRole('heading', { name: 'Works' }).last();
    await worksHeading.scrollIntoViewIfNeeded();
    await expect(worksHeading).toBeVisible();

    await expect(page.getByRole('button', { name: 'Work List' })).toBeVisible();

    const worksSection = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'Works' }).last()
    });

    await expect(worksSection.locator('img').first()).toBeVisible();
  });

  test('Work Listボタンを押した場合、Worksページへ遷移する', async ({ page }) => {
    await page.waitForTimeout(5500);

    const worksHeading = page.getByRole('heading', { name: 'Works' }).last();
    await worksHeading.scrollIntoViewIfNeeded();

    await page.getByRole('button', { name: 'Work List' }).click();

    await expect(page).toHaveURL(/\/works$/);
    await expect(page.getByRole('heading', { name: 'Works' })).toBeVisible();
  });

  test('Worksカルーセルのカードを押した場合、Worksページへ遷移する', async ({ page }) => {
    await page.goto('/?e2e=1');
    await page.waitForTimeout(5500);

    const worksHeading = page.getByRole('heading', { name: 'Works' }).last();
    await worksHeading.scrollIntoViewIfNeeded();

    const worksSection = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'Works' }).last()
    });

    const firstCard = worksSection.getByRole('button').first();

    await expect(firstCard).toBeVisible();
    await firstCard.click();

    await expect(page).toHaveURL(/\/works$/);
  });
});
