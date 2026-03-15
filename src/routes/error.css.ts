import { style, globalStyle, keyframes } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

globalStyle('html, body', {
  margin: 0,
  padding: 0,
  width: '100%',
  height: '100%',
  background: colors.background.primary
});

export const contentInner = style({
  width: '100%',
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '80px clamp(20px, 5vw, 64px)',
  display: 'grid',
  alignItems: 'center',
  color: colors.text.primary
});

export const imageWrapper = style({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  borderRadius: '12px',

  boxShadow: '0 10px 60px rgba(105, 104, 104, 0.6)'
});

export const image = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  display: 'block'
});

export const overlayText = style({
  position: 'absolute',
  inset: 0,

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '10px',

  textAlign: 'center',
  color: colors.text.primary,

  padding: '30px'
});

/* 松明用エフェクト */

const torchFlicker = keyframes({
  '0%': {
    opacity: 0.5,
    transform: 'scale(1)'
  },
  '50%': {
    opacity: 1,
    transform: 'scale(1.2)'
  },
  '100%': {
    opacity: 0.5,
    transform: 'scale(0.95)'
  }
});

export const torchGlow = style({
  position: 'absolute',
  top: '24%',
  left: '50%',

  width: '100px',
  height: '100px',

  borderRadius: '50%',
  pointerEvents: 'none',
  background:
    'radial-gradient(circle, rgba(255,180,80,0.6) 0%, rgba(255,140,40,0.35) 40%, rgba(255,120,20,0.1) 70%, transparent 80%)',
  filter: 'blur(12px)',
  animation: `${torchFlicker} 2s ease-in-out infinite`
});
