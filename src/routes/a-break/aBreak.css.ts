import { createVar, globalStyle, keyframes, style } from '@vanilla-extract/css';
import { mobileBattleLayout } from '$lib/ketria/styles/spBattleLayout';
import { backgroundFadeIn } from '$lib/ketria/components/atoms/BattleMessage/BattleMessage.css';
import { mobileButtonWidth } from '$lib/ketria/components/molecules/ElementOption/ElementOption.css';
import {
  mobileLogHeight,
  mobileLogTop
} from '$lib/ketria/components/organisms/BattleLog/BattleLog.css';

import { ULTIMATE_TRANSITION } from '$lib/ketria/constants/stages';
import { media } from '$lib/styles/breakpoints';

export const enemyWidth = 'var(--battle-enemy-width, 60dvh)';

const mobileLandscape = `${media.sp} and (orientation: landscape)`;

export const arena = style({
  position: 'relative',
  isolation: 'isolate',
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
  background: '#000',
  color: '#f5f5f2',
  containerType: 'inline-size',
  '@media': {
    [media.sp]: {
      vars: {
        '--battle-enemy-width': mobileBattleLayout.enemy.width,
        '--battle-hp-scale': mobileBattleLayout.hp.scale,
        '--sp-controls-bottom': `calc(${mobileBattleLayout.buttons.bottom}px + env(safe-area-inset-bottom))`,
        '--sp-side-inset': `max(${mobileBattleLayout.arena.sideInset}px, env(safe-area-inset-left), env(safe-area-inset-right))`
      }
    },
    [mobileLandscape]: {
      vars: {
        '--battle-enemy-width': mobileBattleLayout.enemy.landscapeWidth,
        '--battle-landscape-button-width': mobileBattleLayout.buttons.landscapeWidth,
        '--battle-landscape-level-badge-width': mobileBattleLayout.playerLevel.landscapeWidth
      }
    }
  },
  '@supports': {
    '(height: 100dvh)': { height: '100dvh' }
  }
});

globalStyle(`html:has(${arena}), body:has(${arena})`, {
  '@media': {
    [media.sp]: {
      overflowY: 'hidden',
      overscrollBehaviorY: 'none'
    }
  }
});

export const attributeCycle = style({
  position: 'absolute',
  top: 'max(16px, env(safe-area-inset-top))',
  left: 'max(3.5%, env(safe-area-inset-left))',
  width: 'min(11.7cqw, 18dvh)',
  '@media': {
    [media.sp]: { display: 'none' }
  }
});

export const enemy = style({
  position: 'absolute',
  top: '1%',
  left: '50%',
  width: enemyWidth,
  height: '52.5%',
  transform: 'translateX(-50%)',
  animation: backgroundFadeIn,
  '@media': {
    [media.sp]: {
      top: `max(${mobileBattleLayout.enemy.minTop}, calc(${mobileLogTop} + ${mobileLogHeight} + ${mobileBattleLayout.enemy.logGap}px))`,
      left: mobileBattleLayout.enemy.left,
      height: mobileBattleLayout.enemy.height
    },
    [mobileLandscape]: {
      left: mobileBattleLayout.enemy.landscapeLeft,
      top: `calc(${mobileLogTop} + ${mobileLogHeight} + (${mobileBattleLayout.enemy.landscapeLogGap}px))`,
      height: mobileBattleLayout.enemy.landscapeHeight
    },
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
});

export const vignette = style({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  background: 'radial-gradient(ellipse at 50% 45%, transparent 30%, #0008 100%)'
});

export const enemyMove = style({
  position: 'absolute',
  top: '37%',
  left: '50%',
  zIndex: 1,
  width: 'min(38cqw, 58dvh)',
  aspectRatio: '1',
  transform: 'translate(-50%, -50%)',
  '@media': {
    [media.sp]: {
      top: mobileBattleLayout.movePreview.top,
      left: mobileBattleLayout.movePreview.left,
      width: mobileBattleLayout.movePreview.width
    },
    [mobileLandscape]: {
      left: mobileBattleLayout.movePreview.landscapeLeft,
      top: mobileBattleLayout.movePreview.landscapeTop
    }
  }
});

export const movePreview = style({
  position: 'absolute',
  top: '37%',
  left: '50%',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  transform: 'translate(-50%, -50%)',
  '@media': {
    [media.sp]: {
      top: mobileBattleLayout.movePreview.top,
      left: mobileBattleLayout.movePreview.left
    },
    [mobileLandscape]: {
      left: mobileBattleLayout.movePreview.landscapeLeft,
      top: mobileBattleLayout.movePreview.landscapeTop
    }
  }
});

export const battleHint = style({
  position: 'absolute',
  top: '48%',
  left: '50%',
  zIndex: 1,
  width: 'min(86cqw, 1200px)',
  transform: 'translate(-50%, -50%)',
  '@media': {
    [media.sp]: {
      top: mobileBattleLayout.message.top,
      width: 'calc(100% - 2 * var(--sp-side-inset))'
    },
    [mobileLandscape]: {
      top: 'auto',
      bottom: `calc(var(--sp-controls-bottom) + ${mobileLogHeight})`,
      left: mobileBattleLayout.enemy.landscapeLeft,
      width: mobileBattleLayout.message.landscapeWidth,
      transform: 'translateX(-50%)'
    }
  }
});

const battleHintFade = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 }
});

