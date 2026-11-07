import { keyframes, style } from '@vanilla-extract/css';

const orbitBorder = keyframes({
  from: { strokeDashoffset: 'calc(-1 * var(--segment-position))' },
  to: { strokeDashoffset: 'calc(-1 * (var(--log-perimeter) + var(--segment-position)))' }
});

export const panel = style({
  position: 'absolute',
  bottom: 'max(calc(32% - min(15.6cqw, 27dvh)), calc(64px + env(safe-area-inset-bottom)))',
  left: 'max(3.5%, env(safe-area-inset-left))',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  width: 'clamp(180px, 18cqw, 310px)',
  height: '60%',
  boxSizing: 'border-box',
  padding: '22px 10px 22px',
  overflow: 'hidden',
  border: '2px solid #79dfff',
  borderRadius: 18,
  background: 'linear-gradient(180deg, #06141dcc 0%, #02070ccc 100%)',
  boxShadow: '0 0 0 1px #79dfff26 inset, 0 0 12px #35cfff88, 0 0 34px #1ebae94d, 0 12px 36px #000b',
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 7,
      border: '1px solid #7bdfff30',
      borderRadius: 11,
      pointerEvents: 'none'
    }
  }
});

export const borderTrace = style({
  position: 'absolute',
  inset: 0,
  zIndex: 3,
  display: 'block',
  width: '100%',
  height: '100%',
  overflow: 'visible',
  pointerEvents: 'none',
  filter: 'drop-shadow(0 0 4px #aaf5ff) drop-shadow(0 0 2px #63e4ff)'
});

export const borderTraceLine = style({
  fill: 'none',
  stroke: '#e4fbff',
  strokeWidth: 3,
  strokeLinecap: 'butt',
  animation: `${orbitBorder} 10s linear infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
});

export const list = style({
  display: 'grid',
  gridAutoRows: 'calc((100% - 30px) / 4)',
  alignContent: 'start',
  flex: '1 1 0',
  gap: 10,
  minHeight: 0,
  margin: 0,
  padding: '6px 4px 5px',
  overflowX: 'hidden',
  overflowY: 'auto',
  listStyle: 'none',
  scrollbarColor: '#65dafa66 transparent',
  scrollbarWidth: 'thin'
});
