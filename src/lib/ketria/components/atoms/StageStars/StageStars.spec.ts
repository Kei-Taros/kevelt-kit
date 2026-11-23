import { render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import { StageStars } from '../index';

describe('StageStars', () => {
  test('敵の周りに星を表示する場合、乱数に応じて点滅の周期と開始位置を設定する', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.5);

    try {
      const { container } = render(StageStars, { props: { aroundEnemy: true } });
      const star = container.querySelector('span')!;

      expect(Number.parseFloat(star.style.animationDuration)).toBeCloseTo(5.1);
      expect(Number.parseFloat(star.style.animationDelay)).toBeCloseTo(-2.55);
    } finally {
      random.mockRestore();
    }
  });

  test('星の演出を表示する場合、画面全体に異なるタイミングで光る星を配置する', () => {
    const { container } = render(StageStars);
    const layer = container.firstElementChild;
    const stars = Array.from(layer?.querySelectorAll('span') ?? []);
    const heights = stars.map((star) => Number.parseFloat(star.style.top));
    const positions = stars.map((star) => Number.parseFloat(star.style.left));

    expect(layer).toHaveAttribute('aria-hidden', 'true');
    expect(Math.min(...heights)).toBeLessThan(20);
    expect(Math.max(...heights)).toBeGreaterThan(80);
    expect(Math.min(...positions)).toBeLessThan(20);
    expect(Math.max(...positions)).toBeGreaterThan(80);
    expect(new Set(stars.map((star) => star.style.animationDelay)).size).toBeGreaterThan(1);
  });
});
