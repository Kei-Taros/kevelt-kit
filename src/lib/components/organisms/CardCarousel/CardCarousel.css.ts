import { globalStyle, style } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';
import { media } from '$lib/styles/breakpoints';

globalStyle(':root', {
  vars: {
    '--embla-slide-height': '33rem',
    '--embla-slide-spacing': '1rem',
    '--embla-slide-size': '70%'
  },
  '@media': {
    [media.pcs]: {
      vars: {
        '--embla-slide-height': '24rem',
        '--embla-slide-spacing': '0.9rem',
        '--embla-slide-size': '66%'
      }
    },
    '(max-width: 767px)': {
      vars: {
        '--embla-slide-height': 'clamp(250px, 82vw, 340px)',
        '--embla-slide-spacing': '0.75rem',
        '--embla-slide-size': '88%'
      }
    }
  }
});

export const embla = style({
  width: '100%',
  maxWidth: '60rem',
  margin: '0 auto',
  overflow: 'visible'
});

export const viewport = style({
  overflow: 'hidden',
  contain: 'layout paint'
});

export const container = style({
  display: 'flex',
  touchAction: 'pan-y pinch-zoom',
  marginLeft: 'calc(var(--embla-slide-spacing) * -1)'
});

export const slide = style({
  flex: `0 0 var(--embla-slide-size)`,
  minWidth: 0,
  paddingLeft: 'var(--embla-slide-spacing)',
  position: 'relative'
});

export const slideImg = style({
  display: 'block',
  height: 'var(--embla-slide-height)',
  width: '100%',
  objectFit: 'cover',
  borderRadius: '1.8rem',
  transition: 'opacity 220ms ease, transform 220ms ease, filter 220ms ease',
  '@media': {
    '(max-width: 767px)': {
      borderRadius: '1rem'
    }
  }
});

export const slideOverlay = style({
  pointerEvents: 'none',
  position: 'absolute',
  inset: 0,
  borderRadius: '1.8rem',
  background: `radial-gradient(
    120% 100% at 50% 0%,
    rgba(255, 255, 255, 0) 0%,
    rgba(0, 0, 0, 0.2) 70%,
    rgba(0, 0, 0, 0.9) 100%
  )`,
  opacity: 0,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  padding: '1.4rem',
  transition: 'opacity 220ms ease',
  '@media': {
    '(max-width: 767px)': {
      borderRadius: '1rem',
      padding: '1rem'
    }
  }
});

export const slideDimmed = style({
  filter: 'brightness(0.25)',
  transform: 'scale(0.95)'
});

export const slideOverlayActive = style({
  opacity: 1
});

export const slideTitle = style({
  color: colors.text.primary,
  fontSize: '32px',
  fontWeight: 500,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  '@media': {
    '(max-width: 767px)': {
      fontSize: 'clamp(16px, 4.6vw, 20px)',
      lineHeight: 1.35
    }
  }
});

globalStyle(`${slideOverlayActive} ~ ${slideImg}, ${slideOverlayActive} + ${slideImg}`, {
  opacity: '1',
  filter: 'blur(0)'
});

export const controls = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  justifyContent: 'space-between',
  gap: '1.2rem',
  marginTop: '1.8rem',
  padding: '0 0.6rem',
  boxSizing: 'border-box',
  '@media': {
    '(max-width: 767px)': {
      alignItems: 'center',
      gap: '0.75rem',
      marginTop: '1rem',
      padding: '0 0.35rem'
    }
  }
});

export const buttons = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '0.6rem',
  alignItems: 'center'
});

export const button = style({
  WebkitTapHighlightColor: 'rgba(255, 255, 255, 0.5)',
  appearance: 'none',
  backgroundColor: 'transparent',
  touchAction: 'manipulation',
  cursor: 'pointer',
  border: 0,
  padding: 0,
  margin: 0,
  borderRadius: '50%',
  borderWidth: '0.2rem',
  borderStyle: 'solid',
  borderColor: 'rgba(255, 255, 255, 0.6)',
  width: '3.6rem',
  height: '3.6rem',
  color: colors.text.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 160ms ease, transform 160ms ease, border-color 160ms ease',
  '@media': {
    '(max-width: 767px)': {
      width: '2.8rem',
      height: '2.8rem'
    }
  }
});

export const buttonDisabled = style({
  color: '#555',
  borderColor: 'rgba(255,255,255,0.08)'
});

globalStyle(`${button}:hover`, {
  backgroundColor: 'rgba(255,255,255,0.06)',
  transform: 'scale(1.08)'
});
globalStyle(`${button}:active`, {
  transform: 'scale(0.97)'
});

export const buttonSvg = style({
  width: '35%',
  height: '35%'
});

export const dots = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginRight: 'calc((2.6rem - 1.4rem) / 2 * -1)',
  '@media': {
    '(max-width: 767px)': {
      columnGap: '0.25rem',
      marginRight: 0,
      rowGap: '0.25rem'
    }
  }
});

export const dot = style({
  WebkitTapHighlightColor: 'rgba(255,255,255,0.5)',
  appearance: 'none',
  backgroundColor: 'transparent',
  touchAction: 'manipulation',
  cursor: 'pointer',
  border: 0,
  padding: 0,
  margin: 0,
  width: '2.6rem',
  height: '2.6rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  position: 'relative',
  '@media': {
    '(max-width: 767px)': {
      width: '1.8rem',
      height: '1.8rem'
    }
  }
});

globalStyle(`${dot}::before`, {
  content: '',
  width: '1.4rem',
  height: '1.4rem',
  borderRadius: '50%',
  border: '0.2rem solid rgba(255,255,255,0.25)',
  position: 'absolute'
});

globalStyle(`${dot}::after`, {
  content: '',
  width: '1.4rem',
  height: '1.4rem',
  borderRadius: '50%',
  border: `0.2rem solid ${colors.background.secondary}`,
  opacity: 0,
  transition: 'opacity 160ms ease',
  position: 'absolute'
});

export const dotSelected = style({});
globalStyle(`${dotSelected}::after`, {
  opacity: 1
});

export const slideLink = style({
  display: 'block',
  position: 'relative',
  textDecoration: 'none',
  color: 'inherit',

  width: '100%',
  padding: 0,
  border: 'none',
  background: 'transparent',
  appearance: 'none',
  WebkitAppearance: 'none',
  textAlign: 'inherit',
  font: 'inherit',
  cursor: 'pointer'
});

export const slideInner = style({
  position: 'relative'
});
