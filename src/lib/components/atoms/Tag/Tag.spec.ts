import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, test, expect } from 'vitest';
import Tag from './Tag.svelte';
import * as styles from './Tag.css';

describe('Tag', () => {
  test('labelが渡された場合、spanに渡されたlabelが表示される', () => {
    render(Tag, { props: { label: 'TypeScript' } });

    const tag = screen.getByText('TypeScript');

    expect(tag).toBeInTheDocument();
    expect(tag.tagName).toBe('SPAN');
    expect(tag).toHaveClass(styles.tag);
  });

  test('childrenが渡された場合、labelではなくchildrenが表示される', () => {
    const children = createRawSnippet(() => ({
      render: () => '<span>GraphQL</span>'
    }));

    render(Tag, {
      props: {
        label: 'TypeScript',
        children
      }
    });

    expect(screen.getByText('GraphQL')).toBeInTheDocument();
    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
  });

  test.each([
    {
      label: 'variant未指定の場合、primaryのクラスが適用される',
      props: { label: 'TypeScript' },
      expectClass: styles.primary,
      expectNotClass: styles.secondary
    },
    {
      label: 'variant=primaryの場合、primaryのクラスが適用される',
      props: { label: 'TypeScript', variant: 'primary' as const },
      expectClass: styles.primary,
      expectNotClass: styles.secondary
    },
    {
      label: 'variant=secondaryの場合、secondaryのクラスが適用される',
      props: { label: 'GraphQL', variant: 'secondary' as const },
      expectClass: styles.secondary,
      expectNotClass: styles.primary
    }
  ])('$label', ({ props, expectClass, expectNotClass }) => {
    render(Tag, { props });

    const tag = screen.getByText(props.label as string);

    expect(tag).toHaveClass(styles.tag);
    expect(tag).toHaveClass(expectClass);
    expect(tag).not.toHaveClass(expectNotClass);
  });

  test('classを渡した場合、既存classに追加される', () => {
    render(Tag, {
      props: {
        label: 'TypeScript',
        class: 'extra-class'
      }
    });

    expect(screen.getByText('TypeScript')).toHaveClass(styles.tag);
    expect(screen.getByText('TypeScript')).toHaveClass('extra-class');
  });
});
