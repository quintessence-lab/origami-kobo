import Fuse, { type IFuseOptions } from 'fuse.js';
import type { PostMeta } from './posts';

let fuseInstance: Fuse<PostMeta> | null = null;

const fuseOptions: IFuseOptions<PostMeta> = {
  keys: [
    { name: 'title', weight: 0.6 },
    { name: 'tags', weight: 0.3 },
    { name: 'category', weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 1,
};

export function createSearchIndex(posts: PostMeta[]): Fuse<PostMeta> {
  fuseInstance = new Fuse(posts, fuseOptions);
  return fuseInstance;
}

export function searchPosts(query: string, posts: PostMeta[]): PostMeta[] {
  if (!query.trim()) return posts;
  const fuse = createSearchIndex(posts);
  const results = fuse.search(query);
  return results.map((r) => r.item);
}
