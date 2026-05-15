import { style, globalStyle } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const contentInner = style({
  width: '100%',
  minHeight: '100svh',
  display: 'flex',
  color: colors.text.primary
});

export const leftArea = style({
  position: 'sticky',
  top: 0,
  width: '40%',
  height: '100dvh',
  flexShrink: 0,
  overflow: 'hidden',
  paddingLeft: '36px'
});

export const msgMain = style({
  margin: '0',
  fontSize: '64px',
  fontWeight: 800,
  letterSpacing: '0.04em',
  zIndex: 1,
  marginBottom: '36px'
});

export const msgDescription = style({
  color: colors.text.muted,
  fontSize: '16px',
  zIndex: 1,
  lineHeight: 2
});

export const msgBackground = style({
  position: 'absolute',
  bottom: '-160px',
  left: 0,
  width: '100%',
  zIndex: 0,
  pointerEvents: 'none'
});

export const msgImg = style({
  width: '100%',
  height: 'auto',
  display: 'block',
  objectFit: 'cover',
  filter: 'brightness(0.9)'
});

export const rightArea = style({
  width: '55%',
  height: '100svh',
  paddingLeft: '28px',
  paddingRight: '48px',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  scrollSnapType: 'y mandatory',
  scrollBehavior: 'smooth',
  scrollbarWidth: 'none'
});

export const sectionBlock = style({
  minHeight: '100svh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always',
  boxSizing: 'border-box',
  position: 'relative'
});

export const firstMsg = style({
  margin: 0,
  fontSize: '60px',
  fontWeight: 800,
  letterSpacing: '0.03em',
  textAlign: 'center'
});

export const firstBrandMsg = style({
  color: colors.brand[600],
  marginLeft: '12px'
});

export const arrow = style({
  fontSize: '22px',
  lineHeight: 1
});

export const sectionText = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
});

globalStyle(`${sectionText} p`, {
  margin: 0,
  color: colors.text.primary,
  fontSize: '18px',
  lineHeight: 2,
  zIndex: 2
});

globalStyle(`${sectionText} .brand`, {
  color: colors.brand[600],
  fontWeight: 700
});

export const logoImage = style({
  position: 'absolute',
  right: '0',
  bottom: '210px',
  width: '400px',
  opacity: 0.4,
  pointerEvents: 'none',
  userSelect: 'none',
  zIndex: 1
});

export const themeText = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '24px'
});

globalStyle(`${themeText} p`, {
  margin: 0
});
