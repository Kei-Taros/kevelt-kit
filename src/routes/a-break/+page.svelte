<script lang="ts">
  import { BattleMessage, ElementCycle } from '$lib/kevat/components/atoms';
  import { EnemyLevels, EnemyMove, GameMenu, HealthStatus } from '$lib/kevat/components/molecules';
  import { ElementSelector } from '$lib/kevat/components/organisms';
  import * as styles from './aBreak.css';
</script>

<svelte:head>
  <title>A Break | KeveltKit</title>
</svelte:head>

<section class="arena" aria-label="KEVAT 対戦画面">
  <img
    class="background"
    src="/images/kevat/backgrounds/background-01.png"
    alt=""
    fetchpriority="high"
  />
  <img class="enemy" src="/images/kevat/enemy/enemy-01.png" alt="霧をまとった敵" />
  <div class={styles.vignette} aria-hidden="true"></div>
  <div class="enemy-move" hidden>
    <EnemyMove element="stone" />
  </div>
  <div class="battle-hint">
    <BattleMessage lines={['相手の属性を見極め一手を選べ！', '三すくみを覚えて勝利をつかめ！']} />
  </div>
  <div class="attribute-cycle"><ElementCycle /></div>
  <GameMenu />

  <div class="health player-health">
    <HealthStatus current={200} max={200} />
  </div>
  <div class="health enemy-health">
    <HealthStatus current={150} max={150} />
    <meter min="0" max="150" value="150" aria-label="敵のHP">150 / 150</meter>
    <EnemyLevels levels={{ fire: 1, stone: 2, mist: 3 }} />
  </div>

  <div class="attributes">
    <ElementSelector levels={{ fire: 1, stone: 2, mist: 3 }} />
  </div>
</section>

<style>
  .attribute-cycle {
    position: absolute;
    top: max(16px, env(safe-area-inset-top));
    left: max(3.5%, env(safe-area-inset-left));
    width: min(11.7cqw, 18dvh);
  }
  .arena {
    position: relative;
    isolation: isolate;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    background: #080d10;
    color: #f5f5f2;
    container-type: inline-size;
  }

  .background {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .enemy {
    position: absolute;
    top: 10%;
    left: 55%;
    width: 38%;
    height: 58%;
    object-fit: contain;
    opacity: 0.82;
    mask-image: linear-gradient(to bottom, #000 65%, transparent 100%);
  }

  .enemy-move {
    position: absolute;
    top: 37%;
    left: 50%;
    z-index: 1;
    width: min(38cqw, 58dvh);
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
  }

  .battle-hint {
    position: absolute;
    top: 42%;
    left: 50%;
    z-index: 1;
    width: min(90cqw, 960px);
    transform: translate(-50%, -50%);
  }

  .health {
    position: absolute;
    z-index: 2;
    top: max(80px, calc(env(safe-area-inset-top) + 64px), 10%);
    width: 22%;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(12px, 1.3cqw, 24px);
    letter-spacing: 0.16em;
    text-shadow: 0 2px 6px #000;
  }

  .player-health {
    left: 400px;
    top: auto;
    bottom: max(350px, env(safe-area-inset-bottom));
  }
  .enemy-health {
    right: 3.5%;
  }
  meter {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  .attributes {
    position: absolute;
    top: min(68%, calc(100% - min(15.6cqw, 27dvh) - 64px - env(safe-area-inset-bottom)));
    left: 50%;
    transform: translateX(-50%);
  }
</style>
