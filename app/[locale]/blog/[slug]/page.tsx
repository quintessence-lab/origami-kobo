import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getPostBySlug, getPostSlugs } from '@/lib/posts';
import { routing } from '@/i18n/routing';
import CategoryBadge from '@/components/CategoryBadge';
import ShareButtons from '@/components/ShareButtons';
import AffiliateBox from '@/components/AffiliateBox';
import { MDXRemote } from 'next-mdx-remote/rsc';

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    const slugs = getPostSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);
  if (!post) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://origami-kobo.com';
  const imageUrl = `${siteUrl}${post.image}`;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
      images: [{ url: imageUrl, width: 200, height: 200, alt: post.title }],
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);
  const t = await getTranslations({ locale, namespace: 'blog' });

  if (!post) notFound();

  const difficultyColor: Record<string, string> = {
    初級: '#7B9E6B',
    中級: '#F5C518',
    上級: '#E07B54',
    beginner: '#7B9E6B',
    intermediate: '#F5C518',
    advanced: '#E07B54',
  };
  const diffColor = difficultyColor[post.difficulty] ?? '#7B9E6B';

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://origami-kobo.com';
  const postUrl = `${siteUrl}/${locale}/blog/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: `${siteUrl}${post.image}`,
    datePublished: post.date,
    url: postUrl,
    inLanguage: locale,
    author: {
      '@type': 'Organization',
      name: locale === 'ja' ? '折り紙工房' : 'Origami Kobo',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: locale === 'ja' ? 'ホーム' : 'Home', item: `${siteUrl}/${locale}` },
      { '@type': 'ListItem', position: 2, name: locale === 'ja' ? '記事一覧' : 'Articles', item: `${siteUrl}/${locale}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title },
    ],
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBF0' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* パンくずリスト */}
        <nav className="text-sm mb-6" style={{ color: '#7A5C4E' }}>
          <Link href={`/${locale}`} className="hover:underline">
            {locale === 'ja' ? 'ホーム' : 'Home'}
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/blog`} className="hover:underline">
            {t('title')}
          </Link>
          <span className="mx-2">/</span>
          <span style={{ color: '#3D2B1F' }}>{post.title}</span>
        </nav>

        {/* ヒーロー画像 */}
        <div
          className="flex items-center justify-center rounded-2xl mb-8 py-8"
          style={{ backgroundColor: '#FFF5EC' }}
        >
          <Image
            src={post.image ?? `/images/origami/${slug}.svg`}
            alt={post.title}
            width={200}
            height={200}
            unoptimized
            className="w-40 h-40 md:w-52 md:h-52 object-contain"
          />
        </div>

        {/* 記事ヘッダー */}
        <header className="mb-8">
          <div className="mb-3">
            <CategoryBadge category={post.category} locale={locale} linkable />
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold mb-4 leading-tight"
            style={{ color: '#3D2B1F' }}
          >
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm" style={{ color: '#7A5C4E' }}>
            <span
              className="px-2.5 py-0.5 rounded-full font-semibold text-xs"
              style={{ backgroundColor: `${diffColor}20`, color: diffColor }}
            >
              {post.difficulty}
            </span>
            <span className="flex items-center gap-1">⏱ {post.time}</span>
            <span>{post.date}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#F0E6D9', color: '#7A5C4E' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 記事本文 */}
        <article
          className="prose prose-sm max-w-none mb-8"
          style={{
            ['--tw-prose-headings' as string]: '#3D2B1F',
            ['--tw-prose-body' as string]: '#4A3728',
            ['--tw-prose-bold' as string]: '#3D2B1F',
            ['--tw-prose-bullets' as string]: '#E07B54',
            ['--tw-prose-counters' as string]: '#E07B54',
          }}
        >
          <MDXRemote source={post.content} />
        </article>

        {/* アフィリエイト */}
        {post.affiliate && <AffiliateBox locale={locale} />}

        {/* シェアボタン */}
        <ShareButtons title={post.title} url={postUrl} />

        {/* 記事一覧へ戻る */}
        <div className="mt-10 pt-6" style={{ borderTop: '1px solid #E8D5C4' }}>
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
            style={{ color: '#E07B54' }}
          >
            ← {t('title')}
          </Link>
        </div>
      </div>
    </div>
  );
}
