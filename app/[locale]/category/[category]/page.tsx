import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPostsByCategory, CATEGORIES } from '@/lib/posts';
import { routing } from '@/i18n/routing';
import PostCard from '@/components/PostCard';
import CategoryBadge from '@/components/CategoryBadge';

export function generateStaticParams() {
  const params: { locale: string; category: string }[] = [];
  for (const locale of routing.locales) {
    for (const category of CATEGORIES) {
      params.push({ locale, category });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const t = await getTranslations({ locale, namespace: 'category' });
  const categoryName = t(category as string);

  return {
    title: categoryName,
    description: locale === 'ja'
      ? `${categoryName}の折り紙の折り方一覧`
      : `Origami ${categoryName} folding guides`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;

  if (!CATEGORIES.includes(category as typeof CATEGORIES[number])) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'category' });
  const posts = getPostsByCategory(category, locale);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBF0' }}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* パンくずリスト */}
        <nav className="text-sm mb-6" style={{ color: '#7A5C4E' }}>
          <Link href={`/${locale}`} className="hover:underline">
            {locale === 'ja' ? 'ホーム' : 'Home'}
          </Link>
          <span className="mx-2">/</span>
          <span style={{ color: '#3D2B1F' }}>{t(category as string)}</span>
        </nav>

        <div className="flex items-center gap-3 mb-8">
          <CategoryBadge category={category} locale={locale} />
          <h1 className="text-2xl font-bold" style={{ color: '#3D2B1F' }}>
            {t(category as string)}
          </h1>
          <span className="text-sm" style={{ color: '#7A5C4E' }}>
            ({posts.length})
          </span>
        </div>

        {posts.length === 0 ? (
          <p className="text-center py-16" style={{ color: '#7A5C4E' }}>
            {locale === 'ja' ? 'このカテゴリの記事はまだありません' : 'No articles in this category yet'}
          </p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
