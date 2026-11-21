import { createVar, fallbackVar, keyframes, style } from '@vanilla-extract/css';

const backgroundReveal = { delay: 1000, duration: 900 } as const;

const backgroundDelay = createVar();

export const immediateBackground = style({ vars: { [backgroundDelay]: '0ms' } });

const mistAppear = keyframes({
  from: { opacity: 0, transform: 'scaleX(0.96)', filter: 'blur(6px)' },
  to: { opacity: 1, transform: 'scaleX(1)', filter: 'blur(0)' }
});

const mistDrift = keyframes({
  '0%, 100%': { transform: 'translateX(-12px)' },
  '50%': { transform: 'translateX(12px)' }
});

const mistFadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 }
});

export const backgroundFadeIn = `${mistFadeIn} ${backgroundReveal.duration}ms ease-out ${backgroundReveal.delay}ms both`;

const textAppear = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 }
});

const bannerBackground = [
  'linear-gradient(90deg, transparent 2%, #9cd2ef55 22%, #c6eaffb8 50%, #9cd2ef55 78%, transparent 98%) top / 100% 1px no-repeat',
  'linear-gradient(90deg, transparent 2%, #a6deff77 24%, #f4fdff 50%, #a6deff77 76%, transparent 98%) bottom / 100% 1px no-repeat',
  'radial-gradient(ellipse 18% 6px at 50% 100%, #d5f3ffc0, #76ceff44 45%, transparent 100%)',
  'linear-gradient(90deg, transparent, #02080e55 22%, #02080e77 50%, #02080e55 78%, transparent)'
].join(', ');

export const message = style({
  position: 'relative',
  isolation: 'isolate',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: 'clamp(112px, 16dvh, 110px)',
  margin: 0,
  color: '#f5f5f2',
  fontFamily: '"Yu Mincho", "Hiragino Mincho ProN", "Noto Serif CJK JP", Georgia, serif',
  fontSize: 'clamp(16px, 2.8cqw, 28px)',
  fontWeight: 500,
  lineHeight: 1.45,
  letterSpacing: '0.18em',
  textAlign: 'center',
  textShadow: '0 2px 5px #000c, 0 0 16px #0009',
  whiteSpace: 'nowrap',
  selectors: {
    '&::before': {
      content: "''",
      position: 'absolute',
      inset: 0,
      zIndex: -1,
      pointerEvents: 'none',
      background: bannerBackground,
      maskImage: 'linear-gradient(90deg, transparent, #000 19%, #000 81%, transparent)',
      animation: `${mistAppear} ${backgroundReveal.duration}ms ease-out ${fallbackVar(backgroundDelay, `${backgroundReveal.delay}ms`)} both`
    },
    '&::after': {
      content: "''",
      position: 'absolute',
      inset: '4px 0',
      zIndex: -1,
      pointerEvents: 'none',
      background:
        'radial-gradient(ellipse 28% 32% at 30% 65%, #d7efff14, transparent 100%), radial-gradient(ellipse 36% 26% at 65% 30%, #d7efff12, transparent 100%), radial-gradient(ellipse 48% 20% at 50% 85%, #aedfff12, transparent 100%)',
      filter: 'blur(8px)',
      opacity: 0,
      animation: `${mistFadeIn} ${backgroundReveal.duration}ms ease-out ${fallbackVar(backgroundDelay, `${backgroundReveal.delay}ms`)} both, ${mistDrift} 8s ease-in-out calc(${fallbackVar(backgroundDelay, `${backgroundReveal.delay}ms`)} + ${backgroundReveal.duration}ms) infinite both`
    }
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      selectors: {
        '&::before': { animation: 'none' },
        '&::after': { animation: 'none', opacity: 0.24 }
      }
    }
  }
});

export const line = style({
  display: 'block',
  animation: `${textAppear} 500ms ease-out 1900ms both`,
  selectors: {
    '&:nth-child(2)': { animationDelay: '2450ms' }
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
});

const textDisappear = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 }
});

export const lineFadeOut = style({
  animation: `${textDisappear} 500ms ease-in forwards`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0 }
  }
});
