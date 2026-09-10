import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { onNavigate } from '$app/navigation';
import RouteTransition from './RouteTransition.svelte';
import * as styles from './RouteTransition.css';

vi.mock('$app/navigation', () => ({
  onNavigate: vi.fn()
}));

describe('RouteTransition', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.mocked(onNavigate).mockReset();
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      get: () => ({ ready: Promise.resolve() })
    });

    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      value: vi.fn().mockResolvedValue(undefined)
    });

    Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
      configurable: true,
      value: vi.fn()
    });

    Object.defineProperty(HTMLMediaElement.prototype, 'load', {
      configurable: true,
      value: vi.fn()
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.querySelectorAll('[data-transition-test]').forEach((element) => element.remove());
    sessionStorage.clear();
  });

  const createTarget = (path: string) => {
    const url = new URL(`https://example.com${path}`);

    return {
      url,
      params: {},
      scroll: { x: 0, y: 0 },
      route: { id: url.pathname }
    };
  };

  const createNavigation = (fromPath: string, toPath: string) =>
    ({
      from: createTarget(fromPath),
      to: createTarget(toPath),
      type: 'goto',
      event: null,
      willUnload: false,
      complete: Promise.resolve()
    }) as Parameters<Parameters<typeof onNavigate>[0]>[0];

  const getNavigateHandler = () => {
    expect(onNavigate).toHaveBeenCalledTimes(1);
    return vi.mocked(onNavigate).mock.calls[0][0];
  };

  const flush = async () => {
    await tick();
    await Promise.resolve();
    await Promise.resolve();
  };

  const finishVideo = async (container: HTMLElement) => {
    const navigation = getNavigateHandler()(createNavigation('/about-me', '/works'));
    await flush();
    await vi.advanceTimersByTimeAsync(0);
    container.querySelector('video')!.dispatchEvent(new Event('ended'));
    const afterNavigation = await navigation;
    if (typeof afterNavigation !== 'function') throw new Error('Missing navigation callback');
    afterNavigation();
    await flush();
  };

  test('遷移先の画像の読み込みまたはデコードが未完了の場合、完了するまでオーバーレイを表示する', async () => {
    vi.useFakeTimers();
    const { container } = render(RouteTransition);
    const img = document.createElement('img');
    img.dataset.transitionTest = '';
    img.src = '/delayed-image.png';
    Object.defineProperty(img, 'complete', { value: false });
    let decoded!: () => void;
    img.decode = vi.fn(() => new Promise<void>((resolve) => (decoded = resolve)));
    document.body.append(img);

    await finishVideo(container);
    await vi.advanceTimersByTimeAsync(1000);
    const overlay = container.querySelector(`.${styles.transitionOverlay}`);
    expect(overlay).toBeInTheDocument();
    expect(overlay).not.toHaveClass(styles.transitionFadeOut);
    expect(container.querySelector('video')).not.toBeInTheDocument();

    img.dispatchEvent(new Event('load'));
    await vi.advanceTimersByTimeAsync(1000);
    expect(img.decode).toHaveBeenCalled();
    expect(overlay).not.toHaveClass(styles.transitionFadeOut);
    decoded();
    await vi.advanceTimersByTimeAsync(1000);
    expect(overlay).not.toBeInTheDocument();
  });

  test('フォントの準備が未完了の場合、完了するまでオーバーレイを表示する', async () => {
    vi.useFakeTimers();
    let ready!: () => void;
    vi.spyOn(document, 'fonts', 'get').mockReturnValue({
      ready: new Promise<void>((resolve) => (ready = resolve))
    } as unknown as FontFaceSet);
    const { container } = render(RouteTransition);
    await finishVideo(container);
    await vi.advanceTimersByTimeAsync(1000);
    expect(container.querySelector(`.${styles.transitionOverlay}`)).toBeInTheDocument();
    ready();
    await vi.advanceTimersByTimeAsync(1000);
    expect(container.querySelector(`.${styles.transitionOverlay}`)).not.toBeInTheDocument();
  });

  test('画像の読み込みが失敗した場合、オーバーレイを非表示にする', async () => {
    vi.useFakeTimers();
    const img = document.createElement('img');
    img.dataset.transitionTest = '';
    img.src = '/broken.png';
    Object.defineProperty(img, 'complete', { value: false });
    document.body.append(img);
    const { container } = render(RouteTransition);
    await finishVideo(container);
    expect(container.querySelector(`.${styles.transitionOverlay}`)).not.toHaveClass(
      styles.transitionFadeOut
    );
    img.dispatchEvent(new Event('error'));
    await vi.advanceTimersByTimeAsync(1000);
    expect(container.querySelector(`.${styles.transitionOverlay}`)).not.toBeInTheDocument();
  });

  test('初期表示の場合、オーバーレイが表示されない', () => {
    const { container } = render(RouteTransition);

    expect(container.querySelector(`.${styles.transitionOverlay}`)).not.toBeInTheDocument();
  });

  test('別ページに遷移する場合、オーバーレイと動画が表示される', async () => {
    const { container } = render(RouteTransition);

    const navigateHandler = getNavigateHandler();
    navigateHandler(createNavigation('/about-me', '/works'));

    await flush();

    const overlay = container.querySelector(`.${styles.transitionOverlay}`);
    const video = container.querySelector('video');

    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
    expect(overlay).not.toHaveClass(styles.transitionFadeOut);
    expect(video).toBeInTheDocument();
    expect(video).toHaveClass(styles.transitionVideo);
  });

  test('同一ページに遷移する場合、オーバーレイが表示されない', () => {
    const { container } = render(RouteTransition);

    const navigateHandler = getNavigateHandler();
    const result = navigateHandler(createNavigation('/about-me?tab=1#top', '/about-me?tab=1#top'));

    expect(result).toBeUndefined();
    expect(container.querySelector(`.${styles.transitionOverlay}`)).not.toBeInTheDocument();
  });

  test('クエリのみ変更された場合、オーバーレイが表示されない', () => {
    const { container } = render(RouteTransition);

    const navigateHandler = getNavigateHandler();
    const result = navigateHandler(createNavigation('/works', '/works?work=6'));

    expect(result).toBeUndefined();
    expect(container.querySelector(`.${styles.transitionOverlay}`)).not.toBeInTheDocument();
  });

  test('遷移中の場合、次の遷移処理が実行されない', async () => {
    const { container } = render(RouteTransition);

    const navigateHandler = getNavigateHandler();
    navigateHandler(createNavigation('/about-me', '/works'));

    await flush();

    const secondResult = navigateHandler(createNavigation('/works', '/news'));

    expect(secondResult).toBeUndefined();
    expect(container.querySelectorAll(`.${styles.transitionOverlay}`)).toHaveLength(1);
  });

  test('/news配下同士で遷移する場合、オーバーレイが表示されない', () => {
    const { container } = render(RouteTransition);

    const navigateHandler = getNavigateHandler();
    const result = navigateHandler(createNavigation('/news', '/news/2024'));

    expect(result).toBeUndefined();
    expect(container.querySelector(`.${styles.transitionOverlay}`)).not.toBeInTheDocument();
  });

  test.each(['/', '/#top', '/?tab=1'])(
    'トップページから%sへ遷移する場合、skipOpeningOnceが保存されない',
    (toPath) => {
      render(RouteTransition);

      const navigateHandler = getNavigateHandler();
      const result = navigateHandler(createNavigation('/', toPath));

      expect(result).toBeUndefined();
      expect(sessionStorage.getItem('skipOpeningOnce')).toBeNull();
    }
  );

  test('トップページ以外へ遷移する場合、skipOpeningOnceが保存されない', () => {
    render(RouteTransition);

    getNavigateHandler()(createNavigation('/', '/about-me'));

    expect(sessionStorage.getItem('skipOpeningOnce')).toBeNull();
  });

  test('別ページから/へ遷移する場合、skipOpeningOnceがsessionStorageに保存される', () => {
    render(RouteTransition);

    const navigateHandler = getNavigateHandler();

    navigateHandler(createNavigation('/news', '/'));

    expect(sessionStorage.getItem('skipOpeningOnce')).toBe('true');
  });
});
