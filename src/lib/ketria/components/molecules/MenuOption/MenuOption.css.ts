import { globalStyle, style } from '@vanilla-extract/css';
import { media } from '$lib/styles/breakpoints';

export const button = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'clamp(12px, 2.5vw, 36px)',
  width: '100%',
  height: 'clamp(40px, 6dvh, 66px)',
  padding: '0 0 0 0.45em',
  border: 0,
  color: '#f6f7fa',
  background: 'transparent',
  fontFamily: 'Arial, sans-serif',
  fontSize: 'clamp(15px, 2.8dvh, 29px)',
  fontWeight: 400,
  letterSpacing: '0.45em',
  cursor: 'pointer',
  textShadow: '0 2px 12px #000',
  transition: 'color 180ms ease, text-shadow 180ms ease',
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '15%',
      right: '15%',
      height: 1,
      background: 'linear-gradient(90deg, transparent, #cadce22b, transparent)'
    },

    '&:disabled': { opacity: 0.4, cursor: 'default', textShadow: 'none' },
    '&:focus-visible': { outline: '1px solid #ffb061', outlineOffset: 4 }
  },
  '@media': {
    [media.nonSpHover]: {
      selectors: {
        '&:hover:not(:disabled)': { color: '#ffcd96', textShadow: '0 0 14px #ff8c36aa' }
      }
    },
    '(prefers-reduced-motion: reduce)': { transition: 'none' }
  }
});

export const primary = style({
  fontSize: 'clamp(20px, 3.5dvh, 36px)'
});

export const active = style({});
export const touchPressFeedback = style({});

export const diamond = style({
  opacity: 0,
  flexShrink: 0,
  width: 'clamp(9px, 1.4dvh, 15px)',
  aspectRatio: '1',
  border: '2px solid #ffb061',
  transform: 'rotate(45deg)',
  boxShadow: '0 0 8px #ff8a36b3, inset 0 0 5px #ff8a3666',
  background: '#ffb06112'
});

export const stage = style({
  height: 'clamp(48px, 7.5dvh, 78px)',
  fontSize: 'clamp(18px, 2.7dvh, 28px)',
  letterSpacing: '0.25em',
  paddingLeft: '0.25em'
});

const highlightedBackground = 'radial-gradient(ellipse at center, #ff8c3024, transparent 65%)';
const highlightedLine = {
  content: '""',
  position: 'absolute',
  left: 0,
  right: 0,
  height: 1,
  background:
    'linear-gradient(90deg, transparent 2%, #d75d2080 26%, #ffb061 50%, #d75d2080 74%, transparent 98%)',
  boxShadow: '0 0 9px #ff8d3280'
} as const;

const touchButton = `.${touchPressFeedback} .${button}`;
const touchHighlight = `${touchButton}:enabled:is(:active, :focus-visible, [data-touch-pressed])`;
const selected = `.${active}`;
const selectedOnSp = `${selected}:not(.${touchPressFeedback} *)`;

globalStyle(touchButton, {
  '@media': { [media.sp]: { WebkitTapHighlightColor: 'transparent' } }
});

for (const [selector, mediaQuery] of [
  [selected, `not all and ${media.sp}`],
  [selectedOnSp, media.sp],
  [touchHighlight, media.sp]
]) {
  globalStyle(selector, { '@media': { [mediaQuery]: { background: highlightedBackground } } });
  globalStyle(`${selector}::before`, {
    '@media': { [mediaQuery]: { ...highlightedLine, top: 0 } }
  });
  globalStyle(`${selector}::after`, {
    '@media': { [mediaQuery]: { ...highlightedLine, bottom: 0 } }
  });
  globalStyle(`${selector} .${diamond}`, {
    '@media': { [mediaQuery]: { opacity: 1 } }
  });
}
