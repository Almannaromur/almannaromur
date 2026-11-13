import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Shapes mirror keystatic.config.ts. Keystatic writes the files, Astro reads them.

const news = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: './src/content/news' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      category: z.enum(['frett', 'verkefni', 'vidburdur', 'utgefid']).default('frett'),
      summary: z.string().optional().default(''),
      cover: image().nullish(),
      coverAlt: z.string().optional().default(''),
      calloutText: z.string().optional().default(''),
      calloutLink: z.string().nullish(),
      sideText: z.string().optional().default(''),
      coverPosition: z.string().optional().default(''),
    }),
});

const staff = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/staff' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      titleIs: z.string(),
      titleEn: z.string().optional().default(''),
      noteIs: z.string().optional().default(''),
      noteEn: z.string().optional().default(''),
      bioIs: z.string().optional().default(''),
      bioEn: z.string().optional().default(''),
      email: z.string().optional().default(''),
      photo: image().nullish(),
      order: z.number().nullish(),
    }),
});

// Project pages: files in the repo, one per language. Not editable in Keystatic (yet).
const projects = defineCollection({
  loader: glob({ pattern: '{is,en}/*.mdoc', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      order: z.number(),
      /** Card image on the Verkefni overview. */
      image: image().optional(),
      /** Headline on the project page, one entry per line. Defaults to the title. */
      heroLines: z.array(z.string()).optional(),
      /** Introduction beside the headline. Defaults to the summary. */
      intro: z.string().optional(),
      /** Wide image under the headline. Defaults to the card image. */
      heroImage: image().optional(),
      /** CSS background behind the hero image, when the image is a cut-out. */
      heroBackground: z.string().optional(),
    }),
});

export const collections = { news, staff, projects };