export const battleHintFadeOut = style({
  pointerEvents: 'none',
  animation: `${battleHintFade} 500ms ease-in forwards`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0 }
  }
});

export const health = style({
  position: 'absolute',
  zIndex: 2,
  top: 'max(80px, calc(env(safe-area-inset-top) + 64px), 10%)',
  width: '22%',
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: 'calc(clamp(12px, 1.3cqw, 24px) * var(--battle-hp-scale, 1))',
  letterSpacing: '0.16em',
  textShadow: '0 2px 6px #000',
  '@media': {
    [media.sp]: { width: mobileBattleLayout.hp.width },
    [mobileLandscape]: { width: mobileBattleLayout.hp.landscapeWidth }
  }
});

export const playerHealth = style({
  left: 400,
  top: 'auto',
  bottom: 'max(350px, env(safe-area-inset-bottom))',
  '@media': {
    [media.sp]: {
      left: mobileBattleLayout.hp.playerLeft,
      bottom: `calc(var(--sp-controls-bottom) + ${mobileButtonWidth} + ${mobileBattleLayout.hp.playerGap}px)`,
      transform: 'translateX(-50%)'
    },
    [mobileLandscape]: { left: mobileBattleLayout.buttons.landscapeLeft }
  }
});

export const playerStoneEffectBadge = style({
  position: 'absolute',
  top: '60%',
  left: 'calc(100% + 14px)',
  transform: 'translateY(-50%)',
  '@media': {
    [media.sp]: { left: `calc(100% + ${mobileBattleLayout.stoneBadge.playerGap}px)` },
    [mobileLandscape]: {
      left: 'auto',
      right: 0,
      top: `calc(100% + ${mobileBattleLayout.stoneBadge.landscapePlayerGap}px)`,
      transform: 'none'
    }
  }
});

export const enemyStoneEffectBadge = style({
  position: 'absolute',
  right: 'calc(60% + 12px)',
  bottom: 0,
  '@media': {
    [media.sp]: {
      right: `calc(50% + min(${mobileBattleLayout.enemyLevel.iconWidth}, 100%) / 2 + ${mobileBattleLayout.stoneBadge.enemyGap}px)`,
      bottom: mobileBattleLayout.stoneBadge.enemyBottom,
      scale: String(1 / mobileBattleLayout.enemyLevel.scale),
      transformOrigin: 'right bottom'
    }
  }
});

const stoneEffectBadgeFadeIn = keyframes({
  from: { opacity: 0, filter: 'blur(5px)' },
  to: { opacity: 1, filter: 'blur(0)' }
});

