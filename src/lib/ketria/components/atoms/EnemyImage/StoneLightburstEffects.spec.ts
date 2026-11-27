import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import StoneLightburstEffects from './StoneLightburstEffects.svelte';

describe('StoneLightburstEffects', () => {
  test('第2形態の演出を描画した場合、足元から上へ伸びる雷を6本表示する', () => {
    const { container } = render(StoneLightburstEffects);
    const bolts = container.querySelectorAll('svg path');
    expect(bolts).toHaveLength(6);
    for (const bolt of bolts) {
      const coordinates = bolt.getAttribute('d')?.match(/\d+/g)?.map(Number) ?? [];
      expect(coordinates[1]).toBeGreaterThan(coordinates.at(-1)!);
    }
  });

  test('胸の光のアニメーションが1周期終わった場合、その光の角度を再設定する', async () => {
    const random = vi.spyOn(Math, 'random').mockReturnValueOnce(0.25).mockReturnValueOnce(0.5);
    try {
      const { container } = render(StoneLightburstEffects);
      const glow = container.querySelector('span')!;
      expect(glow.style.getPropertyValue('--lightburst-angle')).toBe('45deg');
      expect(glow.style.getPropertyValue('--lightburst-offset-angle')).toBe('90deg');

      random.mockReturnValue(0.75);
      const iteration = new Event('animationiteration', { bubbles: true });
      Object.defineProperty(iteration, 'pseudoElement', { value: '::before' });
      await fireEvent(glow, iteration);
      expect(glow.style.getPropertyValue('--lightburst-angle')).toBe('135deg');
      expect(glow.style.getPropertyValue('--lightburst-offset-angle')).toBe('90deg');
    } finally {
      random.mockRestore();
    }
  });
});
