import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import BattleMessage from './BattleMessage.svelte';
import * as styles from './BattleMessage.css';

describe('BattleMessage', () => {
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
