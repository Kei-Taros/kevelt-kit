import { style, globalStyle } from '@vanilla-extract/css';

globalStyle('html, body', {
  margin: 0,
  padding: 0,
  width: '100%',
  height: '100%',
  background: '#050b16'
});

/* intro */
export const openingOverlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  background: '#ffffff',
  opacity: 1,
  transition: 'opacity 1000ms ease',
  pointerEvents: 'auto',
  overflow: 'hidden'
});

export const openingFadeOut = style({
  opacity: 0,
  pointerEvents: 'none'
});

export const openingVideo = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  display: 'block'
});

/* Hero View */
export const heroWrapper = style({
  position: 'relative',
  width: '100%',
  height: '100vh',
  overflow: 'hidden'
});

export const heroVideo = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 1
});

export const heroCover = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 2,
  pointerEvents: 'none',

  transform: 'scale(1)',
  transformOrigin: '48.5% 49%',
  transition: 'transform 0.3s ease-out',
  willChange: 'transform'
});

/* Section */
export const sectionBottom = style({
  paddingBottom: '300px'
});

export const contentInner = style({
  width: '100%',
  maxWidth: '1100px',
  padding: '0 clamp(20px, 5vw, 60px)',
  margin: '0 auto',
  color: 'white'
});

/* Msg */
export const msgWrapper = style({
  position: 'relative',
  minHeight: '50vh'
});

export const fadeUpMsg = style({
  opacity: 0,
  transform: 'translateY(30px)',
  transition: 'opacity 700ms ease, transform 700ms ease'
});

export const msgTop = style([
  fadeUpMsg,
  {
    fontSize: 'clamp(40px, 6vw, 72px)',
    fontWeight: 700,
    margin: '0 0 24px 0'
  }
]);

export const msgMiddle = style([
  fadeUpMsg,
  {
    fontSize: 'clamp(40px, 6vw, 72px)',
    fontWeight: 800,
    margin: 0,
    lineHeight: 1.2
  }
]);

export const msgBottom = style([
  fadeUpMsg,
  {
    position: 'absolute',
    right: 0,
    bottom: 0,
    fontSize: 'clamp(16px, 2vw, 26px)',
    fontWeight: 600
  }
]);

export const showMsg = style({
  opacity: 1,
  transform: 'translateY(0)'
});

/* grid section */
export const grid = style({
  vars: {
    '--big': 'clamp(440px, 60vw, 540px)',
    '--rightCol': 'calc(var(--big) * 0.70)',
    '--gap': '20px',
    '--small': 'calc((var(--big) - var(--gap)) / 2)'
  },
  display: 'grid',
  gridTemplateColumns: 'var(--big) var(--rightCol)',
  gridTemplateRows: 'var(--big) var(--big)',
  columnGap: 'var(--gap)',
  rowGap: 'var(--gap)',
  justifyContent: 'center'
});

export const gridTileHidden = style({
  opacity: 0,
  transform: 'translateY(40px)',
  transition: 'opacity 1s ease, transform 1s ease, filter 0.3s ease'
});

export const gridTileShow = style({
  opacity: 1,
  transform: 'translateY(0)',
  transition: 'opacity 1s ease, transform 1s ease, filter 0.3s ease'
});

export const gridTile = style({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '12px',
  filter: 'brightness(0.8)'
});

globalStyle(`.${gridTile}:hover`, {
  transform: 'scale(1.04)',
  filter: 'brightness(1.1)'
});

export const gridImg = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block'
});

export const gridLabel = style({
  position: 'absolute',
  left: '16px',
  bottom: '16px',
  color: '#fff',
  fontWeight: 700,
  fontSize: '22px',
  opacity: 0,
  transform: 'translateY(10px)',
  transition: 'opacity 0.5s ease, transform 0.3s ease'
});

globalStyle(`.${gridTile}:hover .${gridLabel}`, {
  opacity: 1,
  transform: 'translateY(0)'
});

export const aboutMe = style({
  gridColumn: '1 / 2',
  gridRow: '1 / 2',
  width: '100%',
  height: '100%'
});

export const concept = style({
  gridColumn: '2 / 3',
  gridRow: '1 / 2',
  width: '100%',
  height: '100%'
});

export const gridBottomRow = style({
  gridColumn: '1 / -1',
  gridRow: '2 / 3',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: 'var(--small) 1fr',
  columnGap: 'var(--gap)',
  alignItems: 'stretch'
});

export const gridLeftBottom = style({
  gridColumn: '1 / 2',
  gridRow: '2 / 3',
  width: 'var(--small)',
  height: '100%',
  justifySelf: 'start',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--gap)'
});

export const gridHalfTile = style({
  width: '100%',
  aspectRatio: '1 / 1'
});

export const works = style({
  gridColumn: '2 / 3',
  gridRow: '2 / 3',
  width: '100%',
  height: '100%',
  justifySelf: 'end',
  alignSelf: 'start'
});
