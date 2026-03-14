import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, test, expect, beforeEach } from 'vitest';
import Header from './Header.svelte';
import * as styles from './Header.css';

const setScrollY = (value: number) => {
  Object.defineProperty(window, 'scrollY', {
    value,
    writable: true,
    configurable: true
  });
};

describe('Header', () => {
  beforeEach(() => {
    setScrollY(0);
  });

  test('ロゴとナビゲーションリンクが表示される', () => {
    render(Header);

    expect(screen.getByText('KeveltKit')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About Me' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Concept' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Works' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'News' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'A Break' })).toBeInTheDocument();
  });

  test('各ナビゲーションリンクに正しいhref属性が設定される', () => {
    render(Header);

    expect(screen.getByRole('link', { name: 'About Me' })).toHaveAttribute('href', '/about-me');
    expect(screen.getByRole('link', { name: 'Concept' })).toHaveAttribute('href', '/concept');
    expect(screen.getByRole('link', { name: 'Works' })).toHaveAttribute('href', '/works');
    expect(screen.getByRole('link', { name: 'News' })).toHaveAttribute('href', '/news');
    expect(screen.getByRole('link', { name: 'A Break' })).toHaveAttribute('href', '/a-break');
  });

  test('スクロールしてshowOffsetを超えた場合、ヘッダーが表示される', async () => {
    setScrollY(0);

    const { container } = render(Header, { props: { showOffset: 100 } });
    const header = container.querySelector('header');

    expect(header).toHaveClass(styles.hide);

    setScrollY(150);
    await fireEvent.scroll(window);

    expect(header).toHaveClass(styles.show);
    expect(header).not.toHaveClass(styles.hide);
  });

  test('スクロールしてshowOffset以下に戻った場合、ヘッダーが非表示になる', async () => {
    setScrollY(150);

    const { container } = render(Header, { props: { showOffset: 100 } });
    const header = container.querySelector('header');

    expect(header).toHaveClass(styles.show);

    setScrollY(50);
    await fireEvent.scroll(window);

    expect(header).toHaveClass(styles.hide);
    expect(header).not.toHaveClass(styles.show);
  });

  test('showOffset未指定の場合、scrollYが0のときでもヘッダーは表示される', () => {
    setScrollY(0);

    const { container } = render(Header);
    const header = container.querySelector('header');

    expect(header).toHaveClass(styles.header);
    expect(header).toHaveClass(styles.show);
    expect(header).not.toHaveClass(styles.hide);
  });
});
