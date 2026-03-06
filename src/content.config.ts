import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guidesCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/guias' }),
  schema: z.object({
    title: z.string(),
    content: z.string(),
  }),
});

export const collections = {
  guias: guidesCollection,
};