export const stoneEffectBadgeAppear = style({
  animation: `${stoneEffectBadgeFadeIn} 500ms ease-out both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
});

export const enemyHealth = style({
  right: '3.5%',
  '@media': {
    [media.sp]: {
      top: `calc(${mobileLogTop} + ${mobileLogHeight} + ${mobileBattleLayout.hp.enemyLogGap}px)`,
      right: `calc(max(${mobileBattleLayout.hp.enemyRight}, env(safe-area-inset-right)) + ${mobileBattleLayout.hp.enemyRightOffset}px)`
    }
  }
});

export const attributes = style({
  position: 'absolute',
  top: 'min(68%, calc(100% - min(15.6cqw, 27dvh) - 64px - env(safe-area-inset-bottom)))',
  left: '50%',
  transform: 'translateX(-50%)',
  '@media': {
    [media.sp]: {
      top: 'auto',
      left: mobileBattleLayout.buttons.left,
      bottom: 'var(--sp-controls-bottom)'
    },
    [mobileLandscape]: { left: mobileBattleLayout.buttons.landscapeLeft }
  }
});

export const titleShade = style({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  background:
    'radial-gradient(ellipse at 50% 38%, #02070b1a 0%, #02070b55 55%, #0009 100%), linear-gradient(180deg, #02070b30, transparent 60%)'
});

const auroraDrift = keyframes({
  from: { transform: 'translate(-2%, -3%) skewX(-4deg) scaleY(0.94)' },
  to: { transform: 'translate(2%, 4%) skewX(5deg) scaleY(1.04)' }
});

const auroraRays = `
  repeating-linear-gradient(
    88deg, #bbd8ff00 0 2px, #d8f3ff65 4px, #9edaff12 7px, #72b6ff00 12px,
    #579eff28 16px, #c8ecff4f 20px, #7abfff0a 26px, #7abfff00 37px
  ),
  repeating-linear-gradient(
    93deg, #6baaff00 0%, #a9dcff12 0.9%, #ebf9ff64 1.5%, #bdeaff15 2.3%,
    #5fa6ff08 3.8%, #7cc7ff43 5.2%, #a7d8ff00 7.4%
  )
`;

export const ultimateAurora = style({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  mixBlendMode: 'screen',
  opacity: 0.55,
  filter: 'blur(8px) drop-shadow(0 0 5px #a9dfff9c) drop-shadow(0 0 24px #2876ff9c)',
  selectors: {
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      left: '-12%',
      width: '124%',
      height: '70%',
      transformOrigin: '50% 30%',
      maskComposite: 'intersect',
      animation: `${auroraDrift} 11s ease-in-out -4s infinite alternate`
    },
    '&::before': {
      top: '-17%',
      background: `${auroraRays}, linear-gradient(#365bff00 10%, #325efd28 36%, #4c9cff70 56%, #9cdeffd1 79%, #f6fcffff 94%)`,
      maskImage:
        'linear-gradient(180deg, #0000 8%, #0003 43%, #000 80%), linear-gradient(90deg, #0002 5%, #000b 23%, #000 37%, #0007 59%, #000b 76%, #0000 98%)',
      clipPath: [
        'ellipse(65% 65% at 30% 23%)',
        `shape(
          from 0 0, hline to 100%, vline to 38%,
          curve to 79% 76% with 88% 31% / 87% 74%,
          curve to 64% 61% with 73% 78% / 67% 67%,
          curve to 54% 57% with 60% 52% / 57% 53%,
          curve to 33% 91% with 47% 64% / 45% 93%,
          curve to 12% 63% with 25% 89% / 21% 61%,
          curve to 0 80% with 6% 64% / 3% 73%, close
        )`
      ]
    },
    '&::after': {
      top: '1%',
      background: `${auroraRays}, linear-gradient(#355aff00 8%, #426bff2a 36%, #4698ff70 63%, #82d4ffc7 87%, #f0faffee)`,
      maskImage:
        'linear-gradient(180deg, #0000 12%, #0002 43%, #000 89%), linear-gradient(90deg, #0000 12%, #0002 38%, #0006 60%, #000 85%, #0006 100%)',
      clipPath: [
        'ellipse(63% 59% at 78% 32%)',
        `shape(
          from 0 0, hline to 100%, vline to 57%,
          curve to 86% 96% with 93% 65% / 95% 92%,
          curve to 69% 64% with 79% 99% / 74% 66%,
          curve to 45% 75% with 62% 61% / 56% 80%,
          curve to 23% 60% with 37% 71% / 31% 56%,
          curve to 0 65% with 15% 62% / 7% 74%, close
        )`
      ],
      animationDuration: '14s',
      animationDelay: '-7s',
      animationDirection: 'alternate-reverse'
    }
  },
  '@media': {
    '(orientation: portrait)': {
      selectors: { '&::before, &::after': { height: '61%' } }
    },
    '(prefers-reduced-motion: reduce)': {
      selectors: { '&::before, &::after': { animation: 'none' } }
    }
  }
});

