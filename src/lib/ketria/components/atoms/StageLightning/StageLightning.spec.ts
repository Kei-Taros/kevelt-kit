import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import { StageLightning } from '../index';

describe('StageLightning', () => {
  test('敵の幅を避ける装飾レイヤーに6本の稲妻を表示する', () => {
    const { container } = render(StageLightning, { enemyWidth: '60dvh' });
    const layer = container.querySelector<HTMLElement>('[aria-hidden="true"]');

    expect(layer).toBeInTheDocument();
    expect(layer?.style.getPropertyValue('--stage-lightning-enemy-width')).toBe('60dvh');
    expect(layer?.querySelectorAll('span')).toHaveLength(6);
  });

  test('点滅を繰り返した稲妻だけ横位置を選び直す', async () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.25);

    try {
      const { container } = render(StageLightning, { enemyWidth: '60dvh' });
      const [first, second] = container.querySelectorAll('span');
      const initialClass = first.className;

      random.mockReturnValue(0.75);
      await fireEvent(first, new Event('animationiteration'));

      expect(first.className).not.toBe(initialClass);
      expect(first.style.getPropertyValue('--stage-bolt-position')).toBe('0.75');
      expect(second.style.getPropertyValue('--stage-bolt-position')).toBe('0.25');
    } finally {
      random.mockRestore();
    }
  });
});
