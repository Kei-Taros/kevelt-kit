import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, test, expect } from 'vitest';
import DataItem from './DataItem.svelte';
import * as styles from './DataItem.css';

describe('DataItem', () => {
  test('labelが渡された場合、labelが表示される', () => {
    render(DataItem, { props: { label: '項目名', value: '内容' } });

    expect(screen.getByText('項目名')).toBeInTheDocument();
  });

  test('valueに文字列が渡された場合、valueが表示される', () => {
    render(DataItem, { props: { label: '項目名', value: '内容' } });

    expect(screen.getByText('内容')).toBeInTheDocument();
  });

  test('valueに数値が渡された場合、数値が表示される', () => {
    render(DataItem, { props: { label: '件数', value: 10 } });

    expect(screen.getByText('10')).toBeInTheDocument();
  });

  test('childrenが渡された場合、valueではなくchildrenが表示される', () => {
    const children = createRawSnippet(() => ({
      render: () => '<span>子要素</span>'
    }));

    render(DataItem, {
      props: {
        label: '項目名',
        value: '内容',
        children
      }
    });

    expect(screen.getByText('子要素')).toBeInTheDocument();
    expect(screen.queryByText('内容')).not.toBeInTheDocument();
  });

  test('classを渡した場合、既存classに追加される', () => {
    const { container } = render(DataItem, {
      props: { label: '項目名', value: '内容', class: 'extra-class' }
    });

    const root = container.firstElementChild;

    expect(root).toHaveClass(styles.dataItem);
    expect(root).toHaveClass('extra-class');
  });
});
