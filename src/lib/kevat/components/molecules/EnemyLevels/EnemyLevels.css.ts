import { globalStyle, keyframes, style } from '@vanilla-extract/css';

const mistEffectAppear = keyframes({
  from: { opacity: 0, filter: 'blur(8px)' },
  to: { opacity: 1, filter: 'blur(0)' }
});

const mistEffectBreathe = keyframes({
  from: { opacity: 0.9 },
  '50%': { opacity: 0.6 },
  to: { opacity: 0.9 }
});

export const levels = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 'clamp(2px, 0.4cqw, 6px)',
  width: '60%',
  marginTop: 'clamp(12px, 1.4cqw, 22px)',
  marginRight: 0,
  marginLeft: 'auto',
  paddingInline: 4,
  color: '#f5f5f2',
  fontSize: 'clamp(10px, 0.85cqw, 14px)',
  letterSpacing: '0.03em',
  whiteSpace: 'nowrap'
});

export const level = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 0
});

export const icon = style({
  position: 'relative',
  zIndex: 2,
  display: 'block',
  width: 'clamp(44px, 4.84cqw, 72.6px)',
  maxWidth: '100%',
  aspectRatio: '1',
  transform: 'translateY(-3px)',
  filter: 'drop-shadow(0 1px 5px #000)'
});

export const mistEffect = style({
  position: 'absolute',
  top: 'calc(50% + 16px)',
  left: '50%',
  width: 130,
  height: 130,
  transform: 'translate(-50%, -50%)',
  animation: `${mistEffectAppear} 800ms ease-out backwards`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', opacity: 1 }
  }
});

globalStyle(`${mistEffect} img`, {
  animation: `${mistEffectBreathe} 2s ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0.85 }
  }
});

export const iconUnavailable = style({
  opacity: 0.55,
  filter: 'grayscale(1) drop-shadow(0 1px 5px #000)'
});
