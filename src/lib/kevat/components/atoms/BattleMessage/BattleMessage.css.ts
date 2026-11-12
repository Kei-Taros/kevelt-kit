import { keyframes, style } from '@vanilla-extract/css';

const mistAppear = keyframes({
  from: { opacity: 0, transform: 'scale(0.88)', filter: 'blur(24px)' },
  to: { opacity: 1, transform: 'scale(1)', filter: 'blur(10px)' }
});

const gentleBreathing = keyframes({
  '0%, 100%': { opacity: 0.12 },
  '50%': { opacity: 0.36 }
});

const mistDrift = keyframes({
  '0%, 100%': { transform: 'translateX(-8px)' },
  '50%': { transform: 'translateX(8px)' }
});

const textAppear = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 }
});

const mistBackground =
  'radial-gradient(ellipse at center, #05090de6 0%, #080d10b8 42%, transparent 76%), linear-gradient(90deg, transparent 0%, #02050780 18%, #02050780 82%, transparent 100%)';

export const message = style({
  position: 'relative',
  isolation: 'isolate',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: 'clamp(128px, 18cqw, 220px)',
  margin: 0,
  color: '#f5f5f2',
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: 'clamp(16px, 1.8cqw, 36px)',
  fontWeight: 600,
  lineHeight: 1.8,
  letterSpacing: '0.16em',
  textAlign: 'center',
  textShadow: '0 2px 6px #000, 0 0 18px #000',
  whiteSpace: 'nowrap',
  selectors: {
    '&::before': {
      content: "''",
      position: 'absolute',
      inset: 0,
      zIndex: -1,
      pointerEvents: 'none',
      background: mistBackground,
      filter: 'blur(10px)',
      animation: `${mistAppear} 900ms ease-out both`
    },
    '&::after': {
      content: "''",
      position: 'absolute',
      inset: 0,
      zIndex: -1,
      pointerEvents: 'none',
      background: mistBackground,
      filter: 'blur(14px)',
      animation: `${gentleBreathing} 4s ease-in-out 900ms infinite both, ${mistDrift} 8s ease-in-out 900ms infinite both`
    }
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      selectors: {
        '&::before': { animation: 'none' },
        '&::after': { animation: 'none', opacity: 0.24 }
      }
    }
  }
});

export const line = style({
  display: 'block',
  animation: `${textAppear} 500ms ease-out 900ms both`,
  selectors: {
    '&:nth-child(2)': { animationDelay: '1450ms' }
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
});
