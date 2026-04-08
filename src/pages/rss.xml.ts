import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const essays = await getCollection('essays', ({ data }) => !data.draft);

  return rss({
    title: 'Jeevan M R',
    description: 'Philosopher-Engineer. Refactoring life, one commit at a time.',
    site: context.site!,
    items: essays
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((essay) => ({
        title: essay.data.title,
        pubDate: essay.data.date,
        link: `/essays/${essay.slug}/`,
      })),
  });
}
