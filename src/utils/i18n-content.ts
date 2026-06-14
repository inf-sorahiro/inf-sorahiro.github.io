import { getCollection } from 'astro:content';
import type { Locale } from '../i18n/utils';

export async function getBlogPosts(locale: Locale) {
  return getCollection('blog', ({ data }) => data.lang === locale);
}

export async function getWeeklyPosts(locale: Locale) {
  return getCollection('weekly', ({ data }) => data.lang === locale);
}

export async function getBlogStaticPaths(locale: Locale) {
  const posts = await getCollection('blog', ({ data }) => data.lang === locale);
  return posts.map((post) => ({
    params: { slug: post.id.split('/')[0] },
  }));
}

export async function getWeeklyStaticPaths(locale: Locale) {
  const posts = await getCollection('weekly', ({ data }) => data.lang === locale);
  return posts.map((post) => ({
    params: { slug: post.id.split('/')[0] },
  }));
}

export async function getCategoryStaticPaths(locale: Locale) {
  const posts = await getCollection('blog', ({ data }) => data.lang === locale);
  const categories = new Set<string>();
  for (const post of posts) {
    const cat = post.data.category;
    if (!cat) continue;
    categories.add(cat);
    if (cat.includes('/')) {
      const parts = cat.split('/');
      for (let i = 0; i < parts.length; i++) {
        categories.add(parts.slice(0, i + 1).join('/'));
      }
    }
  }
  return Array.from(categories).map((cat) => ({ params: { category: cat } }));
}

export async function getTagStaticPaths(locale: Locale) {
  const posts = await getCollection('blog', ({ data }) => data.lang === locale);
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.data.tags || []) {
      tags.add(tag);
    }
  }
  return Array.from(tags).map((tag) => ({ params: { tag } }));
}

export async function getPageStaticPaths(locale: Locale, pageSize: number) {
  const posts = await getCollection('blog', ({ data }) => data.lang === locale);
  const totalPages = Math.ceil(posts.length / pageSize);
  const pages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
  return pages.map((page) => ({
    params: { page: String(page) },
  }));
}
