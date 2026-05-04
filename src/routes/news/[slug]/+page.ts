import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { SvxModule, NewsEntry } from '$lib/types/content.types';
import { NO_DATA_IMAGE } from '$lib/constants/images';

const NEWS_NAVIGATION_OFFSET = 1;

const getSlugFromPath = (path: string) => path.split('/').pop()?.replace('.svx', '') ?? '';

export const load: PageLoad = async ({ params }) => {
  const modules = import.meta.glob<SvxModule>('/src/content/news/**/*.svx');

  const metadataModules = import.meta.glob<SvxModule>('/src/content/news/**/*.svx', {
    eager: true
  });

  const entries = Object.entries(metadataModules).map(([path, module]) => {
    const slug = getSlugFromPath(path);

    return {
      path,
      slug,
      metadata: module.metadata
    };
  });

  const publishedEntries = entries.filter(
    (entry) => entry.metadata.published && entry.slug !== 'yyyymmdd'
  );

  const sortedEntries = [...publishedEntries].sort(
    (a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  );

  const currentIndex = sortedEntries.findIndex((entry) => entry.slug === params.slug);

  if (currentIndex === -1) {
    throw error(404, 'News not found');
  }

  const previousIndex = currentIndex - NEWS_NAVIGATION_OFFSET;
  const nextIndex = currentIndex + NEWS_NAVIGATION_OFFSET;

  const currentEntry = sortedEntries[currentIndex];
  const previousEntry = sortedEntries[previousIndex];
  const nextEntry = sortedEntries[nextIndex];

  const currentLoader = modules[currentEntry.path];

  if (!currentLoader) {
    throw error(404, 'News not found');
  }

  const currentModule = await currentLoader();

  const createNewsLink = (entry: NewsEntry | undefined) => {
    if (entry == null) return null;

    return {
      slug: entry.slug,
      title: entry.metadata.title
    };
  };

  return {
    path: currentEntry.path,
    metadata: currentEntry.metadata,
    component: currentModule.default,
    src: currentEntry.metadata.thumbnail
      ? {
          webp: `${currentEntry.metadata.thumbnail}.webp`,
          png: `${currentEntry.metadata.thumbnail}.png`
        }
      : {
          webp: NO_DATA_IMAGE.webp,
          png: NO_DATA_IMAGE.png
        },
    previousNews: createNewsLink(previousEntry),
    nextNews: createNewsLink(nextEntry)
  };
};
