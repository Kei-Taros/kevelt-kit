import { createVar, style, styleVariants } from '@vanilla-extract/css';

const logAccent = createVar();

export const row = style({
  position: 'relative',
  isolation: 'isolate',
  display: 'grid',
  gridTemplateColumns: '44px 1px minmax(0, 1fr) 1px 55px',
  columnGap: 4,
  alignItems: 'center',
  minHeight: 0,
  boxSizing: 'border-box',
  padding: '8px 7px',
  color: '#f6f4ed',
  filter: `drop-shadow(0 0 3px ${logAccent})`,
  selectors: {
    '&::before, &::after': {
      content: "''",
      position: 'absolute',
      clipPath:
        'polygon(7px 0, calc(100% - 7px) 0, 100% 7px, 100% calc(100% - 7px), calc(100% - 7px) 100%, 7px 100%, 0 calc(100% - 7px), 0 7px)',
      pointerEvents: 'none'
    },
    '&::before': { inset: 0, zIndex: -2, background: logAccent },
    '&::after': { inset: 1, zIndex: -1, background: '#02080def' }
  }
});

export const outcomeVariants = styleVariants({
  win: { vars: { [logAccent]: '#30f08f' } },
  lose: { vars: { [logAccent]: '#ff4b6e' } },
  draw: { vars: { [logAccent]: '#ffd54f' } }
});

export const turn = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  fontFamily: "Georgia, 'Times New Roman', serif"
});

export const turnLabel = style({
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.04em'
});

export const turnNumber = style({
  fontSize: 29,
  fontWeight: 600,
  lineHeight: 1
});

export const separator = style({
  width: 1,
  height: '70%',
  background: 'linear-gradient(180deg, #d7e7f500, #d7e7f5d9 50%, #d7e7f500)',
  boxShadow: '0 0 6px #d7e7f533'
});

export const duel = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  minWidth: 0
});

export const icon = style({
  display: 'block',
  flex: '0 0 52px',
  width: 52,
  height: 52,
  filter: 'drop-shadow(0 0 6px #ffffff40)'
});

export const vs = style({
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: 14,
  fontWeight: 600,
  textShadow: '0 1px 3px #000'
});

export const resultArea = style({
  display: 'grid',
  placeItems: 'center',
  minWidth: 0
});

export const result = style({
  position: 'relative',
  isolation: 'isolate',
  display: 'grid',
  placeItems: 'center',
  width: '100%',
  height: 30,
  color: '#fff',
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: 12,
  fontWeight: 700,
  textShadow: `0 0 8px ${logAccent}`,
  whiteSpace: 'nowrap',
  selectors: {
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      clipPath:
        'polygon(7px 0, calc(100% - 7px) 0, 100% 7px, 100% calc(100% - 7px), calc(100% - 7px) 100%, 7px 100%, 0 calc(100% - 7px), 0 7px)',
      pointerEvents: 'none'
    },
    '&::before': { inset: 0, zIndex: -2, background: logAccent, boxShadow: `0 0 8px ${logAccent}` },
    '&::after': { inset: 2, zIndex: -1, background: '#091016' }
  }
});
