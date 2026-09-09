import { expect, test, type Page } from '@playwright/test';

const coverSelector = 'img[alt="hero-cover"]';

const coverScale = async (page: Page) => {
  return page.locator(coverSelector).evaluate((cover) => {
    return new DOMMatrixReadOnly(getComputedStyle(cover).transform).a;
  });
};

const heroSize = async (page: Page) => {
  return page
    .locator('video')
    .filter({ has: page.locator('source[src*="hero-video"]') })
    .evaluate((video) => {
      const { width, height } = video.getBoundingClientRect();
      return { width, height };
    });
};

for (const device of [
  { name: 'PC', viewport: { width: 1440, height: 900 }, touch: false, unlockScale: 30 },
  { name: 'TB', viewport: { width: 820, height: 1180 }, touch: true, unlockScale: 45 },
  { name: 'SP', viewport: { width: 390, height: 844 }, touch: true, unlockScale: 45 }
]) {
  test.describe(`Home scroll (${device.name})`, () => {
    test.use({ viewport: device.viewport, hasTouch: device.touch, isMobile: device.touch });

    if (device.touch) {
      test('遷移オーバーレイで始めたタッチを続けた場合、拡大前にスクロールしない', async ({
        page,
        context
      }) => {
        await page.clock.install();
        await page.goto('/privacy-policy');
        await page.waitForFunction(() => history.state?.['sveltekit:navigation'] !== undefined);
        await expect(page.locator('header')).toHaveCSS('opacity', '1');
        const homeLink = page.locator('footer a[href="/"]');
        await homeLink.scrollIntoViewIfNeeded();
        await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
        await homeLink.click();
        await expect
          .poll(async () => {
            await page.clock.runFor(16);
            return page.locator(coverSelector).count();
          })
          .toBe(1);
        const transition = page
          .locator('video')
          .filter({ has: page.locator('source[src*="route-transition"]') });
        await expect(transition).toBeAttached();
        const touch = await context.newCDPSession(page);
        const x = Math.round(device.viewport.width / 2);
        let y = device.viewport.height - 100;
        expect(
          await transition.evaluate(
            (video, point) => {
              return video.parentElement?.contains(document.elementFromPoint(point.x, point.y));
            },
            { x, y }
          )
        ).toBe(true);
        await touch.send('Input.dispatchTouchEvent', {
          type: 'touchStart',
          touchPoints: [{ x, y }]
        });
        for (let i = 0; i < 2; i += 1) {
          y -= 35;
          await touch.send('Input.dispatchTouchEvent', {
            type: 'touchMove',
            touchPoints: [{ x, y }]
          });
        }
        await expect.poll(() => coverScale(page)).toBeGreaterThan(1.05);
        expect(await page.evaluate(() => window.scrollY)).toBe(0);
        await page.clock.runFor(300);
        await expect(transition).toHaveCount(0);
        for (let i = 0; i < 3; i += 1) {
          y -= 35;
          await touch.send('Input.dispatchTouchEvent', {
            type: 'touchMove',
            touchPoints: [{ x, y }]
          });
        }
        expect(await page.evaluate(() => window.scrollY)).toBe(0);
        expect(await coverScale(page)).toBeGreaterThan(1.05);
        await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        y = device.viewport.height - 100;
        await touch.send('Input.dispatchTouchEvent', {
          type: 'touchStart',
          touchPoints: [{ x, y }]
        });
        for (let i = 0; i < 10; i += 1) {
          y -= 35;
          await touch.send('Input.dispatchTouchEvent', {
            type: 'touchMove',
            touchPoints: [{ x, y }]
          });
        }
        await expect.poll(() => coverScale(page)).toBeGreaterThan(device.unlockScale - 0.1);
        await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await touch.detach();
      });
    }

    test('別ページから連続スクロールした場合、IDEASの拡大後にスクロールが進む', async ({
      page,
      context
    }) => {
      await page.goto('/privacy-policy');
      await page.waitForFunction(() => history.state?.['sveltekit:navigation'] !== undefined);
      await expect(page.locator('header')).toHaveCSS('opacity', '1');
      const homeLink = page.locator('footer a[href="/"]');
      await homeLink.scrollIntoViewIfNeeded();
      await homeLink.click();

      const touch = device.touch ? await context.newCDPSession(page) : null;
      const x = Math.round(device.viewport.width / 2);
      let y = device.viewport.height - 100;
      await expect(page.locator(coverSelector)).toBeAttached();
      await expect(page).toHaveURL(/\/$/);
      if (touch) {
        await expect(page.locator('video source[src*="route-transition"]')).toHaveCount(0);
        await touch.send('Input.dispatchTouchEvent', {
          type: 'touchStart',
          touchPoints: [{ x, y }]
        });
      }

      const initialSize = await heroSize(page);
      expect(initialSize.width).toBeCloseTo(device.viewport.width, 0);
      expect(initialSize.height).toBeGreaterThanOrEqual(device.viewport.height);

      const scrollStep = async () => {
        if (touch) {
          y -= 35;
          await touch.send('Input.dispatchTouchEvent', {
            type: 'touchMove',
            touchPoints: [{ x, y }]
          });
        } else {
          await page.mouse.wheel(0, 100);
        }
      };

      if (!touch) {
        await page.keyboard.press('PageDown');
        await page.waitForTimeout(350);
        expect(await page.evaluate(() => window.scrollY)).toBe(0);
      }

      await scrollStep();
      await scrollStep();
      await expect.poll(() => coverScale(page)).toBeGreaterThan(1.05);
      expect(await coverScale(page)).toBeLessThan(device.unlockScale);
      expect(await page.evaluate(() => window.scrollY)).toBe(0);

      for (let i = 0; i < 8; i += 1) await scrollStep();
      await expect.poll(() => coverScale(page)).toBeGreaterThan(device.unlockScale - 0.1);
      expect(await heroSize(page)).toEqual(initialSize);

      if (touch) {
        await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        y = device.viewport.height - 100;
        await touch.send('Input.dispatchTouchEvent', {
          type: 'touchStart',
          touchPoints: [{ x, y }]
        });
      }
      for (let i = 0; i < 5; i += 1) await scrollStep();
      if (touch)
        await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
      expect(await heroSize(page)).toEqual(initialSize);
      await touch?.detach();
    });
  });
}
