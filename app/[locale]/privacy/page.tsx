import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy',
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBF0' }}>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-sm mb-6" style={{ color: '#7A5C4E' }}>
          <Link href={`/${locale}`} className="hover:underline">
            {locale === 'ja' ? 'ホーム' : 'Home'}
          </Link>
          <span className="mx-2">/</span>
          <span style={{ color: '#3D2B1F' }}>
            {locale === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy'}
          </span>
        </nav>

        <h1 className="text-2xl font-bold mb-8" style={{ color: '#3D2B1F' }}>
          {locale === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy'}
        </h1>

        <div
          className="prose prose-sm max-w-none"
          style={{ color: '#4A3728' }}
        >
          {locale === 'ja' ? (
            <>
              <h2>個人情報の取り扱いについて</h2>
              <p>
                折り紙工房（以下「当サイト」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。
              </p>

              <h2>アクセス解析ツールについて</h2>
              <p>
                当サイトでは、Googleが提供するアクセス解析ツール「Google Analytics」を使用しています。
                Google Analyticsはデータの収集のためにCookieを使用します。
                このデータは匿名で収集されており、個人を特定するものではありません。
              </p>
              <p>
                Cookieを無効にすることでデータの収集を拒否できます。
                お使いのブラウザの設定をご確認ください。
              </p>

              <h2>アフィリエイトプログラムについて</h2>
              <p>
                当サイトは、Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、
                Amazonアソシエイト・プログラムの参加者です。
              </p>

              <h2>免責事項</h2>
              <p>
                当サイトの情報は可能な限り正確を期していますが、情報の正確性や安全性を保証するものではありません。
                当サイトの利用によって生じたいかなる損害についても責任を負いません。
              </p>

              <h2>お問い合わせ</h2>
              <p>
                プライバシーポリシーに関するお問い合わせは、サイト運営者までご連絡ください。
              </p>
            </>
          ) : (
            <>
              <h2>Handling of Personal Information</h2>
              <p>
                Origami Kobo (&quot;this site&quot;) respects user privacy and strives to protect personal information.
              </p>

              <h2>Analytics Tools</h2>
              <p>
                This site uses Google Analytics, a web analytics service provided by Google.
                Google Analytics uses cookies to collect data.
                This data is collected anonymously and does not identify individuals.
              </p>
              <p>
                You can refuse data collection by disabling cookies in your browser settings.
              </p>

              <h2>Affiliate Programs</h2>
              <p>
                This site participates in the Amazon Associates Program, an affiliate advertising program
                designed to provide a means for sites to earn referral fees by advertising and linking to Amazon.co.jp.
              </p>

              <h2>Disclaimer</h2>
              <p>
                While we strive for accuracy, we do not guarantee the accuracy or safety of information on this site.
                We are not responsible for any damages resulting from the use of this site.
              </p>

              <h2>Contact</h2>
              <p>
                For inquiries about this privacy policy, please contact the site administrator.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
