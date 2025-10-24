import { defineCollection, z } from 'astro:content';

const readmeCollection = defineCollection({
  type: 'content',
  schema: z.object({
    lang: z.string(),
    title: z.string().optional()
  })
});

export const collections = {
  'readme': readmeCollection
};