import type { StageId } from '../types/stage.types';

const elements = ['fire', 'stone', 'mist'] as const;
const battleAssets = [
  ...elements.map((element) => `/images/ketria/element-ring/${element}-ring`),
  '/images/ketria/effects/mist-effect',
  '/images/ketria/effects/stone-effect'
];

const decodeImage = (image: HTMLImageElement): Promise<void> => {
  if (typeof image.decode === 'function') return image.decode();
  if (image.complete) return image.naturalWidth > 0 ? Promise.resolve() : Promise.reject();
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      image.removeEventListener('load', loaded);
      image.removeEventListener('error', failed);
    };
    const loaded = () => {
      cleanup();
      resolve();
    };
    const failed = () => {
      cleanup();
      reject(new Error('Image load failed'));
    };
    image.addEventListener('load', loaded, { once: true });
    image.addEventListener('error', failed, { once: true });
  });
};

const preload = async (src: string, fallback?: string): Promise<void> => {
  const image = new Image();
  image.src = src;
  try {
    await decodeImage(image);
  } catch (error) {
    if (!fallback) throw error;
    image.src = fallback;
    await decodeImage(image);
  }
};

export const loadScreenAssets = async (
  container: HTMLElement,
  isBattle: boolean,
  stage?: StageId
): Promise<void> => {
  const pending = Array.from(container.querySelectorAll('img'), decodeImage);
  if (isBattle) {
    pending.push(...battleAssets.map((path) => preload(`${path}.webp`, `${path}.png`)));
    pending.push(
      preload('/images/ketria/effects/sparks.webp', '/images/ketria/effects/sparks.svg')
    );
  }
  if (stage === '03') {
    pending.push(
      preload(
        '/images/ketria/enemy/enemy-03-phase2.webp',
        '/images/ketria/enemy/enemy-03-phase2.png'
      )
    );
  }
  if (stage === '04') {
    pending.push(
      preload(
        '/images/ketria/enemy/enemy-04-phase2.webp',
        '/images/ketria/enemy/enemy-04-phase2.png'
      ),
      preload(
        '/images/ketria/backgrounds/background-04-phase2.webp',
        '/images/ketria/backgrounds/background-04-phase2.png'
      )
    );
  }
  await Promise.allSettled(pending);
};
