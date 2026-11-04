import { createVar, style, styleVariants } from '@vanilla-extract/css';
import { elementColors } from '$lib/kevat/styles/elementColors';

const color = createVar();

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
  boxShadow: `0 0 5px color-mix(in srgb, ${color} 80%, transparent), 0 0 14px color-mix(in srgb, ${color} 55%, transparent), inset 0 0 9px color-mix(in srgb, ${color} 30%, transparent)`,
  textShadow: '0 1px 3px #000, 0 0 6px #fff6'
});

export const elementVariants = styleVariants({
  fire: { vars: { [color]: elementColors.fire } },
  stone: { vars: { [color]: elementColors.stone } },
  mist: { vars: { [color]: elementColors.mist } }
});

export const digit = style({
  display: 'inline-block',
  width: '1ch',
  textAlign: 'center'
});
