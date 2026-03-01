import { getTranslations } from 'next-intl/server';
import { getAllPosts, CATEGORIES } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import CategoryBadge from '@/components/CategoryBadge';

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const posts = getAllPosts(locale);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBF0' }}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#3D2B1F' }}>
          {t('title')}
        </h1>
        <p className="text-sm mb-8" style={{ color: '#7A5C4E' }}>
          {posts.length} {t('allPosts')}
        </p>

        {/* カテゴリフィルター */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <CategoryBadge key={cat} category={cat} locale={locale} linkable />
          ))}
        </div>

        {/* 記事グリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
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
      </div>
    </div>
  );
}
