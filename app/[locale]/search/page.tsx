'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import PostCard from '@/components/PostCard';
import type { PostMeta } from '@/lib/posts';

export default function SearchPage() {
  const locale = useLocale();
  const t = useTranslations('search');
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const [results, setResults] = useState<PostMeta[]>([]);
  const [allPosts, setAllPosts] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/${locale}/api/posts`)
      .then((res) => res.json())
      .then((data: PostMeta[]) => {
        setAllPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [locale]);

  useEffect(() => {
    if (!query.trim() || allPosts.length === 0) {
      setResults(query.trim() ? [] : allPosts);
      return;
    }

    import('@/lib/search').then(({ searchPosts }) => {
      setResults(searchPosts(query, allPosts));
    });
  }, [query, allPosts]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBF0' }}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#3D2B1F' }}>
          {t('title')}
        </h1>

        <div className="max-w-md mb-8">
          <SearchBar locale={locale} initialQuery={query} />
        </div>

        {loading ? (
          <p className="text-center py-16" style={{ color: '#7A5C4E' }}>
            {t('searching')}
          </p>
        ) : (
          <>
            {query && (
              <p className="text-sm mb-6" style={{ color: '#7A5C4E' }}>
                {results.length} {t('results')}
              </p>
            )}

            {query && results.length === 0 ? (
              <p className="text-center py-16" style={{ color: '#7A5C4E' }}>
                {t('noResults')}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.map((post) => (
                  <PostCard
                    key={post.slug}
                    slug={post.slug}
                    title={post.title}
                    category={post.category}
                    difficulty={post.difficulty}
                    time={post.time}
                    excerpt={post.excerpt}
                    image={post.image}
                    locale={locale}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
