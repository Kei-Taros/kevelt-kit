import { style } from '@vanilla-extract/css';

export const arena = style({
  position: 'relative',
  isolation: 'isolate',
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
  background: '#080d10',
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
  top: '10%',
  left: '55%',
  width: '38%',
  height: '58%'
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

export const battleHint = style({
  position: 'absolute',
  top: '42%',
  left: '50%',
  zIndex: 1,
  width: 'min(90cqw, 960px)',
  transform: 'translate(-50%, -50%)'
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

export const enemyHealth = style({
  right: '3.5%'
});

export const attributes = style({
  position: 'absolute',
  top: 'min(68%, calc(100% - min(15.6cqw, 27dvh) - 64px - env(safe-area-inset-bottom)))',
  left: '50%',
  transform: 'translateX(-50%)'
});
