import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, CATEGORIES } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import CategoryBadge from '@/components/CategoryBadge';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const posts = getAllPosts(locale);
  const latestPosts = posts.slice(0, 6);

  return (
    <div style={{ backgroundColor: '#FFFBF0' }}>
      {/* ヒーローセクション */}
      <section
        className="py-16 md:py-24 text-center"
        style={{
          background: 'linear-gradient(135deg, #FFFBF0 0%, #FFF0E0 50%, #FFE8D6 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <Image
            src="/images/origami/crane.svg"
            alt="Origami Crane"
            width={200}
            height={200}
            unoptimized
            className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-2"
          />
          <h1
            className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
            style={{ color: '#3D2B1F' }}
          >
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl mb-3 font-medium" style={{ color: '#E07B54' }}>
            {t('subtitle')}
          </p>
          <p className="text-sm md:text-base max-w-xl mx-auto" style={{ color: '#7A5C4E' }}>
            {t('heroDescription')}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* カテゴリ一覧 */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: '#3D2B1F' }}>
              {t('categories')}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <CategoryBadge key={cat} category={cat} locale={locale} linkable />
            ))}
          </div>
        </section>

        {/* 新着記事 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: '#3D2B1F' }}>
              {t('latestPosts')}
            </h2>
            <Link
              href={`/${locale}/blog`}
              className="text-sm font-medium hover:underline"
              style={{ color: '#E07B54' }}
            >
              {t('viewAll')} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestPosts.map((post) => (
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
        </section>
      </div>
    </div>
  );
}
