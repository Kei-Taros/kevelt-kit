import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import BattleLogRow from './BattleLogRow.svelte';
import * as styles from './BattleLogRow.css';

describe('BattleLogRow', () => {
  test.each([
    { result: 'win', label: 'WIN' },
    { result: 'draw', label: 'DRAW' },
    { result: 'lose', label: 'LOSE' }
  ] as const)(
    '対戦結果が$resultの場合、ターンと属性アイコンと$labelが表示される',
    ({ result, label }) => {
      const { container } = render(BattleLogRow, {
        props: { turn: '04', result, player: 'fire', enemy: 'stone' }
      });

      expect(screen.getByText('TURN')).toBeInTheDocument();
      expect(screen.getByText('04')).toBeInTheDocument();
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'FIRE vs STONE' })).toBeInTheDocument();
      expect(container.firstElementChild).toHaveClass(styles.entranceVariants[result]);
      expect(
        Array.from(container.querySelectorAll('source[type="image/webp"]')).map((source) =>
          source.getAttribute('srcset')
        )
      ).toEqual(['/images/ketria/elements/fire.webp', '/images/ketria/elements/stone.webp']);
    }
  );

  test.each([
    { player: 'stone', enemy: 'mist', name: 'STONE vs MIST' },
    { player: 'mist', enemy: 'fire', name: 'MIST vs FIRE' }
  ] as const)(
    'プレイヤーが$player、敵が$enemyの場合、それぞれの属性アイコンが左右に表示される',
    ({ player, enemy, name }) => {
      const { container } = render(BattleLogRow, {
        props: { turn: '01', result: 'win', player, enemy }
      });

      expect(screen.getByRole('img', { name })).toBeInTheDocument();
      expect(
        Array.from(container.querySelectorAll('source[type="image/webp"]')).map((source) =>
          source.getAttribute('srcset')
        )
      ).toEqual([
        `/images/ketria/elements/${player}.webp`,
        `/images/ketria/elements/${enemy}.webp`
      ]);
    }
  );
});
