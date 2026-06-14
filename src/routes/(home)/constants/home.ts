import type { CarouselItem } from '$lib/types/carousel.types';

export const TOP_MESSAGE = '一旦やってみる';
export const MIDDLE_MESSAGE_1 = '難しいことは';
export const MIDDLE_MESSAGE_2 = 'それから考えよう';
export const BOTTOM_MESSAGE = 'Try first. Think later.';

export const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: 6,
    src: {
      webp: '/images/works/work-6.webp',
      png: '/images/works/work-6.png'
    },
    title: 'ファッション向けECサイト開発'
  },
  {
    id: 5,
    src: {
      webp: '/images/works/work-5.webp',
      png: '/images/works/work-5.png'
    },
    title: '法務業務向けWebサービス開発'
  },
  {
    id: 4,
    src: {
      webp: '/images/works/work-4.webp',
      png: '/images/works/work-4.png'
    },
    title: '自販機向け電子決済システム開発'
  },
  {
    id: 3,
    src: {
      webp: '/images/works/work-3.webp',
      png: '/images/works/work-3.png'
    },
    title: '水道事業者向けコーポレートサイト開発'
  },
  {
    id: 2,
    src: {
      webp: '/images/works/work-2.webp',
      png: '/images/works/work-2.png'
    },
    title: 'Bluetoothヘッドホン組込み開発'
  },
  {
    id: 1,
    src: {
      webp: '/images/works/work-1.webp',
      png: '/images/works/work-1.png'
    },
    title: '動画制作'
  }
];
