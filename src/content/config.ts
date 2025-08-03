// Import utilities from 'astro:content'
import { z, defineCollection } from 'astro:content';

const guidesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    content: z.string()
  })
})

export const collections = {
  guias: guidesCollection
}