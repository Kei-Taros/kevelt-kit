import { createVar, style } from '@vanilla-extract/css';

const borderColor = createVar();
const symbolColor = createVar();
const glowColor = createVar();

export const button = style({
  vars: { [borderColor]: '#78d8ff', [symbolColor]: '#91e5ff', [glowColor]: '72, 191, 255' },
  position: 'relative',
  isolation: 'isolate',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 22,
  minWidth: 'clamp(210px, 19cqw, 290px)',
  height: 46,
  padding: '0 24px',
  border: `1px solid ${borderColor}`,
  borderRadius: 2,
  background: 'transparent',
  color: '#e5f5ff',
  fontFamily: 'Georgia, serif',
  fontSize: 'clamp(13px, 1.1cqw, 17px)',
  letterSpacing: '0.2em',
  cursor: 'pointer',
  boxShadow: `0 0 0 1px #061622aa, 0 0 12px rgba(${glowColor}, 0.33), inset 0 0 10px rgba(${glowColor}, 0.09)`,
  transition: 'border-color 400ms ease, box-shadow 500ms ease, color 400ms ease',
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      left: '15%',
      right: '15%',
      bottom: -1,
      height: 1,
      background: `linear-gradient(90deg, transparent, ${symbolColor}, transparent)`,
      boxShadow: `0 0 8px rgba(${glowColor}, 0.7)`,
      transition: 'background 400ms ease, box-shadow 400ms ease'
    },
    '&:hover::after': {
      background: 'linear-gradient(90deg, transparent, #ffe0ad, transparent)',
      boxShadow: '0 0 10px #ffb061'
    },
    '&:hover': {
      color: '#fff4de',
      borderColor: '#ffb061',
      boxShadow: '0 0 0 1px #061622aa, 0 0 22px #ffb06155, inset 0 0 16px #ffb06112'
    },
    '&:focus-visible': { outline: '2px solid #c5f3ff', outlineOffset: 5 }
  }
});

export const diamond = style({
  width: 6,
  height: 6,
  border: `1px solid ${symbolColor}`,
  transform: 'rotate(45deg)',
  boxShadow: `0 0 0 1px #06162299, 0 0 8px rgba(${glowColor}, 0.67)`,
  transition: 'border-color 400ms ease, box-shadow 400ms ease',
  selectors: {
    [`${button}:hover &`]: {
      borderColor: '#ffcf91',
      boxShadow: '0 0 8px #ffb061aa'
    }
  }
});

export const arrow = style({
  fontSize: 25,
  lineHeight: 1,
  color: symbolColor,
  textShadow: `0 1px 2px #00121f, 0 0 6px rgba(${glowColor}, 0.67)`,
  transition: 'color 400ms ease, text-shadow 400ms ease',
  selectors: {
    [`${button}:hover &`]: {
      color: '#ffcf91',
      textShadow: '0 1px 2px #241100, 0 0 6px #ffb061aa'
    }
  }
});

export const rematch = style({
  vars: { [borderColor]: '#c08cff', [symbolColor]: '#dfc3ff', [glowColor]: '192, 140, 255' }
});
