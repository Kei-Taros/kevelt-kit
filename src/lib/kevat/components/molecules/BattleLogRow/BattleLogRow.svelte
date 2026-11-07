<script lang="ts">
  import { ElementIcon } from '$lib/kevat/components/atoms';
  import type { ElementType } from '$lib/kevat/types/element.types';
  import * as styles from './BattleLogRow.css';

  type Result = 'win' | 'draw' | 'lose';

  interface Props {
    turn: string;
    result: Result;
    player: ElementType;
    enemy: ElementType;
  }

  let { turn, result, player, enemy }: Props = $props();
  const resultLabels: Record<Result, string> = { win: 'WIN', draw: 'DRAW', lose: 'LOSE' };
</script>

<li class={`${styles.row} ${styles.outcomeVariants[result]}`}>
  <div class={styles.turn}>
    <span class={styles.turnLabel}>TURN</span>
    <strong class={styles.turnNumber}>{turn}</strong>
  </div>
  <span class={styles.separator} aria-hidden="true"></span>
  <div
    class={styles.duel}
    role="img"
    aria-label={`${player.toUpperCase()} vs ${enemy.toUpperCase()}`}
  >
    <span class={styles.icon}><ElementIcon element={player} /></span>
    <span class={styles.vs}>VS</span>
    <span class={styles.icon}><ElementIcon element={enemy} /></span>
  </div>
  <span class={styles.separator} aria-hidden="true"></span>
  <div class={styles.resultArea}>
    <strong class={styles.result}>{resultLabels[result]}</strong>
  </div>
</li>
