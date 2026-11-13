import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n';

/** News, newest first. */
export async function getNews(): Promise<CollectionEntry<'news'>[]> {
  const entries = await getCollection('news');
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Staff in display order (the "Röðun" field, then name). */
export async function getStaff(): Promise<CollectionEntry<'staff'>[]> {
  const entries = await getCollection('staff');
  return entries.sort(
    (a, b) => (a.data.order ?? 1000) - (b.data.order ?? 1000) || a.data.name.localeCompare(b.data.name, 'is'),
  );
}

export interface Project {
  /** URL slug, shared by both languages. */
  slug: string;
  entry: CollectionEntry<'projects'>;
}

/** Projects for one language, in display order. Entry ids look like "is/kveikja". */
export async function getProjects(locale: Locale): Promise<Project[]> {
  const entries = await getCollection('projects', ({ id }) => id.startsWith(`${locale}/`));
  return entries
    .sort((a, b) => a.data.order - b.data.order)
    .map((entry) => ({ slug: entry.id.slice(locale.length + 1), entry }));
}

/** Slugs that exist in the given language, for linking between language versions. */
export async function getProjectSlugs(locale: Locale): Promise<Set<string>> {
  return new Set((await getProjects(locale)).map((p) => p.slug));
}
