import { test, expect, type Page } from '@playwright/test';

const waitForClientReady = async (page: Page) => {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(300);
};

const getSectionByHeading = (page: Page, headingName: string) =>
  page
    .locator('section')
    .filter({
      has: page.getByRole('heading', { name: headingName, exact: true })
    })
    .first();

test.describe('About Me page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about-me');
    await waitForClientReady(page);
  });

  test('About Meページの内容が表示される', async ({ page }) => {
    await expect(page).toHaveTitle('About Me | KeveltKit');
    await expect(page).toHaveURL(/\/about-me$/);

    const aboutSection = getSectionByHeading(page, 'About Me');

    await expect(
      aboutSection.getByRole('heading', { name: 'About Me', exact: true })
    ).toBeVisible();

    await expect(aboutSection.getByText('NAME:')).toBeVisible();
    await expect(aboutSection.getByText('keitarou kase')).toBeVisible();
    await expect(aboutSection.getByText('BIRTH:')).toBeVisible();
    await expect(aboutSection.getByText('1996')).toBeVisible();
    await expect(aboutSection.getByRole('img', { name: 'profile' })).toBeVisible();
  });

  test('プロフィール文章が表示される', async ({ page }) => {
    const aboutSection = getSectionByHeading(page, 'About Me');
    const paragraphs = aboutSection.locator('p');

    await expect(paragraphs.first()).toBeVisible();
    expect(await paragraphs.count()).toBeGreaterThan(2);
  });

  test('Skillsセクションが表示される', async ({ page }) => {
    const skillsSection = getSectionByHeading(page, 'Skills');

    await expect(skillsSection.getByRole('heading', { name: 'Skills', exact: true })).toBeVisible();

    const icons = skillsSection.getByRole('img');

    await expect(icons.first()).toBeVisible();
    expect(await icons.count()).toBeGreaterThan(0);
  });
});
