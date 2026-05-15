import { test, expect } from '@playwright/test';

test.describe('Privacy Policy page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/privacy-policy');
  });

  test('プライバシーポリシーページが表示される', async ({ page }) => {
    await expect(page).toHaveTitle('Privacy Policy | KeveltKit');

    await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible();

    await expect(
      page.getByText('KeveltKit（以下、「当サイト」）では、利用者の個人情報を適切に取り扱います。')
    ).toBeVisible();
  });

  test('各項目の見出しが表示される', async ({ page }) => {
    const headings = [
      '1. 個人情報の利用について',
      '2. 第三者提供について',
      '3. ストレージの利用について',
      '4. 免責事項',
      '5. 著作権について',
      '6. プライバシーポリシーの変更'
    ];

    for (const heading of headings) {
      await expect(page.getByRole('heading', { name: heading, level: 2 })).toBeVisible();
    }
  });

  test('本文が表示される', async ({ page }) => {
    await expect(
      page.getByText('当サイトでは、お問い合わせ等を通じて個人情報をご提供いただく場合があります。')
    ).toBeVisible();

    await expect(
      page.getByText(
        '取得した個人情報を、法令に基づく場合を除き、本人の同意なく第三者へ提供することはありません。'
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        '当サイトでは、表示演出や利便性向上のため、ブラウザのセッションストレージを利用する場合があります。'
      )
    ).toBeVisible();

    await expect(
      page.getByText('本ポリシーは、必要に応じて予告なく変更する場合があります。')
    ).toBeVisible();
  });
});
