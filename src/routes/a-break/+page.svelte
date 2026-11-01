<script lang="ts">
  import * as styles from './aBreak.css';

  let menuOpen = $state(false);
  let menuButton: HTMLButtonElement;

  function closeMenu() {
    menuOpen = false;
    menuButton?.focus();
  }
</script>

<svelte:window
  onkeydown={(event) => {
    if (event.key === 'Escape' && menuOpen) closeMenu();
  }}
/>

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
  <div class="element-emblem" role="img" aria-label="発光する輪に包まれた炎属性">
    <img class="element-emblem-ring" src="/images/kevat/element-ring/fire-ring.png" alt="" />
    <img class="element-emblem-icon" src="/images/kevat/elements/fire.png" alt="" />
  </div>
  <p class="battle-hint" hidden>
    <span>相手の属性を見極め一手を選べ！</span>
    <span>三すくみを覚えて勝利をつかめ！</span>
  </p>
  <img
    class="attribute-cycle"
    src="/images/kevat/cycle/cycle.png"
    alt="三すくみ：FIREはMISTに勝ち、MISTはSTONEに勝ち、STONEはFIREに勝つ"
  />
  {#if menuOpen}
    <button
      class="menu-backdrop"
      type="button"
      aria-label="メニューを閉じる"
      tabindex="-1"
      onclick={closeMenu}
    ></button>
  {/if}
  <div class="game-menu">
    <button
      bind:this={menuButton}
      class="menu-toggle"
      class:open={menuOpen}
      type="button"
      aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
      aria-expanded={menuOpen}
      aria-controls="game-navigation"
      onclick={() => (menuOpen = !menuOpen)}
    >
      <span></span><span></span><span></span>
    </button>
    <nav id="game-navigation" class="menu-panel" aria-label="ゲームメニュー" hidden={!menuOpen}>
      <a href="/">トップに戻る</a>
    </nav>
  </div>

  <div class="health player-health">
    <div class="health-label"><span>HP</span><span>200 / 200</span></div>
    <div class="health-bar" aria-hidden="true"></div>
  </div>
  <div class="health enemy-health">
    <div class="health-label"><span>HP</span><span>150 / 150</span></div>
    <meter min="0" max="150" value="150" aria-label="敵のHP">150 / 150</meter>
    <div class="health-bar" aria-hidden="true"></div>
    <div class="enemy-levels" aria-label="敵の属性レベル">
      <span class="enemy-level enemy-fire-level">
        <img src="/images/kevat/elements/fire.png" alt="FIRE" />
        <span class="enemy-level-badge">Lv.1</span>
      </span>
      <span class="enemy-level enemy-stone-level">
        <img src="/images/kevat/elements/stone.png" alt="STONE" />
        <span class="enemy-level-badge">Lv.1</span>
      </span>
      <span class="enemy-level enemy-mist-level">
        <img src="/images/kevat/elements/mist.png" alt="MIST" />
        <span class="enemy-level-badge">Lv.1</span>
      </span>
    </div>
  </div>

  <div class="attributes" role="group" aria-label="属性選択（画面プレビュー）">
    <div class="attribute-option fire-option">
      <button
        class="attribute fire"
        type="button"
        aria-label="FIRE 炎"
        aria-describedby="fire-level"
        aria-disabled="true"
      >
        <img src="/images/kevat/elements/fire.png" alt="" />
      </button>
      <span class="attribute-level" id="fire-level">Lv.1</span>
    </div>
    <div class="attribute-option stone-option">
      <button
        class="attribute stone"
        type="button"
        aria-label="STONE 石"
        aria-describedby="stone-level"
        aria-disabled="true"
      >
        <img src="/images/kevat/elements/stone.png" alt="" />
      </button>
      <span class="attribute-level" id="stone-level">Lv.1</span>
    </div>
    <div class="attribute-option mist-option">
      <button
        class="attribute mist"
        type="button"
        aria-label="MIST 霧"
        aria-describedby="mist-level"
        aria-disabled="true"
      >
        <img src="/images/kevat/elements/mist.png" alt="" />
      </button>
      <span class="attribute-level" id="mist-level">Lv.1</span>
    </div>
  </div>
</section>

<style>
  .attribute-cycle {
    position: absolute;
    top: max(16px, env(safe-area-inset-top));
    left: max(3.5%, env(safe-area-inset-left));
    width: min(11.7cqw, 18dvh);
    height: auto;
    opacity: 0.8;
    box-sizing: border-box;
    padding: clamp(6px, 1cqw, 14px);
    background: radial-gradient(
      ellipse at center,
      #080d10e6 0%,
      #080d10b3 40%,
      #080d1059 60%,
      transparent 75%
    );
  }
  .game-menu {
    position: absolute;
    top: max(16px, env(safe-area-inset-top));
    right: max(3.5%, env(safe-area-inset-right));
    z-index: 3;
  }
  .menu-toggle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 44px;
    height: 44px;
    margin-left: auto;
    border: 1px solid #ffffff40;
    border-radius: 6px;
    background: #080d10cc;
    color: #f5f5f2;
    cursor: pointer;
  }
  .menu-toggle span {
    width: 22px;
    height: 1px;
    background: currentColor;
  }
  .menu-toggle.open span:first-child {
    transform: translateY(7px) rotate(45deg);
  }
  .menu-toggle.open span:nth-child(2) {
    opacity: 0;
  }
  .menu-toggle.open span:last-child {
    transform: translateY(-7px) rotate(-45deg);
  }
  .menu-panel {
    position: absolute;
    top: 56px;
    right: 0;
    width: 180px;
    padding: 8px;
    border: 1px solid #ffffff40;
    border-radius: 6px;
    background: #080d10f5;
    box-shadow: 0 8px 24px #0008;
  }
  .menu-panel a {
    display: block;
    padding: 14px 16px;
    color: #f5f5f2;
    text-decoration: none;
    font-size: 14px;
  }
  .menu-panel a:hover,
  .menu-toggle:hover {
    background: #28313a;
  }
  .menu-panel a:focus-visible,
  .menu-toggle:focus-visible {
    outline: 2px solid #e6f5ff;
    outline-offset: 3px;
  }
  .menu-backdrop {
    position: absolute;
    inset: 0;
    z-index: 2;
    border: 0;
    padding: 0;
    background: rgba(0, 0, 0, 0.4);
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

  .element-emblem {
    position: absolute;
    top: 37%;
    left: 50%;
    z-index: 1;
    width: min(38cqw, 58dvh);
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
    filter: drop-shadow(0 0 8px #fff0d6cc) drop-shadow(0 0 28px #ff7b2080);
  }
  .element-emblem-ring,
  .element-emblem-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    object-fit: contain;
    pointer-events: none;
  }
  .element-emblem-ring {
    z-index: 1;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    opacity: 0.8;
  }
  .element-emblem-icon {
    z-index: 0;
    width: 72%;
    height: 72%;
    transform: translate(-50%, -50%);
    opacity: 0.9;
    filter: drop-shadow(0 0 14px #ffb061cc);
  }

  .battle-hint {
    position: absolute;
    isolation: isolate;
    top: 42%;
    left: 50%;
    z-index: 1;
    transform: translate(-50%, -50%);
    margin: 0;
    color: #f5f5f2;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(16px, 1.8cqw, 36px);
    font-weight: 600;
    line-height: 1.8;
    letter-spacing: 0.16em;
    text-align: center;
    text-shadow:
      0 2px 6px #000,
      0 0 18px #000;
    white-space: nowrap;
  }
  .battle-hint::before {
    content: '';
    position: absolute;
    inset: -55% -18%;
    z-index: -1;
    pointer-events: none;
    background:
      radial-gradient(ellipse at center, #05090de6 0%, #080d10b8 42%, transparent 76%),
      linear-gradient(90deg, transparent 0%, #02050780 18%, #02050780 82%, transparent 100%);
    filter: blur(10px);
  }
  .battle-hint span {
    display: block;
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
  .health-label {
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }
  .health-bar {
    height: clamp(4px, 0.6cqw, 10px);
    margin-top: 0.7cqw;
    border-radius: 999px;
    background: #a8e9ac;
    box-shadow:
      0 0 8px #a8e9ac99,
      inset 0 1px 2px #fff8;
  }
  .enemy-health .health-bar {
    background: #ff7775;
    box-shadow:
      0 0 8px #ff777599,
      inset 0 1px 2px #fff8;
  }
  .enemy-levels {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(2px, 0.4cqw, 6px);
    width: 60%;
    margin-top: clamp(12px, 1.4cqw, 22px);
    margin-right: 0;
    margin-left: auto;
    padding-inline: 4px;
    color: #f5f5f2;
    font-size: clamp(10px, 0.85cqw, 14px);
    letter-spacing: 0.03em;
    white-space: nowrap;
  }
  .enemy-levels > span {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
  }
  .enemy-fire-level {
    --enemy-level-color: #ff9a4a;
  }
  .enemy-stone-level {
    --enemy-level-color: #c08cff;
  }
  .enemy-mist-level {
    --enemy-level-color: #8ee3ff;
  }
  .enemy-levels img {
    width: clamp(44px, 4.84cqw, 72.6px);
    max-width: 100%;
    aspect-ratio: 1;
    object-fit: contain;
    filter: drop-shadow(0 1px 5px #000);
  }
  .enemy-level-badge {
    --badge-outline: polygon(16% 0, 84% 0, 100% 25%, 100% 75%, 84% 100%, 16% 100%, 0 75%, 0 25%);
    position: relative;
    isolation: isolate;
    min-width: clamp(46.2px, 4.18cqw, 61.6px);
    box-sizing: border-box;
    margin-top: -3px;
    padding: 6.6px 9.9px;
    color: #f5f5f2;
    font-size: clamp(14.3px, 1.155cqw, 17.6px);
    font-weight: 600;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    filter: drop-shadow(0 0 3px color-mix(in srgb, var(--enemy-level-color) 80%, transparent))
      drop-shadow(0 0 6px color-mix(in srgb, var(--enemy-level-color) 35%, transparent));
  }
  .enemy-level-badge::before,
  .enemy-level-badge::after {
    content: '';
    position: absolute;
    clip-path: var(--badge-outline);
    pointer-events: none;
  }
  .enemy-level-badge::before {
    inset: 0;
    z-index: -2;
    background: var(--enemy-level-color);
  }
  .enemy-level-badge::after {
    inset: 1.5px;
    z-index: -1;
    background: #070b0ef5;
    box-shadow: inset 0 0 7px color-mix(in srgb, var(--enemy-level-color) 30%, transparent);
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
    display: flex;
    gap: 3.6cqw;
  }
  .attribute-option {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .attribute-level {
    position: absolute;
    right: -8px;
    bottom: -8px;
    z-index: 1;
    display: grid;
    place-items: center;
    width: clamp(46.8px, 4.5cqw, 64.8px);
    aspect-ratio: 1;
    box-sizing: border-box;
    border: 2px solid var(--level-color);
    border-radius: 50%;
    background: #070b0ee6;
    color: #f5f5f2;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(14.4px, 1.26cqw, 19.8px);
    font-weight: 600;
    letter-spacing: 0.02em;
    line-height: 1;
    box-shadow:
      0 0 5px color-mix(in srgb, var(--level-color) 80%, transparent),
      0 0 14px color-mix(in srgb, var(--level-color) 55%, transparent),
      inset 0 0 9px color-mix(in srgb, var(--level-color) 30%, transparent);
    text-shadow:
      0 1px 3px #000,
      0 0 6px #fff6;
  }
  .fire-option {
    --level-color: #ffb061;
  }
  .stone-option {
    --level-color: #c08cff;
  }
  .mist-option {
    --level-color: #8ee3ff;
  }
  .attribute {
    position: relative;
    display: grid;
    place-items: center;
    width: min(15.6cqw, 27dvh);
    aspect-ratio: 1;
    padding: 0;
    overflow: hidden;
    border: 2px solid #e6f5ff;
    border-radius: 50%;
    background: radial-gradient(circle, #0a1119b3 30%, #03070bef 75%);
    box-shadow:
      0 0 12px #bce3ff80,
      inset 0 0 12px #bce3ff40;
  }
  .attribute img {
    width: 94%;
    height: 94%;
    object-fit: contain;
  }
  .fire {
    border-color: #fff0d6;
    box-shadow:
      0 0 5px #fff0d6,
      0 0 20px #ff7b20,
      inset 0 0 16px #ff7b2066;
  }
  .fire img {
    height: 100%;
  }
  .stone {
    border-color: #d4b5ff;
    box-shadow:
      0 0 5px #d4b5ffb3,
      0 0 18px #9966ee99,
      inset 0 0 14px #9966ee4d;
  }
  .mist {
    border-color: #b5eeff;
    box-shadow:
      0 0 5px #b5eeffb3,
      0 0 20px #65cfff99,
      inset 0 0 16px #65cfff4d;
  }
  .attribute:focus-visible {
    outline: 3px solid white;
    outline-offset: 7px;
  }

  @media (max-width: 600px) {
    .element-emblem {
      top: 40%;
      width: min(72cqw, 48dvh);
    }
    .battle-hint {
      width: 90%;
      font-size: clamp(14px, 4cqw, 18px);
      letter-spacing: 0.1em;
      white-space: normal;
    }
    .attribute-cycle {
      width: min(18cqw, 9.9dvh);
    }
    .health {
      width: 37%;
      font-size: 12px;
    }
    .health-bar {
      margin-top: 8px;
    }
    .enemy-health {
      width: 42%;
    }
    .enemy-levels img {
      width: clamp(35.2px, 11cqw, 48.4px);
    }
    .enemy-level-badge {
      min-width: 41.8px;
      padding: 5.5px 6.6px;
      font-size: 13.2px;
    }
    .enemy {
      top: 18%;
      left: 32%;
      width: 65%;
      height: 49%;
    }
    .attributes {
      top: min(70%, calc(100% - min(24cqw, 24dvh) - 64px - env(safe-area-inset-bottom)));
      gap: 4cqw;
    }
    .attribute {
      width: min(24cqw, 24dvh);
    }
  }
</style>
