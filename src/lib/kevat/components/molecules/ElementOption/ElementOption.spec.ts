import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import ElementOption from './ElementOption.svelte';
import * as styles from './ElementOption.css';

describe('ElementOption', () => {
  test.each([
    { element: 'fire' as const, label: 'FIRE', level: 1 as const },
    { element: 'stone' as const, label: 'STONE', level: 2 as const },
    { element: 'mist' as const, label: 'MIST', level: 3 as const }
  ])('element=$elementの場合、アイコンとレベルバッジが表示される', ({ element, label, level }) => {
    const { container } = render(ElementOption, { props: { element, level } });
    const button = screen.getByRole('button', { name: label });

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass(styles.button, styles.elementVariants[element]);
    expect(button).toHaveAttribute('aria-describedby', `${element}-level`);
    expect(button.querySelector('source')).toHaveAttribute(
      'srcset',
      `/images/kevat/elements/${element}.webp`
    );
    expect(container.querySelector(`#${element}-level`)).toHaveTextContent(`Lv.${level}`);
  });

  test('onclickが渡された場合、クリック時に呼び出される', async () => {
    const onclick = vi.fn();
    render(ElementOption, { props: { element: 'fire', level: 1, onclick } });

    await fireEvent.click(screen.getByRole('button', { name: 'FIRE' }));

    expect(onclick).toHaveBeenCalledOnce();
  });
});
