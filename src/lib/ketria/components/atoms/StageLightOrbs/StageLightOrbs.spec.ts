import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import { StageLightOrbs } from '../index';
import * as styles from './StageLightOrbs.css';

describe('StageLightOrbs', () => {
  test('光の演出を表示する場合、上昇する光を11個、その場で明滅する光を7個描画する', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.5);

    try {
      const { container } = render(StageLightOrbs);
      const layer = container.querySelector(`.${styles.layer}`);
      const orbs = Array.from(layer?.querySelectorAll('span') ?? []);

      expect(layer).toHaveAttribute('aria-hidden', 'true');
      expect(orbs).toHaveLength(18);
      expect(layer?.querySelectorAll(`.${styles.rising}`)).toHaveLength(11);
      expect(orbs.filter((orb) => orb.style.top === '50%')).toHaveLength(7);
      expect(orbs.filter((orb) => orb.style.top === '81%')).toHaveLength(11);
      expect(orbs.filter((orb) => orb.style.animationDuration === '15s')).toHaveLength(11);
      expect(orbs.filter((orb) => orb.style.animationDuration === '')).toHaveLength(7);
      expect(orbs[0].style.animationDelay).toBe('0s');
      expect(Number.parseFloat(orbs[17].style.animationDelay)).toBeCloseTo(-12.41);
    } finally {
      random.mockRestore();
    }
  });

  test('上昇する光のアニメーションが1周期終わった場合、その光の位置と大きさを再設定する', async () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.5);

    try {
      const { container } = render(StageLightOrbs);
      const orbs = container.querySelectorAll('span');
      const stationary = orbs[0];
      const rising = orbs[7];

      random.mockReturnValue(0.75);
      await fireEvent(rising, new Event('animationiteration'));

      expect(rising.style.left).toBe('73.5%');
      expect(rising.style.top).toBe('89%');
      expect(rising.style.width).toBe('19.75px');
      expect(rising.style.animationDuration).toBe('15s');
      expect(stationary.style.left).toBe('50%');
      expect(stationary.style.top).toBe('50%');
      expect(stationary.style.width).toBe('15.5px');
    } finally {
      random.mockRestore();
    }
  });
});
