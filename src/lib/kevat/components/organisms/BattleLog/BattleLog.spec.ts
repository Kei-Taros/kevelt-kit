import { render, screen, within } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import BattleLog from './BattleLog.svelte';

describe('BattleLog', () => {
  test('logsが空の場合、対戦ログの外枠だけが表示される', () => {
    render(BattleLog, { props: { logs: [] } });

    const log = screen.getByRole('complementary', { name: 'Battle Log' });
    expect(log).toBeInTheDocument();
    expect(within(log).getByRole('list')).toBeInTheDocument();
    expect(within(log).queryByRole('listitem')).not.toBeInTheDocument();
  });

  test('logsが渡された場合、ターンの順番に勝敗と属性が表示される', () => {
    const logs = [
      { turn: '02', result: 'win', player: 'fire', enemy: 'mist' },
      { turn: '01', result: 'lose', player: 'stone', enemy: 'fire' }
    ] as const;
    render(BattleLog, { props: { logs } });

    const rows = within(screen.getByRole('complementary', { name: 'Battle Log' })).getAllByRole(
      'listitem'
    );
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('02');
    expect(rows[0]).toHaveTextContent('WIN');
    expect(within(rows[0]).getByRole('img', { name: 'FIRE vs MIST' })).toBeInTheDocument();
    expect(rows[1]).toHaveTextContent('01');
    expect(rows[1]).toHaveTextContent('LOSE');
    expect(within(rows[1]).getByRole('img', { name: 'STONE vs FIRE' })).toBeInTheDocument();
  });

  test('空のlogsに履歴が追加された場合、新しいターンが表示される', async () => {
    const { rerender } = render(BattleLog, { props: { logs: [] } });
    const log = screen.getByRole('complementary', { name: 'Battle Log' });

    expect(within(log).queryByRole('listitem')).not.toBeInTheDocument();

    await rerender({
      logs: [{ turn: '01', result: 'draw', player: 'mist', enemy: 'mist' }]
    });

    const row = within(log).getByRole('listitem');
    expect(row).toHaveTextContent('01');
    expect(row).toHaveTextContent('DRAW');
    expect(within(row).getByRole('img', { name: 'MIST vs MIST' })).toBeInTheDocument();
  });
});
