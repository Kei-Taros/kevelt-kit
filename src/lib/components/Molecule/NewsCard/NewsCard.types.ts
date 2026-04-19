import type { ImgSrc } from '$lib/types/image.types';

export type NewsCardItem = {
  title: string;
  date: string;
  src?: ImgSrc;
  href: string;
};
