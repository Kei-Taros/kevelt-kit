import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { SvxModule } from '$lib/types/content.types';

export const load: PageLoad = async ({ params }) => {
  const modules = import.meta.glob<SvxModule>('/src/content/news/**/*.svx');

  const targetEntry = Object.entries(modules).find(([path]) =>
    path.endsWith(`/${params.slug}.svx`)
  );

  if (!targetEntry) {
    throw error(404, 'News not found');
  }

  const [path, loader] = targetEntry;
  const module = await loader();

  return {
    path,
    metadata: module.metadata,
    component: module.default
  };
};
