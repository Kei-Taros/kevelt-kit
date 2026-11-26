import { globalStyle, keyframes, style } from '@vanilla-extract/css';

const creditsAppear = keyframes({
  '0%': { opacity: 0 },
  '5%': { opacity: 0.4 },
  '100%': { opacity: 1 }
});

export const endingZoomDuration = 2000;

const approachEndingLight = keyframes({
  from: { transform: 'scale(1)' },
  to: { transform: 'scale(4)' }
});

const endingWhiteout = keyframes({
  '0%, 45%': { opacity: 0 },
  '100%': { opacity: 1 }
});

export const endingScene = style({
  position: 'absolute',
  inset: 0
});

export const endingZoom = style({
  transformOrigin: '50% 38%',
  animation: `${approachEndingLight} ${endingZoomDuration}ms ease-in forwards`,
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: '#fff',
      animation: `${endingWhiteout} ${endingZoomDuration}ms ease-in forwards`
    }
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
});

export const endingCredits = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'clamp(8px, 2dvh, 24px)',
  padding: '16px',
  color: '#162633',
  textAlign: 'center',
  animation: `${creditsAppear} 1000ms ease-out both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
});

export const endingSymbol = style({
  width: 'min(35vw, 25dvh)',
  aspectRatio: '878 / 764',
  overflow: 'hidden'
});

export const endingHeading = style({
  width: 'min(68vw, 44dvh)',
  margin: 0,
  lineHeight: 0
});

globalStyle(`.${endingHeading} img`, { width: '100%', filter: 'brightness(0)' });

export const endingMessage = style({
  margin: 'clamp(8px, 2dvh, 24px) 0 0',
  fontFamily: 'Georgia, serif',
  fontSize: 'clamp(17px, 3dvh, 28px)'
});

export const endingTitle = style({
  minHeight: 44,
  padding: '0 24px',
  border: '1px solid currentColor',
  background: 'transparent',
  color: 'inherit',
  letterSpacing: '0.18em',
  cursor: 'pointer'
});
