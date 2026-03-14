import { render, screen } from '@testing-library/svelte';
import { describe, test, expect } from 'vitest';
import Footer from './Footer.svelte';
import * as styles from './Footer.css';

describe('Footer', () => {
  test('ロゴとナビゲーションリンク、コピーライトが表示される', () => {
    const { container } = render(Footer);

    const footer = container.querySelector('footer');

    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass(styles.footer);

    expect(screen.getByRole('link', { name: 'About Me' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Concept' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Works' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'News' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'A Break' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'プライバシーポリシー' })).toBeInTheDocument();

    expect(screen.getByText('KeveltKit')).toBeInTheDocument();
    expect(screen.getByText('© 2026 KeveltKit. All rights reserved.')).toBeInTheDocument();
  });

  test('各リンクに正しいhref属性が設定される', () => {
    render(Footer);

    expect(screen.getByRole('link', { name: 'About Me' })).toHaveAttribute('href', '/about-me');
    expect(screen.getByRole('link', { name: 'Concept' })).toHaveAttribute('href', '/concept');
    expect(screen.getByRole('link', { name: 'Works' })).toHaveAttribute('href', '/works');
    expect(screen.getByRole('link', { name: 'News' })).toHaveAttribute('href', '/news');
    expect(screen.getByRole('link', { name: 'A Break' })).toHaveAttribute('href', '/a-break');
    expect(screen.getByRole('link', { name: 'プライバシーポリシー' })).toHaveAttribute(
      'href',
      '/privacy'
    );
  });
});
