import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, test, expect, vi } from 'vitest';
import Logo from './Logo.svelte';
import * as styles from './Logo.css';

describe('Logo', () => {
  test('labelが渡された場合、リンク内に渡されたlabelが表示される', () => {
    render(Logo, { props: { label: 'test' } });

    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('test');
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  test('label未指定の場合、デフォルトのlabelが表示される', () => {
    render(Logo);

    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('KeveltKit');
    expect(screen.getByText('KeveltKit')).toBeInTheDocument();
  });

  test('srcとaltが渡された場合、画像に反映される', () => {
    render(Logo, {
      props: {
        src: '/images/test-logo.svg',
        alt: 'test logo'
      }
    });

    const image = screen.getByAltText('test logo');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
    expect(image.getAttribute('src')).toContain('/images/test-logo.svg');
  });

  test('href未指定の場合、デフォルトで/が設定される', () => {
    render(Logo);

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', '/');
  });

  test('hrefを渡した場合、aタグのhref属性に反映される', () => {
    render(Logo, {
      props: {
        href: '/about',
        label: 'About'
      }
    });

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', '/about');
    expect(link).toHaveTextContent('About');
  });

  test.each([
    {
      label: 'size未指定の場合、mediumクラスが画像に適用される',
      props: { label: 'KeveltKit' },
      expectClass: styles.medium,
      expectNotClasses: [styles.small, styles.large]
    },
    {
      label: 'size=sの場合、smallクラスが画像に適用される',
      props: { label: 'KeveltKit', size: 's' as const },
      expectClass: styles.small,
      expectNotClasses: [styles.medium, styles.large]
    },
    {
      label: 'size=mの場合、mediumクラスが画像に適用される',
      props: { label: 'KeveltKit', size: 'm' as const },
      expectClass: styles.medium,
      expectNotClasses: [styles.small, styles.large]
    },
    {
      label: 'size=lの場合、largeクラスが画像に適用される',
      props: { label: 'KeveltKit', size: 'l' as const },
      expectClass: styles.large,
      expectNotClasses: [styles.small, styles.medium]
    }
  ])('$label', ({ props, expectClass, expectNotClasses }) => {
    render(Logo, { props });

    const image = screen.getByAltText('logo');

    expect(image).toHaveClass(styles.image);
    expect(image).toHaveClass(expectClass);

    for (const className of expectNotClasses) {
      expect(image).not.toHaveClass(className);
    }
  });

  test('classを渡した場合、aタグの既存classに追加される', () => {
    render(Logo, {
      props: {
        label: 'KeveltKit',
        class: 'extra-class'
      }
    });

    const link = screen.getByRole('link');

    expect(link).toHaveClass(styles.logo);
    expect(link).toHaveClass('extra-class');
  });

  test('onclickを渡した場合、クリックで呼ばれる', async () => {
    const onClick = vi.fn();

    render(Logo, {
      props: {
        label: 'KeveltKit',
        onclick: onClick
      }
    });

    const link = screen.getByRole('link');

    await fireEvent.click(link);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
