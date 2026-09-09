import { expect, test, type Page } from '@playwright/test';

const hero = (page: Page) =>
  page.locator('video').filter({ has: page.locator('source[src*="hero-video"]') });
const cover = (page: Page) => page.getByAltText('hero-cover', { exact: true });
const white = (page: Page) => page.locator('img[src="/images/hero-cover/hero-cover-white.png"]');

const observePlayback = async (page: Page, hold = false, holdCover = false) => {
  await page.addInitScript(
    ({ hold, holdCover }) => {
      const play = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        if (!this.querySelector('source[src*="hero-video"]')) return play.call(this);
        this.setAttribute('data-test-play-start', String(this.currentTime));
        if (!hold) return play.call(this);
        return new Promise<void>((resolve, reject) => {
          this.addEventListener('test-release-play', () => play.call(this).then(resolve, reject), {
            once: true
          });
        });
      };
      if (holdCover) {
        const decode = HTMLImageElement.prototype.decode;
        const released = new Promise<void>((resolve) => {
          window.addEventListener('test-release-cover', () => resolve(), { once: true });
        });
        HTMLImageElement.prototype.decode = async function () {
          if (this.alt === 'hero-cover') {
            this.setAttribute('data-test-decode-started', 'true');
            await released;
          }
          return decode.call(this);
        };
      }
    },
    { hold, holdCover }
  );
};

const returnHome = async (page: Page) => {
  await page.goto('/privacy-policy');
  await page.waitForFunction(() => history.state?.['sveltekit:navigation'] !== undefined);
  await expect(page.locator('header')).toHaveCSS('opacity', '1');
  await page.locator('footer a[href="/"]').click();
  await expect(page).toHaveURL(/\/$/);
  await expect(hero(page)).toHaveAttribute('data-test-play-start', '3');
};

const expectPlaying = async (page: Page) => {
  await expect
    .poll(() =>
      hero(page).evaluate((element) => {
        const video = element as HTMLVideoElement;
        return (
          !video.paused &&
          video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
          video.currentTime > 3
        );
      })
    )
    .toBe(true);
};

const expectFade = async (page: Page) => {
  await expect(white(page)).toHaveCSS('animation-duration', '2s');
  await expect(white(page)).toHaveCSS('animation-delay', '0s');
  await expect
    .poll(() => white(page).evaluate((image) => Number(getComputedStyle(image).opacity)))
    .toBeLessThan(0.95);
  expect(
    await white(page).evaluate((image) => Number(getComputedStyle(image).opacity))
  ).toBeGreaterThan(0);
  await expect(white(page)).toHaveCount(0, { timeout: 4000 });
};

for (const device of [
  { name: 'PC', viewport: { width: 1440, height: 900 }, touch: false, image: 'hero-cover.webp' },
  { name: 'TB', viewport: { width: 820, height: 1180 }, touch: true, image: 'hero-cover-tb.webp' },
  { name: 'SP', viewport: { width: 390, height: 844 }, touch: true, image: 'hero-cover-sp.webp' }
]) {
  test.describe(`Home media (${device.name})`, () => {
    test.use({ viewport: device.viewport, hasTouch: device.touch, isMobile: device.touch });

    test('初回アクセスまたは別ページから遷移した場合、動画が3秒から実際に再生される', async ({
      page
    }) => {
      await observePlayback(page);
      await page.goto('/');
      await expect(hero(page)).toHaveAttribute('data-test-play-start', '3', { timeout: 10000 });
      await expectPlaying(page);
      await expect(white(page)).toHaveCount(0);
      await returnHome(page);
      await expectPlaying(page);
    });

    test('IDEASの表示準備が完了した場合、白い画像を再生開始まで保持して2秒で消す', async ({
      page
    }) => {
      await observePlayback(page, true, true);
      await returnHome(page);
      await expect(cover(page)).toHaveAttribute('data-test-decode-started', 'true');
      expect(
        await cover(page).evaluate((image) => (image as HTMLImageElement).currentSrc)
      ).toContain(device.image);
      await expect(white(page)).toHaveCount(0);
      await page.evaluate(() => window.dispatchEvent(new Event('test-release-cover')));
      await expect(white(page)).toBeVisible();
      await expect(white(page)).toHaveCSS('opacity', '1');
      await expect(white(page)).toHaveCSS('animation-name', 'none');
      const layers = await page.evaluate(() => {
        const cover = document.querySelector('img[alt="hero-cover"]')!;
        const white = document.querySelector('img[src*="hero-cover-white.png"]')!;
        const video = document.querySelector('source[src*="hero-video"]')!.parentElement!;
        return [cover, white, video].map((element) => Number(getComputedStyle(element).zIndex));
      });
      expect(layers[0]).toBeGreaterThan(layers[1]);
      expect(layers[1]).toBeGreaterThan(layers[2]);
      await page.waitForTimeout(1200);
      await expect(white(page)).toHaveCSS('opacity', '1');
      await expect(white(page)).toHaveCSS('animation-name', 'none');
      await hero(page).dispatchEvent('test-release-play');
      await expectPlaying(page);
      await expectFade(page);
    });

    test('動画がIDEASより先に再生された場合、白い画像はIDEASの準備後にフェードする', async ({
      page
    }) => {
      await observePlayback(page, false, true);
      await returnHome(page);
      await expectPlaying(page);
      await expect(cover(page)).toHaveAttribute('data-test-decode-started', 'true');
      await expect(white(page)).toHaveCount(0);
      await page.evaluate(() => window.dispatchEvent(new Event('test-release-cover')));
      await expect(white(page)).toBeAttached();
      await expectFade(page);
    });
  });
}

test('動画メタデータの取得が遅れた場合、取得後に3秒へシークして再生する', async ({ page }) => {
  await observePlayback(page);
  let releaseVideo!: () => void;
  const videoGate = new Promise<void>((resolve) => {
    releaseVideo = resolve;
  });
  await page.route('**/videos/hero-video/**', async (route) => {
    await videoGate;
    await route.continue();
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect
    .poll(() => page.evaluate(() => sessionStorage.getItem('hasSeenOpening')))
    .toBe('true');
  await expect(page.locator('video source[src*="/intro/"]')).toHaveCount(0, { timeout: 10000 });
  await expect(hero(page)).not.toHaveAttribute('data-test-play-start');
  expect(await hero(page).evaluate((element) => (element as HTMLVideoElement).readyState)).toBe(0);
  releaseVideo();
  await expect(hero(page)).toHaveAttribute('data-test-play-start', '3');
  await expectPlaying(page);
});
