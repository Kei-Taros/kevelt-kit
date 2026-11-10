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
      Array.from(container.querySelectorAll('source[srcset^="/images/kevat/elements/"]')).map(
        (source) => source.getAttribute('srcset')
      )
    ).toEqual([
      '/images/kevat/elements/fire.webp',
      '/images/kevat/elements/stone.webp',
      '/images/kevat/elements/mist.webp'
    ]);
    expect(
      container.querySelector('source[srcset="/images/kevat/effects/mist-effect.webp"]')
    ).toBeNull();
  });

  test('封印属性が渡された場合、その属性のアイコンだけに霧が表示される', () => {
    render(EnemyLevels, {
      props: { levels: { fire: 1, stone: 2, mist: 3 }, sealedElement: 'stone' }
    });

    const groups = screen.getAllByRole('group');
    expect(
      groups.map((group) =>
        Boolean(group.querySelector('source[srcset="/images/kevat/effects/mist-effect.webp"]'))
      )
    ).toEqual([false, true, false]);
  });
});
