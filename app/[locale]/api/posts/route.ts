import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const posts = getAllPosts(locale);

  const postMetas = posts.map(({ content, ...meta }) => meta);

  return NextResponse.json(postMetas);
}
