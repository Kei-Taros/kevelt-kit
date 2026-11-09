import { createVar, keyframes, style, styleVariants } from '@vanilla-extract/css';
import { elementColors } from '$lib/kevat/styles/elementColors';

const color = createVar();
const badgeGlow = `0 0 5px color-mix(in srgb, ${color} 80%, transparent), 0 0 14px color-mix(in srgb, ${color} 55%, transparent), inset 0 0 9px color-mix(in srgb, ${color} 30%, transparent)`;
const expandedBadgeGlow = `0 0 13px 2px color-mix(in srgb, ${color} 85%, transparent), 0 0 27px 4px color-mix(in srgb, ${color} 50%, transparent), inset 0 0 12px color-mix(in srgb, ${color} 40%, transparent)`;
const breatheBadgeGlow = keyframes({
  from: { boxShadow: badgeGlow },
  '50%': { boxShadow: expandedBadgeGlow },
  to: { boxShadow: badgeGlow }
});

export const badge = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'clamp(46.8px, 4.5cqw, 64.8px)',
  aspectRatio: '1',
  boxSizing: 'border-box',
  border: `2px solid ${color}`,
  borderRadius: '50%',
  background: '#070b0e',
  color: '#f5f5f2',
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: 'clamp(14.4px, 1.26cqw, 19.8px)',
  fontWeight: 600,
  letterSpacing: '0.02em',
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
  boxShadow: badgeGlow,
  textShadow: '0 1px 3px #000, 0 0 6px #fff6'
});

export const elementVariants = styleVariants({
  fire: { vars: { [color]: elementColors.fire } },
  stone: { vars: { [color]: elementColors.stone } },
  mist: { vars: { [color]: elementColors.mist } }
});

export const levelThree = style({
  color: '#ffe06a',
  animation: `${breatheBadgeGlow} 1.5s ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
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
