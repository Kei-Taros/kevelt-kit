import { style, keyframes } from '@vanilla-extract/css';

const fadeOutKeyframes = keyframes({
  from: {
    opacity: 1
  },
  to: {
    opacity: 0
  }
});

export const transitionOverlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  pointerEvents: 'auto',
  background: '#000000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden'
});

export const transitionFadeOut = style({
  animation: `${fadeOutKeyframes} 400ms ease forwards`
});

export const transitionVideo = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block'
});
