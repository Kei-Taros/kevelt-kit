import { createVar, globalStyle, keyframes, style, styleVariants } from '@vanilla-extract/css';

const sealAppear = keyframes({
  from: { opacity: 0, filter: 'blur(8px)' },
  to: { opacity: 1, filter: 'blur(0)' }
});

const sealBreathe = keyframes({
  from: { opacity: 0.9 },
  '50%': { opacity: 0.7 },
  to: { opacity: 0.9 }
});

const glowColor = createVar();
const softGlow = `0 0 12px 2px color-mix(in srgb, ${glowColor} 65%, transparent), 0 0 26px color-mix(in srgb, ${glowColor} 35%, transparent), inset 0 0 16px color-mix(in srgb, ${glowColor} 30%, transparent)`;
const wideGlow = `0 0 24px 5px color-mix(in srgb, ${glowColor} 75%, transparent), 0 0 46px 3px color-mix(in srgb, ${glowColor} 40%, transparent), inset 0 0 20px color-mix(in srgb, ${glowColor} 40%, transparent)`;
const breatheGlow = keyframes({
  from: { boxShadow: softGlow },
  '50%': { boxShadow: wideGlow },
  to: { boxShadow: softGlow }
});

export const option = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

export const button = style({
  position: 'relative',
  display: 'grid',
  placeItems: 'center',
  width: 'min(15.6cqw, 27dvh)',
  aspectRatio: '1',
  padding: 0,
  overflow: 'hidden',
  border: '2px solid #e6f5ff',
  borderRadius: '50%',
  background: 'radial-gradient(circle, #0a1119b3 30%, #03070bef 75%)',
  boxShadow: '0 0 12px #bce3ff80, inset 0 0 12px #bce3ff40',
  selectors: {
    '&:disabled:not([data-level-zero])': { opacity: 1 },
    '&:hover:not(:disabled):not([data-level-zero]):not([data-sealed]), &:focus-visible:not(:disabled):not([data-level-zero]):not([data-sealed])':
      {
        boxShadow: softGlow,
        animation: `${breatheGlow} 1.5s ease-in-out infinite`
      },
    '&:focus-visible': {
      outline: '3px solid white',
      outlineOffset: 7
    }
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      selectors: {
        '&:hover:not(:disabled):not([data-level-zero]):not([data-sealed]), &:focus-visible:not(:disabled):not([data-level-zero]):not([data-sealed])':
          {
            animation: 'none'
          }
      }
    }
  }
});

export const elementVariants = styleVariants({
  fire: {
    vars: { [glowColor]: '#ff7b20' },
    borderColor: '#fff0d6',
    boxShadow: '0 0 5px #fff0d6, 0 0 20px #ff7b20, inset 0 0 16px #ff7b2066'
  },
  stone: {
    vars: { [glowColor]: '#9966ee' },
    borderColor: '#d4b5ff',
    boxShadow: '0 0 5px #d4b5ffb3, 0 0 18px #9966ee99, inset 0 0 14px #9966ee4d'
  },
  mist: {
    vars: { [glowColor]: '#65cfff' },
    borderColor: '#b5eeff',
    boxShadow: '0 0 5px #b5eeffb3, 0 0 20px #65cfff99, inset 0 0 16px #65cfff4d'
  }
});

const rippleColor = createVar();
const rippleExpand = keyframes({
  from: { opacity: 0.85, transform: 'translateX(-50%) scale(0.95)' },
  to: { opacity: 0, transform: 'translateX(-50%) scale(1.55)' }
});

export const ripple = style({
  position: 'absolute',
  top: 0,
  left: '50%',
  zIndex: 0,
  width: 'min(15.6cqw, 27dvh)',
  aspectRatio: '1',
  boxSizing: 'border-box',
  border: `3px solid ${rippleColor}`,
  borderRadius: '50%',
  boxShadow: `0 0 14px ${rippleColor}, inset 0 0 10px ${rippleColor}`,
  pointerEvents: 'none',
  animation: `${rippleExpand} 700ms ease-out forwards`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0 } }
});

export const rippleVariants = styleVariants({
  fire: { vars: { [rippleColor]: '#ff7b20' } },
  stone: { vars: { [rippleColor]: '#9966ee' } },
  mist: { vars: { [rippleColor]: '#65cfff' } }
});

export const levelZero = style({
  borderColor: '#c5cdd5',
  background: '#111519',
  boxShadow: '0 0 6px #c5cdd555, inset 0 0 10px #c5cdd533'
});

export const icon = style({
  display: 'block',
  width: '94%',
  height: '94%',
  opacity: 1,
  transform: 'scale(1)',
  transition: 'opacity 350ms ease-out, transform 350ms ease-out',
  selectors: {
    [`${button}:hover:not(:disabled):not([data-suppress-hover]):not([data-level-zero]):not([data-sealed]) &`]: {
      opacity: 0.25,
      transform: 'scale(1.1)',
      transitionDelay: '0.8s, 0s'
    },
    [`${button}:focus-visible:not(:disabled):not([data-suppress-hover]):not([data-level-zero]):not([data-sealed]) &`]:
      {
        opacity: 0.25,
        transform: 'scale(1.1)'
      },
    [`${option}[data-preview-pinned] &`]: { opacity: 0.25, transform: 'scale(1.1)' },
    [`${option}[data-level-zero] &`]: { opacity: 0.55, filter: 'grayscale(1)' }
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' }
  }
});

export const fireIcon = style({
  height: '100%'
});

export const cycle = style({
  position: 'absolute',
  inset: '15%',
  display: 'block',
  width: '70%',
  height: '70%',
  opacity: 0,
  transition: 'opacity 350ms ease-out',
  pointerEvents: 'none',
  selectors: {
    [`${button}:hover:not(:disabled):not([data-suppress-hover]):not([data-level-zero]):not([data-sealed]) &`]: {
      opacity: 1,
      transitionDelay: '0.8s'
    },
    [`${button}:focus-visible:not(:disabled):not([data-suppress-hover]):not([data-level-zero]):not([data-sealed]) &`]:
      {
        opacity: 1
      },
    [`${option}[data-preview-pinned] &`]: { opacity: 1 }
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' }
  }
});

export const cycleImage = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  transformOrigin: 'center center',
  transform: 'translateZ(0) scale(0.90)',
  backfaceVisibility: 'hidden',
  willChange: 'transform',
  transition: 'transform 350ms ease-out',
  selectors: {
    [`${button}:hover:not(:disabled):not([data-suppress-hover]):not([data-level-zero]):not([data-sealed]) &`]: {
      transform: 'translateZ(0) scale(1)',
      transitionDelay: '0.8s'
    },
    [`${button}:focus-visible:not(:disabled):not([data-suppress-hover]):not([data-level-zero]):not([data-sealed]) &`]:
      {
        transform: 'translateZ(0) scale(1)'
      },
    [`${option}[data-preview-pinned] &`]: { transform: 'translateZ(0) scale(1)' }
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' }
  }
});

export const level = style({
  position: 'absolute',
  right: -8,
  bottom: -8,
  zIndex: 1,
  padding: 0,
  border: 0,
  borderRadius: '50%',
  background: 'transparent',
  cursor: 'default',
  selectors: {
    '&:focus-visible': { outline: '2px solid white', outlineOffset: 4 }
  }
});

export const sealEffect = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  zIndex: 2,
  width: '140%',
  aspectRatio: '1',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
  animation: `${sealAppear} 800ms ease-out both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
});

globalStyle(`${sealEffect} img`, {
  animation: `${sealBreathe} 2s ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0.85 }
  }
});
