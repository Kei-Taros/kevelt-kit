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
      render: () => '子要素'
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
});
