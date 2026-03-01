import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMeta {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  difficulty: string;
  time: string;
  affiliate: boolean;
  date: string;
  excerpt?: string;
  image?: string;
}

export interface Post extends PostMeta {
  content: string;
}

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

export function getPostSlugs(locale: string): string[] {
  const dir = path.join(postsDirectory, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export function getPostBySlug(slug: string, locale: string): Post | null {
  const filePath = path.join(postsDirectory, locale, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title ?? '',
    category: data.category ?? '',
    tags: data.tags ?? [],
    difficulty: data.difficulty ?? '',
    time: data.time ?? '',
    affiliate: data.affiliate ?? true,
    date: data.date ?? '',
    excerpt: data.excerpt ?? content.slice(0, 120).replace(/[#\n]/g, ' ').trim(),
    image: data.image ?? `/images/origami/${slug}.svg`,
    content,
  };
}

export function getAllPosts(locale: string): Post[] {
  const slugs = getPostSlugs(locale);
  return slugs
    .map((slug) => getPostBySlug(slug, locale))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostsByCategory(category: string, locale: string): Post[] {
  return getAllPosts(locale).filter((post) => post.category === category);
}

export function getAllCategories(locale: string): string[] {
  const posts = getAllPosts(locale);
  const categories = new Set(posts.map((p) => p.category));
  return Array.from(categories);
}

export const CATEGORIES = [
  'animals',
  'flowers',
  'food',
  'vehicles',
  'items',
  'geometric',
  'seasonal',
] as const;

export type Category = (typeof CATEGORIES)[number];
