import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import StageSelect from './StageSelect.svelte';
import * as menuStyles from '../../molecules/MenuOption/MenuOption.css';
import type { StageId } from '$lib/ketria/types/stage.types';

const stages: readonly StageId[] = ['01', '02', '03'];

describe('StageSelect', () => {
  test('ステージ一覧を渡した場合、渡された順に表示し選択中のステージを強調する', () => {
    render(StageSelect, { props: { stages, selectedStage: '02' } });

    expect(screen.getByRole('heading', { name: 'STAGE SELECT' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Stage selection' })).toBeInTheDocument();
    expect(screen.getAllByRole('button').map((button) => button.textContent?.trim())).toEqual([
      'STAGE 01',
      'STAGE 02',
      'STAGE 03',
      'BACK'
    ]);
    expect(screen.getByRole('button', { name: 'STAGE 02' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: 'STAGE 02' })).toHaveClass(menuStyles.active);
    expect(screen.getByRole('button', { name: 'STAGE 01' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  test('追加ステージを渡した場合、STAGE 04も表示する', () => {
    render(StageSelect, { props: { stages: [...stages, '04'], selectedStage: '04' } });

    expect(screen.getByRole('button', { name: 'STAGE 04' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  test('ステージにホバーやフォーカスした場合は強調のみ通知し、クリックした場合だけ選択を通知する', async () => {
    const onselect = vi.fn();
    const onhighlight = vi.fn();
    render(StageSelect, { props: { stages, selectedStage: '01', onselect, onhighlight } });

    await fireEvent.click(screen.getByRole('button', { name: 'STAGE 02' }));
    await fireEvent.pointerEnter(screen.getByRole('button', { name: 'STAGE 03' }));
    await fireEvent.focus(screen.getByRole('button', { name: 'STAGE 01' }));

    expect(onselect.mock.calls).toEqual([['02']]);
    expect(onhighlight.mock.calls).toEqual([['03'], ['01']]);
  });

  test('BACKを押した場合、戻る操作を通知する', async () => {
    const onback = vi.fn();
    render(StageSelect, { props: { stages, selectedStage: '01', onback } });

    await fireEvent.click(screen.getByRole('button', { name: 'BACK' }));

    expect(onback).toHaveBeenCalledOnce();
  });
  test('02と03を無効にした場合、01だけ選択可能となり02と03を操作しても選択や強調表示の処理は呼ばれない', async () => {
    const onselect = vi.fn();
    const onhighlight = vi.fn();
    render(StageSelect, {
      props: { stages, selectedStage: '01', disabledStages: ['02', '03'], onselect, onhighlight }
    });
    for (const stage of ['02', '03']) {
      const button = screen.getByRole('button', { name: `STAGE ${stage}` });
      expect(button).toBeDisabled();
      await fireEvent.pointerEnter(button);
      await fireEvent.focus(button);
      await fireEvent.click(button);
    }
    expect(onselect).not.toHaveBeenCalled();
    expect(onhighlight).not.toHaveBeenCalled();
    await fireEvent.click(screen.getByRole('button', { name: 'STAGE 01' }));
    expect(onselect).toHaveBeenCalledWith('01');
  });
});
