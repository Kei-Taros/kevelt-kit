import { render, screen } from '@testing-library/svelte';
import { describe, test, expect } from 'vitest';
import NewsImg from './NewsImg.svelte';
import * as styles from './NewsImg.css';

describe('NewsImg', () => {
  const props = { src: '2026/20260918-01', alt: 'ゲーム画面' };

  test('srcとaltが渡された場合、記事画像のPNGパスと代替テキストが設定される', () => {
    render(NewsImg, { props });

    const image = screen.getByRole('img', { name: 'ゲーム画面' });

    expect(image).toHaveAttribute('src', '/images/news/content/2026/20260918-01.png');
  });

  test('先頭にスラッシュがないsrcが渡された場合、区切りを補って画像パスが設定される', () => {
    render(NewsImg, {
      props: { src: '2026/20260918-01', alt: 'ゲーム画面' }
    });

    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      '/images/news/content/2026/20260918-01.png'
    );
  });

  test('srcが渡された場合、picture要素にWebPソースとPNGのフォールバック画像が設定される', () => {
    const { container } = render(NewsImg, { props });

    const picture = container.querySelector('picture');
    const source = picture?.querySelector('source[type="image/webp"]');

    expect(source).toHaveAttribute('srcset', '/images/news/content/2026/20260918-01.webp');
    expect(picture).toContainElement(screen.getByRole('img', { name: 'ゲーム画面' }));
  });

  test('loading未指定の場合、画像が遅延読み込みされる', () => {
    render(NewsImg, { props });

    expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');
  });

  test('classを渡した場合、画像の既存classに追加される', () => {
    render(NewsImg, { props: { ...props, class: 'extra-class' } });

    const image = screen.getByRole('img');

    expect(image).toHaveClass(styles.image);
    expect(image).toHaveClass('extra-class');
  });

  test('画像の属性を渡した場合、img要素に反映される', () => {
    render(NewsImg, {
      props: { ...props, width: 800, height: 450, loading: 'eager', title: 'プレイ中' }
    });

    const image = screen.getByRole('img');

    expect(image).toHaveAttribute('width', '800');
    expect(image).toHaveAttribute('height', '450');
    expect(image).toHaveAttribute('loading', 'eager');
    expect(image).toHaveAttribute('title', 'プレイ中');
  });

  test('srcとaltが更新された場合、WebPとPNGのパスと代替テキストも更新される', async () => {
    const { container, rerender } = render(NewsImg, { props });

    await rerender({ src: '2026/20260918-02', alt: '次のゲーム画面' });

    expect(screen.getByRole('img', { name: '次のゲーム画面' })).toHaveAttribute(
      'src',
      '/images/news/content/2026/20260918-02.png'
    );
    expect(container.querySelector('source')).toHaveAttribute(
      'srcset',
      '/images/news/content/2026/20260918-02.webp'
    );
  });
});
