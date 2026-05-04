import type { PageLoad } from './$types';
import type { SvxModule } from '$lib/types/content.types';
import type { NewsData } from '$lib/types/news.types';
import { NO_DATA_IMAGE } from '$lib/constants/images';

export const load: PageLoad = async () => {
  const modules = import.meta.glob<SvxModule>('/src/content/news/**/*.svx', {
    eager: true
  });

  const getSlugFromPath = (path: string) => path.split('/').pop()?.replace('.svx', '') ?? '';

  const newsList: NewsData[] = Object.entries(modules)
    .filter(([path, module]) => {
      const slug = getSlugFromPath(path);
      return module.metadata.published && slug !== 'yyyymmdd';
    })
    .sort(([pathA], [pathB]) => Number(getSlugFromPath(pathB)) - Number(getSlugFromPath(pathA)))
    .map(([path, module]) => {
      const slug = getSlugFromPath(path);

      return {
        title: module.metadata.title,
        date: module.metadata.date,
        href: `/news/${slug}`,
        src: module.metadata.thumbnail
          ? {
              webp: `${module.metadata.thumbnail}.webp`,
              png: `${module.metadata.thumbnail}.png`
            }
          : { webp: NO_DATA_IMAGE.webp, png: NO_DATA_IMAGE.png }
      };
    });

  return {
    newsList
  };
};
