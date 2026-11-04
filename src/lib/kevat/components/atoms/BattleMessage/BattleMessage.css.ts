import { style } from '@vanilla-extract/css';

export const message = style({
  position: 'relative',
  isolation: 'isolate',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: 'clamp(128px, 18cqw, 220px)',
  margin: 0,
  color: '#f5f5f2',
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: 'clamp(16px, 1.8cqw, 36px)',
  fontWeight: 600,
  lineHeight: 1.8,
  letterSpacing: '0.16em',
  textAlign: 'center',
  textShadow: '0 2px 6px #000, 0 0 18px #000',
  whiteSpace: 'nowrap',
  selectors: {
    '&::before': {
      content: "''",
      position: 'absolute',
      inset: 0,
      zIndex: -1,
      pointerEvents: 'none',
      background:
        'radial-gradient(ellipse at center, #05090de6 0%, #080d10b8 42%, transparent 76%), linear-gradient(90deg, transparent 0%, #02050780 18%, #02050780 82%, transparent 100%)',
      filter: 'blur(10px)'
    }
  }
});

export const line = style({
  display: 'block'
});
