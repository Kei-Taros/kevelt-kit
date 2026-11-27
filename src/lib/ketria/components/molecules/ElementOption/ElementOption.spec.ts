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
      `/images/ketria/elements/${element}.webp`
    );
    expect(container.querySelector(`#${element}-level`)).toHaveTextContent(`Lv.${level}`);
  });

  test.each([{ element: 'fire' }, { element: 'stone' }, { element: 'mist' }] as const)(
    'element=$elementの場合、ホバー用の三すくみ画像にWebPとPNGが設定される',
    ({ element }) => {
      render(ElementOption, { props: { element, level: 1 } });
      const button = screen.getByRole('button', { name: element.toUpperCase() });
      const sources = button.querySelectorAll('source[type="image/webp"]');

      expect(sources).toHaveLength(2);
      expect(sources[1]).toHaveAttribute('srcset', `/images/ketria/cycle/${element}-cycle.webp`);
      expect(
        button.querySelector(`img[src="/images/ketria/cycle/${element}-cycle.png"]`)
      ).toBeInTheDocument();
    }
  );

  test('onclickが渡された場合、クリック時に呼び出される', async () => {
    const onclick = vi.fn();
    render(ElementOption, { props: { element: 'fire', level: 1, onclick } });

    await fireEvent.click(screen.getByRole('button', { name: 'FIRE' }));

    expect(onclick).toHaveBeenCalledOnce();
  });

  test.each(['fire', 'stone', 'mist'] as const)(
    'element=%sのボタンを押した場合、属性色の波紋を表示する',
    async (element) => {
      const { container } = render(ElementOption, { props: { element, level: 1 } });
      const button = screen.getByRole('button', { name: element.toUpperCase() });
      expect(container.querySelector(`.${styles.ripple}`)).not.toBeInTheDocument();

      await fireEvent.click(button);
      const firstRipple = container.querySelector(`.${styles.ripple}`);
      expect(firstRipple).toHaveClass(styles.rippleVariants[element]);
      expect(firstRipple).toHaveAttribute('aria-hidden', 'true');

      await fireEvent.click(button);
      expect(container.querySelector(`.${styles.ripple}`)).not.toBe(firstRipple);
    }
  );

  test('封印中の場合、属性ボタンを無効化して霧を表示する', () => {
    const { container } = render(ElementOption, {
      props: { element: 'fire', level: 1, sealed: true }
    });

    const button = screen.getByRole('button', { name: 'FIRE' });
    expect(button).toBeDisabled();
    expect(button).not.toHaveClass(styles.levelZero);
    expect(
      container.querySelector('source[srcset="/images/ketria/effects/mist-effect.webp"]')
    ).toBeInTheDocument();
  });

  test('レベル表示を押した場合、三すくみの固定表示が切り替わり攻撃しない', async () => {
    const onclick = vi.fn();
    render(ElementOption, { props: { element: 'fire', level: 1, onclick } });
    const levelButton = screen.getByRole('button', { name: 'FIRE matchup' });

    await fireEvent.click(levelButton);
    expect(levelButton).toHaveAttribute('aria-pressed', 'true');
    expect(onclick).not.toHaveBeenCalled();

    await fireEvent.click(levelButton);
    expect(levelButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('三すくみを固定表示中に属性ボタンを押した場合、表示を解除して攻撃する', async () => {
    const onclick = vi.fn();
    render(ElementOption, { props: { element: 'fire', level: 1, onclick } });
    const levelButton = screen.getByRole('button', { name: 'FIRE matchup' });

    await fireEvent.click(levelButton);
    await fireEvent.click(screen.getByRole('button', { name: 'FIRE' }));

    expect(levelButton).toHaveAttribute('aria-pressed', 'false');
    expect(onclick).toHaveBeenCalledOnce();
  });

  test.each(['fire', 'stone', 'mist'] as const)(
    'element=%sかつlevel=0の場合、ボタンが共通のグレー色になりLv表示を押せない',
    (element) => {
      render(ElementOption, { props: { element, level: 0 } });

      expect(screen.getByRole('button', { name: element.toUpperCase() })).toHaveClass(
        styles.levelZero
      );
      expect(
        screen.getByRole('button', { name: `${element.toUpperCase()} matchup` })
      ).toBeDisabled();
    }
  );
});
