<script lang="ts">
  import {
    BattleBackground,
    BattleMessage,
    ElementCycle,
    EnemyImage
  } from '$lib/kevat/components/atoms';
  import { EnemyLevels, EnemyMove, GameMenu, HealthStatus } from '$lib/kevat/components/molecules';
  import { ElementSelector } from '$lib/kevat/components/organisms';
  import * as styles from './aBreak.css';
</script>

<svelte:head>
  <title>A Break | KeveltKit</title>
</svelte:head>

<section class={styles.arena}>
  <BattleBackground background="01" />
  <div class={styles.enemy}><EnemyImage enemy="01" /></div>
  <div class={styles.vignette} aria-hidden="true"></div>
  <div class={styles.enemyMove} hidden>
    <EnemyMove element="stone" />
  </div>
  <div class={styles.battleHint}>
    <BattleMessage lines={['相手の属性を見極め一手を選べ！', '三すくみを覚えて勝利をつかめ！']} />
  </div>
  <div class={styles.attributeCycle}><ElementCycle /></div>
  <GameMenu />

  <div class={`${styles.health} ${styles.playerHealth}`}>
    <HealthStatus current={200} max={200} />
  </div>
  <div class={`${styles.health} ${styles.enemyHealth}`}>
    <HealthStatus current={150} max={150} />
    <EnemyLevels levels={{ fire: 1, stone: 2, mist: 3 }} />
  </div>

  <div class={styles.attributes}>
    <ElementSelector levels={{ fire: 1, stone: 2, mist: 3 }} />
  </div>
</section>
