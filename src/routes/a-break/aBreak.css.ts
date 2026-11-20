import { createVar, keyframes, style } from '@vanilla-extract/css';

export const arena = style({
  position: 'relative',
  isolation: 'isolate',
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
  background: '#000',
  color: '#f5f5f2',
  containerType: 'inline-size',
  '@supports': {
    '(height: 100dvh)': { height: '100dvh' }
  }
});

export const attributeCycle = style({
  position: 'absolute',
  top: 'max(16px, env(safe-area-inset-top))',
  left: 'max(3.5%, env(safe-area-inset-left))',
  width: 'min(11.7cqw, 18dvh)'
});

export const enemy = style({
  position: 'absolute',
  top: '1%',
  left: '50%',
  width: '60dvh',
  height: '52.5%',
  transform: 'translateX(-50%)'
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
  transform: 'translate(-50%, -50%)'
});

export const movePreview = style({
  position: 'absolute',
  top: '37%',
  left: '50%',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  transform: 'translate(-50%, -50%)'
});

export const battleHint = style({
  position: 'absolute',
  top: '48%',
  left: '50%',
  zIndex: 1,
  width: 'min(86cqw, 1200px)',
  transform: 'translate(-50%, -50%)'
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
  fontSize: 'clamp(12px, 1.3cqw, 24px)',
  letterSpacing: '0.16em',
  textShadow: '0 2px 6px #000'
});

export const playerHealth = style({
  left: 400,
  top: 'auto',
  bottom: 'max(350px, env(safe-area-inset-bottom))'
});

export const playerStoneEffectBadge = style({
  position: 'absolute',
  top: '50%',
  left: 'calc(100% + 14px)',
  transform: 'translateY(-50%)'
});

export const enemyStoneEffectBadge = style({
  position: 'absolute',
  right: 'calc(60% + 12px)',
  bottom: 0
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
  right: '3.5%'
});

export const attributes = style({
  position: 'absolute',
  top: 'min(68%, calc(100% - min(15.6cqw, 27dvh) - 64px - env(safe-area-inset-bottom)))',
  left: '50%',
  transform: 'translateX(-50%)'
});

export const titleShade = style({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  background:
    'radial-gradient(ellipse at 50% 38%, #02070b1a 0%, #02070b55 55%, #0009 100%), linear-gradient(180deg, #02070b30, transparent 60%)'
});

const titleMistDrift = keyframes({
  from: { transform: 'translate3d(-50%, 0, 0)' },
  to: { transform: 'translate3d(0, 0, 0)' }
});

// 左右端に同じ雲を配置し、各タイルの濃さと傾きを連続させる。
const titleMistNear = [
  'radial-gradient(ellipse 26.4% 50.4% at 0% 62%, #e8f3fa48, #e8f3fa18 45%, #e8f3fa00 100%)',
  'radial-gradient(ellipse 26.4% 50.4% at 100% 62%, #e8f3fa48, #e8f3fa18 45%, #e8f3fa00 100%)',
  'radial-gradient(ellipse 31.2% 39.6% at 42% 76%, #e8f3fa55, #e8f3fa18 45%, #e8f3fa00 100%)',
  'radial-gradient(ellipse 26.4% 33.6% at 72% 38%, #e8f3fa38, #e8f3fa10 45%, #e8f3fa00 100%)'
].join(', ');

const titleMistFar = [
  'radial-gradient(ellipse 38.4% 36% at 0% 36%, #edf6ff48, #edf6ff12 45%, #edf6ff00 100%)',
  'radial-gradient(ellipse 38.4% 36% at 100% 36%, #edf6ff48, #edf6ff12 45%, #edf6ff00 100%)',
  'radial-gradient(ellipse 40.8% 48% at 51% 60%, #edf6ff48, #edf6ff18 45%, #edf6ff00 100%)'
].join(', ');

export const titleMist = style({
  position: 'absolute',
  inset: '50% 0 0',
  zIndex: 1,
  overflow: 'hidden',
  pointerEvents: 'none',
  maskImage: 'linear-gradient(to bottom, transparent, #000 30%)',
  background: 'linear-gradient(to bottom, #e8f3fa08, #e8f3fa18)',
  selectors: {
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      width: '200%',
      backgroundSize: '50% 100%',
      backgroundRepeat: 'repeat-x',
      animation: `${titleMistDrift} 20s linear infinite`
    },
    '&::before': {
      backgroundImage: titleMistNear,
      opacity: 0.85
    },
    '&::after': {
      backgroundImage: titleMistFar,
      opacity: 0.6,
      animationDuration: '30s',
      animationDelay: '-9s'
    }
  },
  '@media': {
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

export const screenBlackoutOpening = style({
  background: 'transparent'
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

export const screenContentReveal = style({
  maskImage: `radial-gradient(circle at center, #000 calc(${revealRadius} - 20%), transparent calc(${revealRadius} + 20%))`,
  animation: `${revealScreen} 700ms ease-out both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', maskImage: 'none', opacity: 1 }
  }
});

export const battleAction = style({
  display: 'block',
  lineHeight: 1
});
