import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import { StageStars } from '../index';

describe('StageStars', () => {
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
