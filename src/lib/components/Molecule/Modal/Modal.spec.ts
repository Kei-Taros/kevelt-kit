import { render, screen, fireEvent } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, test, expect, vi } from 'vitest';
import Modal from './Modal.svelte';
import * as styles from './Modal.css';

describe('Modal', () => {
  const createChildren = () =>
    createRawSnippet(() => ({
      render: () => `
        <div>
          <h2>モーダルタイトル</h2>
          <p>ここに内容が入ります。</p>
        </div>
      `
    }));

  test('isOpen=trueの場合、モーダルが表示される', () => {
    render(Modal, {
      props: {
        isOpen: true,
        closeModal: vi.fn()
      }
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('button', { name: '閉じる' })).toBeInTheDocument();
  });

  test('isOpen=falseの場合、モーダルが表示されない', () => {
    render(Modal, {
      props: {
        isOpen: false,
        closeModal: vi.fn()
      }
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '閉じる' })).not.toBeInTheDocument();
  });

  test('childrenが渡された場合、childrenの内容が表示される', () => {
    render(Modal, {
      props: {
        isOpen: true,
        closeModal: vi.fn(),
        children: createChildren()
      }
    });

    expect(screen.getByRole('heading', { level: 2, name: 'モーダルタイトル' })).toBeInTheDocument();
    expect(screen.getByText('ここに内容が入ります。')).toBeInTheDocument();
  });

  test('閉じるボタンをクリックした場合、closeModalが呼ばれる', async () => {
    const closeModal = vi.fn();

    render(Modal, {
      props: {
        isOpen: true,
        closeModal
      }
    });

    await fireEvent.click(screen.getByRole('button', { name: '閉じる' }));

    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  test('背景をクリックした場合、closeModalが呼ばれる', async () => {
    const closeModal = vi.fn();
    const { container } = render(Modal, {
      props: {
        isOpen: true,
        closeModal
      }
    });

    const overlay = container.querySelector(`.${styles.overlay}`);

    expect(overlay).toBeInTheDocument();

    await fireEvent.click(overlay as HTMLElement);

    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  test('Escapeキーを押した場合、closeModalが呼ばれる', async () => {
    const closeModal = vi.fn();

    render(Modal, {
      props: {
        isOpen: true,
        closeModal
      }
    });

    await fireEvent.keyDown(window, { key: 'Escape' });

    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  test('モーダル内部をクリックした場合、closeModalを呼ばない', async () => {
    const closeModal = vi.fn();

    render(Modal, {
      props: {
        isOpen: true,
        closeModal,
        children: createChildren()
      }
    });

    await fireEvent.click(screen.getByText('ここに内容が入ります。'));

    expect(closeModal).not.toHaveBeenCalled();
  });
});
