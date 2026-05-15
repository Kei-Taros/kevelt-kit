import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, test, expect, vi } from 'vitest';
import SnapDots from './SnapDots.svelte';
import * as styles from './SnapDots.css';

describe('SnapDots', () => {
  test('countを指定した場合、指定した数のdotが表示される', () => {
    render(SnapDots, {
      props: {
        count: 4
      }
    });

    expect(screen.getAllByRole('button')).toHaveLength(4);
  });

  test('count未指定の場合、4つのdotが表示される', () => {
    render(SnapDots);

    expect(screen.getAllByRole('button')).toHaveLength(4);
  });

  test('activeIndexを指定した場合、指定したdotにactiveクラスが付与される', () => {
    render(SnapDots, {
      props: {
        count: 4,
        activeIndex: 1
      }
    });

    const dots = screen.getAllByRole('button');

    expect(dots[1]).toHaveClass(styles.snapDotActive);

    expect(dots[0]).not.toHaveClass(styles.snapDotActive);
    expect(dots[2]).not.toHaveClass(styles.snapDotActive);
    expect(dots[3]).not.toHaveClass(styles.snapDotActive);
  });

  test('dotをクリックした場合、onSelectが呼ばれる', async () => {
    const onSelect = vi.fn();

    render(SnapDots, {
      props: {
        count: 4,
        onSelect
      }
    });

    const dots = screen.getAllByRole('button');

    await fireEvent.click(dots[2]);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  test('countを指定した場合、aria-labelが正しく設定される', () => {
    render(SnapDots, {
      props: {
        count: 3
      }
    });

    expect(screen.getByRole('button', { name: '1セクション' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2セクション' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3セクション' })).toBeInTheDocument();
  });

  test('classを渡した場合、既存classに追加される', () => {
    render(SnapDots, {
      props: {
        class: 'extra-class'
      }
    });

    const container = screen.getAllByRole('button')[0].parentElement;

    expect(container).not.toBeNull();
    expect(container!).toHaveClass('extra-class');
  });

  test('activeIndexを指定した場合、指定したdotにaria-current=stepが付与される', () => {
    render(SnapDots, {
      props: {
        count: 4,
        activeIndex: 2
      }
    });

    const dots = screen.getAllByRole('button');

    expect(dots[2]).toHaveAttribute('aria-current', 'step');

    expect(dots[0]).not.toHaveAttribute('aria-current');
    expect(dots[1]).not.toHaveAttribute('aria-current');
    expect(dots[3]).not.toHaveAttribute('aria-current');
  });
});
