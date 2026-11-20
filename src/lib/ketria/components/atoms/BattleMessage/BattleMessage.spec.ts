import { fireEvent, render, screen, within } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import BattleMessage from './BattleMessage.svelte';
import * as styles from './BattleMessage.css';

describe('BattleMessage', () => {
  const buttonSnippet = () =>
    createRawSnippet(() => ({
      render: () => '<button type="button">NEXT STAGE</button>'
    }));

  test('ボタンのSnippetが渡された場合、メッセージと同じ背景内で文字の下に表示される', () => {
    const { container } = render(BattleMessage, {
      props: { lines: ['WIN'], children: buttonSnippet() }
    });
    const message = container.querySelector('p')!;
    const button = within(message).getByRole('button', { name: 'NEXT STAGE' });
    const text = within(message).getByText('WIN');
    expect(message).toHaveClass(styles.message);
    expect(text.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('Snippet内のボタンがクリックされた場合、渡したクリック処理が呼ばれる', async () => {
    const onclick = vi.fn();
    const children = createRawSnippet(() => ({
      render: () => '<button type="button">REMATCH</button>',
      setup: (element) => {
        element.addEventListener('click', onclick);
        return () => element.removeEventListener('click', onclick);
      }
    }));
    render(BattleMessage, { props: { lines: ['LOSE'], children } });
    await fireEvent.click(screen.getByRole('button', { name: 'REMATCH' }));
    expect(onclick).toHaveBeenCalledOnce();
  });

  test.each([
    { immediate: false, fading: false, expectedDelay: '1000ms' },
    { immediate: true, fading: false, expectedDelay: '0ms' },
    { immediate: false, fading: true, expectedDelay: '0ms' }
  ])(
    '即時表示が$immediate・フェードアウトが$fadingの場合、文字とSnippetに同じ表示時間と待ち時間が設定される',
    ({ immediate, fading, expectedDelay }) => {
      render(BattleMessage, {
        props: {
          lines: ['WIN'],
          children: buttonSnippet(),
          duration: 700,
          delay: 1000,
          immediate,
          fading
        }
      });
      const text = screen.getByText('WIN');
      const content = screen.getByRole('button', { name: 'NEXT STAGE' }).parentElement!;
      for (const element of [text, content]) {
        expect(element.style.animationDelay).toBe(expectedDelay);
        expect(element.style.animationDuration).toBe('700ms');
        expect(element).toHaveClass(styles.line);
        if (fading) expect(element).toHaveClass(styles.lineFadeOut);
        else expect(element).not.toHaveClass(styles.lineFadeOut);
      }
    }
  );

  test('1行が渡された場合、固定サイズの背景内に中央揃えで表示される', () => {
    const { container } = render(BattleMessage, { props: { lines: ['相手の属性を見極めよ！'] } });

    expect(container.querySelector('p')).toHaveClass(styles.message);
    expect(container.querySelectorAll('span')).toHaveLength(1);
    expect(container.querySelector('span')).toHaveTextContent('相手の属性を見極めよ！');
  });

  test('2行が渡された場合、両方の行が同じ背景内に表示される', () => {
    const { container } = render(BattleMessage, {
      props: { lines: ['相手の属性を見極めよ！', '三すくみを覚えて勝利をつかめ！'] }
    });

    expect(container.querySelector('p')).toHaveClass(styles.message);
    expect(Array.from(container.querySelectorAll('span')).map((span) => span.textContent)).toEqual([
      '相手の属性を見極めよ！',
      '三すくみを覚えて勝利をつかめ！'
    ]);
  });

  test('3行以上が渡された場合、先頭の2行だけ表示される', () => {
    const { container } = render(BattleMessage, {
      props: {
        lines: ['相手の属性を見極め一手を選べ！', '三すくみを覚えて勝利をつかめ！', '3行目']
      }
    });

    expect(Array.from(container.querySelectorAll('span')).map((span) => span.textContent)).toEqual([
      '相手の属性を見極め一手を選べ！',
      '三すくみを覚えて勝利をつかめ！'
    ]);
  });

  test('各行が15文字の場合、省略されずに表示される', () => {
    const { container } = render(BattleMessage, {
      props: { lines: ['123456789012345', 'あいうえおかきくけこさしすせそ'] }
    });

    expect(Array.from(container.querySelectorAll('span')).map((span) => span.textContent)).toEqual([
      '123456789012345',
      'あいうえおかきくけこさしすせそ'
    ]);
  });

  test('各行が15文字を超える場合、16文字目以降が切り捨てられる', () => {
    const { container } = render(BattleMessage, {
      props: { lines: ['1234567890123456', 'あいうえおかきくけこさしすせそた'] }
    });

    expect(Array.from(container.querySelectorAll('span')).map((span) => span.textContent)).toEqual([
      '123456789012345',
      'あいうえおかきくけこさしすせそ'
    ]);
  });
});
