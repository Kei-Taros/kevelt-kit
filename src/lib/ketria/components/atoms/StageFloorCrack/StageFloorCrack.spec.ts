import { render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import { StageFloorCrack } from '../index';

describe('StageFloorCrack', () => {
  test('次の発生間隔が1秒の場合、先に出た3本を残したまま別の起点から3本の亀裂を表示する', async () => {
    vi.useFakeTimers();
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);

    try {
      const { container, unmount } = render(StageFloorCrack);
      const positions = () =>
        [...container.querySelectorAll('svg > g')].map((crack) => crack.getAttribute('transform'));
      const first = positions();
      expect(new Set(first).size).toBe(3);
      const mainPaths = [...container.querySelectorAll('svg > g > path:first-child')];
      expect(new Set(mainPaths.map((path) => path.getAttribute('d'))).size).toBe(3);
      for (const position of first) {
        const [, x, y] = position?.match(/^translate\(([\d.]+) ([\d.]+)\)/) ?? [];
        expect(Number(x)).toBeGreaterThanOrEqual(420);
        expect(Number(x)).toBeLessThanOrEqual(580);
        expect(Number(y)).toBeGreaterThanOrEqual(310);
        expect(Number(y)).toBeLessThanOrEqual(325);
      }

      random.mockReturnValue(0.5);
      await vi.advanceTimersByTimeAsync(999);
      expect(positions()).toEqual(first);
      await vi.advanceTimersByTimeAsync(1);
      const second = positions();
      expect(second.slice(0, 3)).toEqual(first);
      expect(new Set(second).size).toBe(6);

      await vi.advanceTimersByTimeAsync(1100);
      expect(positions()).toEqual(second.slice(3));
      unmount();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      random.mockRestore();
      vi.useRealTimers();
    }
  });
});
