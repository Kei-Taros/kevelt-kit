import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import EnemyLevels from './EnemyLevels.svelte';

describe('EnemyLevels', () => {
  test('属性レベルが渡された場合、fire・stone・mistの順にアイコンとレベルが表示される', () => {
    const { container } = render(EnemyLevels, {
      props: { levels: { fire: 1, stone: 2, mist: 3 } }
    });

    const groups = screen.getAllByRole('group');
    expect(groups.map((group) => group.getAttribute('aria-label'))).toEqual([
      'FIRE',
      'STONE',
      'MIST'
    ]);
    expect(groups.map((group) => group.textContent?.trim())).toEqual(['Lv.1', 'Lv.2', 'Lv.3']);
    expect(
      Array.from(container.querySelectorAll('source[type="image/webp"]')).map((source) =>
        source.getAttribute('srcset')
      )
    ).toEqual([
      '/images/kevat/elements/fire.webp',
      '/images/kevat/elements/stone.webp',
      '/images/kevat/elements/mist.webp'
    ]);
  });
});
