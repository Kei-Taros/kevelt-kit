import { globalStyle, style } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

globalStyle(':root', {
  vars: {
    '--embla-slide-height': '35rem',
    '--embla-slide-spacing': '1rem',
    '--embla-slide-size': '70%'
  }
});

export const embla = style({
  maxWidth: '60rem',
  margin: '0 auto'
});

export const viewport = style({
  overflow: 'hidden'
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
  transition: 'opacity 220ms ease, transform 220ms ease, filter 220ms ease'
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
  transition: 'opacity 220ms ease'
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
  fontSize: '2rem',
  letterSpacing: '0.06em',
  textTransform: 'uppercase'
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
  marginTop: '1.8rem'
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
  transition: 'background-color 160ms ease, transform 160ms ease, border-color 160ms ease'
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
  marginRight: 'calc((2.6rem - 1.4rem) / 2 * -1)'
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
  position: 'relative'
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
  color: 'inherit'
});

export const slideInner = style({
  position: 'relative'
});
