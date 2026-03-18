import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { onNavigate } from '$app/navigation';
import RouteTransition from './RouteTransition.svelte';
import * as styles from './RouteTransition.css';

vi.mock('$app/navigation', () => ({
  onNavigate: vi.fn()
}));

describe('RouteTransition', () => {
  beforeEach(() => {
    vi.mocked(onNavigate).mockReset();

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

  const createTarget = (path: string) => {
    const url = new URL(`https://example.com${path}`);

    return {
      url,
      params: {},
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
    }) as any;

  const getNavigateHandler = () => {
    expect(onNavigate).toHaveBeenCalledTimes(1);
    return vi.mocked(onNavigate).mock.calls[0][0];
  };

  const flush = async () => {
    await tick();
    await Promise.resolve();
    await Promise.resolve();
  };

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

  test('遷移先がトップページの場合、オーバーレイが表示されない', () => {
    const { container } = render(RouteTransition);

    const navigateHandler = getNavigateHandler();
    const result = navigateHandler(createNavigation('/about-me', '/'));

    expect(result).toBeUndefined();
    expect(container.querySelector(`.${styles.transitionOverlay}`)).not.toBeInTheDocument();
  });

  test('同一ページに遷移する場合、オーバーレイが表示されない', () => {
    const { container } = render(RouteTransition);

    const navigateHandler = getNavigateHandler();
    const result = navigateHandler(createNavigation('/about-me?tab=1#top', '/about-me?tab=1#top'));

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
});
