import '@testing-library/jest-dom/vitest';

if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => [];
}

if (!Element.prototype.animate) {
  Element.prototype.animate = ((_frames: unknown, options: KeyframeAnimationOptions) => {
    const animation = {
      cancel: () => clearTimeout(timer),
      finish: () => animation.onfinish?.(),
      pause: () => {},
      play: () => {},
      reverse: () => {},
      currentTime: 0,
      effect: { getComputedTiming: () => ({ progress: 1 }) },
      finished: Promise.resolve(),
      onfinish: null as (() => void) | null
    };
    const timer = setTimeout(() => animation.onfinish?.(), Number(options?.duration ?? 0));
    return animation;
  }) as unknown as typeof Element.prototype.animate;
}

if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
      addListener: () => {},
      removeListener: () => {}
    }) as unknown as MediaQueryList;
}

if (!globalThis.IntersectionObserver) {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  globalThis.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
}

if (!globalThis.ResizeObserver) {
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
}