export const screenBlackout = style({
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  background: '#000'
});

export const screenDarkeningDuration = 1000;
const darkenScreen = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 }
});

export const screenBlackoutDarkening = style({
  animation: `${darkenScreen} ${screenDarkeningDuration}ms linear both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
});

const revealCurtain = keyframes({
  from: { transform: 'translate(-50%, -50%) scale(1)' },
  to: { transform: 'translate(-50%, -50%) scale(6)' }
});

export const screenBlackoutOpening = style({
  background: 'transparent',
  '@media': {
    [media.sp]: {
      overflow: 'hidden',
      selectors: {
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100vmax',
          height: '100vmax',
          background: 'radial-gradient(circle closest-side, transparent 25%, #000 39%)',
          animation: `${revealCurtain} 700ms ease-out both`
        }
      }
    },
    '(prefers-reduced-motion: reduce)': {
      selectors: { '&::before': { display: 'none' } }
    }
  }
});

export const screenContent = style({
  position: 'absolute',
  inset: 0
});

export const screenContentHidden = style({
  opacity: 0
});

const revealRadius = createVar({
  syntax: '<percentage>',
  inherits: false,
  initialValue: '-25%'
});

const revealScreen = keyframes({
  from: { vars: { [revealRadius]: '-25%' }, opacity: 0.4 },
  to: { vars: { [revealRadius]: '125%' }, opacity: 1 }
});

const revealScreenBrightness = keyframes({
  '0%': { opacity: 0 },
  '5%': { opacity: 0.4 },
  '100%': { opacity: 1 }
});

export const screenContentReveal = style({
  maskImage: `radial-gradient(circle at center, #000 calc(${revealRadius} - 20%), transparent calc(${revealRadius} + 20%))`,
  animation: `${revealScreen} 700ms ease-out both`,
  '@media': {
    [media.sp]: {
      maskImage: 'none',
      animation: `${revealScreenBrightness} 700ms ease-out both`
    },
    '(prefers-reduced-motion: reduce)': { animation: 'none', maskImage: 'none', opacity: 1 }
  }
});

export const battleAction = style({
  display: 'block',
  lineHeight: 1
});

const shakeScale = createVar();
const shakeTransform = (x: number, y: number) =>
  `translate(calc(${x}px * ${shakeScale}), calc(${y}px * ${shakeScale}))`;

const shakeOnVictory = keyframes({
  '0%, 100%': { transform: 'translate(0, 0)' },
  '10%': { transform: shakeTransform(-15, 8) },
  '22%': { transform: shakeTransform(14, -8) },
  '34%': { transform: shakeTransform(-11, -6) },
  '46%': { transform: shakeTransform(10, 6) },
  '58%': { transform: shakeTransform(-7, 4) },
  '70%': { transform: shakeTransform(6, -3) },
  '82%': { transform: shakeTransform(-3, 2) },
  '92%': { transform: shakeTransform(2, -1) }
});

export const victoryShake = style({
  vars: { [shakeScale]: String(mobileBattleLayout.screenShakeScale) },
  animation: `${shakeOnVictory} ${mobileBattleLayout.screenShakeDuration}ms linear`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
});

const flashOnMatchResult = keyframes({
  '0%, 25%': { opacity: 1 },
  '100%': { opacity: 0 }
});

const mobileMatchResultFlash = keyframes({
  '0%, 40%': { opacity: 1 },
  '100%': { opacity: 0 }
});

export const matchResultFlash = style({
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  pointerEvents: 'none',
  background: '#fff',
  animation: `${flashOnMatchResult} 200ms ease-out both`,
  '@media': {
    [media.sp]: { animation: `${mobileMatchResultFlash} 650ms ease-out both` },
    '(prefers-reduced-motion: reduce)': { display: 'none' }
  }
});

const fadeToWhite = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

export const ultimateTransition = style({
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  pointerEvents: 'none',
  background: '#fff'
});

export const ultimateFadeIn = style({
  animation: `${fadeToWhite} ${ULTIMATE_TRANSITION.fadeIn}ms linear both`
});

export const ultimateHold = style({ opacity: 1 });

export const ultimateFadeOut = style({
  animation: `${fadeToWhite} ${ULTIMATE_TRANSITION.fadeOut}ms linear reverse both`
});
