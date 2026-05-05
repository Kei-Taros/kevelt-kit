import { render, screen, fireEvent } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, test, expect, vi } from 'vitest';
import Button from './Button.svelte';
import * as styles from './Button.css';

describe('Button', () => {
  test('labelが渡された場合、ボタンに渡されたlabelが表示される', () => {
    render(Button, { props: { label: '保存' } });
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
  });

  test('childrenが渡された場合、labelではなくchildrenが表示される', () => {
    const children = createRawSnippet(() => ({
      render: () => '<span>子要素</span>'
    }));

    render(Button, { props: { label: '保存', children } });

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('button', { name: '子要素' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '保存' })).not.toBeInTheDocument();
  });

  test.each([
    {
      label: 'variant未指定の場合、primaryのクラスが適用される',
      props: { label: '保存' },
      expectClass: styles.primary,
      expectNotClass: styles.secondary
    },
    {
      label: 'variant=primaryの場合、primaryのクラスが適用される',
      props: { label: '保存', variant: 'primary' as const },
      expectClass: styles.primary,
      expectNotClass: styles.secondary
    },
    {
      label: 'variant=secondaryの場合、secondaryのクラスが適用される',
      props: { label: 'キャンセル', variant: 'secondary' as const },
      expectClass: styles.secondary,
      expectNotClass: styles.primary
    }
  ])('$label', ({ props, expectClass, expectNotClass }) => {
    render(Button, { props });
    const btn = screen.getByRole('button', { name: props.label as string });

    expect(btn).toHaveClass(expectClass);
    expect(btn).not.toHaveClass(expectNotClass);
  });

  test('typeをsubmitにした場合、buttonのtype属性がsubmitになる', () => {
    render(Button, { props: { label: '送信', type: 'submit' } });
    expect(screen.getByRole('button', { name: '送信' })).toHaveAttribute('type', 'submit');
  });

  test('onclickを渡した場合、クリックで呼ばれる', async () => {
    const onClick = vi.fn();
    render(Button, { props: { label: '保存', onclick: onClick } });

    await fireEvent.click(screen.getByRole('button', { name: '保存' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('classを渡した場合、既存classに追加される', () => {
    render(Button, { props: { label: '保存', class: 'extra-class' } });
    expect(screen.getByRole('button', { name: '保存' })).toHaveClass('extra-class');
  });

  test('disabledを渡した場合、ボタンがdisabledになる', () => {
    render(Button, { props: { label: '保存', disabled: true } });
    expect(screen.getByRole('button', { name: '保存' })).toBeDisabled();
  });

  test('hrefが渡された場合、aタグとして表示される', () => {
    render(Button, { props: { label: '一覧へ戻る', href: '/news' } });

    const link = screen.getByRole('link', { name: '一覧へ戻る' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/news');
    expect(screen.queryByRole('button', { name: '一覧へ戻る' })).not.toBeInTheDocument();
  });

  test('hrefが渡された場合、button共通クラスとvariantクラスが適用される', () => {
    render(Button, {
      props: {
        label: '一覧へ戻る',
        href: '/news',
        variant: 'secondary'
      }
    });

    const link = screen.getByRole('link', { name: '一覧へ戻る' });

    expect(link).toHaveClass(styles.button);
    expect(link).toHaveClass(styles.secondary);
    expect(link).not.toHaveClass(styles.primary);
  });
});
