import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, test, expect } from 'vitest';
import Heading from './Heading.svelte';
import * as styles from './Heading.css';

describe('Heading', () => {
  test('labelが渡された場合、見出しに渡されたlabelが表示される', () => {
    render(Heading, { props: { label: 'Contents' } });
    expect(screen.getByRole('heading', { level: 1, name: 'Contents' })).toBeInTheDocument();
  });

  test('childrenが渡された場合、labelではなくchildrenが表示さる', () => {
    const children = createRawSnippet(() => ({
      render: () => '<span>子要素</span>'
    }));

    render(Heading, { props: { label: 'Contents', children, as: 'h2' } });

    expect(screen.getAllByRole('heading')).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 2, name: '子要素' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: 'Contents' })).not.toBeInTheDocument();
  });

  test.each([
    {
      label: 'as未指定の場合、h1タグとh1のクラスが適用される',
      props: { label: 'Contents' },
      level: 1,
      expectClass: styles.h1,
      expectNotClasses: [styles.h2, styles.h3]
    },
    {
      label: 'as=h2の場合、h2タグとh2のクラスが適用される',
      props: { label: 'Section', as: 'h2' as const },
      level: 2,
      expectClass: styles.h2,
      expectNotClasses: [styles.h1, styles.h3]
    },
    {
      label: 'as=h3の場合、h3タグとh3のクラスが適用される',
      props: { label: 'Sub Title', as: 'h3' as const },
      level: 3,
      expectClass: styles.h3,
      expectNotClasses: [styles.h1, styles.h2]
    },
    {
      label: 'as=h4の場合、h4タグとh4のクラスが適用される',
      props: { label: 'Small Title', as: 'h4' as const },
      level: 4,
      expectClass: styles.h4,
      expectNotClasses: [styles.h1, styles.h2, styles.h3]
    }
  ])('$label', ({ props, level, expectClass, expectNotClasses }) => {
    render(Heading, { props });

    const heading = screen.getByRole('heading', {
      level,
      name: props.label
    });

    expect(heading).toHaveClass(expectClass);

    expectNotClasses.forEach((className) => {
      expect(heading).not.toHaveClass(className);
    });
  });

  test('classを渡した場合、既存classに追加される', () => {
    render(Heading, { props: { label: 'Contents', class: 'extra-class' } });
    expect(screen.getByRole('heading', { level: 1, name: 'Contents' })).toHaveClass('extra-class');
  });

  test('idを渡した場合、見出しにid属性が付与される', () => {
    render(Heading, { props: { label: 'Contents', id: 'contents-heading' } });
    expect(screen.getByRole('heading', { level: 1, name: 'Contents' })).toHaveAttribute(
      'id',
      'contents-heading'
    );
  });

  test('as=h2かつvariant=newsの場合、h2タグとh2Newsのクラスが適用される', () => {
    render(Heading, {
      props: {
        label: 'Latest',
        as: 'h2',
        variant: 'news'
      }
    });

    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Latest'
    });

    expect(heading).toHaveClass(styles.h2News);
    expect(heading).not.toHaveClass(styles.h2);
    expect(heading).not.toHaveClass(styles.h1);
    expect(heading).not.toHaveClass(styles.h3);
  });

  test('as=h2かつvariant=newsSlugの場合、h2タグにタイトルと日付が表示されてh2NewsSlugのクラスが適用される', () => {
    render(Heading, {
      props: {
        label: 'ニュースタイトル',
        date: '2026-04-11',
        as: 'h2',
        variant: 'newsSlug'
      }
    });

    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'ニュースタイトル 2026-04-11'
    });

    expect(heading).toHaveClass(styles.h2NewsSlug);
    expect(heading).not.toHaveClass(styles.h2);
    expect(heading).not.toHaveClass(styles.h2News);
    expect(heading).not.toHaveClass(styles.h1);
    expect(heading).not.toHaveClass(styles.h3);

    expect(screen.getByText('ニュースタイトル')).toBeInTheDocument();
    expect(screen.getByText('2026-04-11')).toHaveClass(styles.date);
  });

  test('as=h3かつvariant=conceptの場合、番号とlabelが表示される', () => {
    render(Heading, {
      props: {
        label: 'Architecture',
        number: '01',
        as: 'h3',
        variant: 'concept'
      }
    });

    const heading = screen.getByRole('heading', {
      level: 3,
      name: '01 Architecture'
    });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass(styles.h3);

    expect(screen.getByText('01')).toHaveClass(styles.number);
    expect(screen.getByText('Architecture')).toBeInTheDocument();
  });
});
