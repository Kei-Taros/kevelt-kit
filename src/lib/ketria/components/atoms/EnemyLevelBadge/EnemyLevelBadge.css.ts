import { createVar, style, styleVariants } from '@vanilla-extract/css';
import { mobileBattleLayout } from '$lib/ketria/styles/spBattleLayout';
import { media } from '$lib/styles/breakpoints';
import { elementColors } from '$lib/ketria/styles/elementColors';

const color = createVar();
const outline = 'polygon(16% 0, 84% 0, 100% 25%, 100% 75%, 84% 100%, 16% 100%, 0 75%, 0 25%)';

export const badge = style({
  position: 'relative',
  isolation: 'isolate',
  width: 'clamp(46.2px, 4.18cqw, 61.6px)',
  boxSizing: 'border-box',
  marginTop: '-3px',
  padding: '6.6px 9.9px',
  color: '#f5f5f2',
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: 'clamp(14.3px, 1.155cqw, 17.6px)',
  fontWeight: 600,
  lineHeight: 1,
  textAlign: 'center',
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
  filter: `drop-shadow(0 0 3px color-mix(in srgb, ${color} 80%, transparent)) drop-shadow(0 0 6px color-mix(in srgb, ${color} 35%, transparent))`,
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      clipPath: outline,
      pointerEvents: 'none',
      inset: 0,
      zIndex: -2,
      background: color
    },
    '&::after': {
      content: '',
      position: 'absolute',
      clipPath: outline,
      pointerEvents: 'none',
      inset: '1.5px',
      zIndex: -1,
      background: '#070b0ef5',
      boxShadow: `inset 0 0 7px color-mix(in srgb, ${color} 30%, transparent)`
    }
  },
  '@media': {
    [media.sp]: {
      width: mobileBattleLayout.enemyLevel.width,
      marginTop: mobileBattleLayout.enemyLevel.badgeOffset,
      padding: mobileBattleLayout.enemyLevel.padding,
      fontSize: mobileBattleLayout.enemyLevel.fontSize
    }
  }
});

export const elementVariants = styleVariants({
  fire: { vars: { [color]: elementColors.fire } },
  stone: { vars: { [color]: elementColors.stone } },
  mist: { vars: { [color]: elementColors.mist } }
});

export const levelThree = style({
  color: '#ffe06a'
});

export const levelZero = style({
  vars: { [color]: '#9ba2a8' },
  color: '#c8ced3'
});

export const digit = style({
  display: 'inline-block',
  width: '1ch',
  textAlign: 'center'
});
