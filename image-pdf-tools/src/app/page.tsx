import Link from 'next/link';
import { ToolCard } from '@/components/shared/ToolCard';
import { IMAGE_TOOLS, PDF_TOOLS, getPopularTools, getTrendingTools, TOOL_CATEGORIES } from '@/lib/tools-data';
import { generateOrganizationJsonLd } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/utils';

export default function HomePage() {
  const popularTools = getPopularTools(12);
  const trendingTools = getTrendingTools(6);

  const orgJsonLd = generateOrganizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100/80 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-medium mb-6 backdrop-blur-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              100% Free &bull; No Signup &bull; No Watermarks
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Professional{' '}
              <span className="gradient-text">Image & PDF</span>
              {' '}Tools
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Compress, resize, convert, and edit images and PDFs instantly. Enterprise-grade tools with zero compromise on quality.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/tools/image"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                Image Tools
              </Link>
              <Link
                href="/tools/pdf"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold hover:border-brand-300 dark:hover:border-brand-600 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                PDF Tools
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No file limits
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Batch processing
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Ultra-fast
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Trending Tools
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Most popular tools right now</p>
          </div>
          <Link href="/tools" className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} compact />
          ))}
        </div>
      </section>

      {/* Popular Tools */}
      <section className="bg-gray-50/50 dark:bg-gray-900/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              All Popular Tools
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Professional-grade tools for every image and PDF task. No signup, no limits, always free.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {popularTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 text-gray-900 dark:text-white font-medium transition-all hover:shadow-md"
            >
              Browse All {IMAGE_TOOLS.length + PDF_TOOLS.length}+ Tools
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Tool Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {TOOL_CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              href={`/tools#${cat.slug}`}
              className="flex flex-col items-center p-5 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800/50 hover:border-brand-200 dark:hover:border-brand-700 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                {cat.name}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {cat.count} tools
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50/50 dark:bg-gray-900/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Why Choose {SITE_CONFIG.name}?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Ultra-Fast Processing', desc: 'Enterprise-grade servers process your files in milliseconds, not seconds.', icon: '⚡' },
              { title: 'No Signup Required', desc: 'Start using tools immediately. No account, no email, no friction.', icon: '🔓' },
              { title: 'Batch Processing', desc: 'Process hundreds of files simultaneously with ZIP download.', icon: '📦' },
              { title: 'Privacy First', desc: 'Files are processed and automatically deleted. We never store your data.', icon: '🛡️' },
              { title: 'Mobile Optimized', desc: 'Every tool works flawlessly on phones and tablets.', icon: '📱' },
              { title: 'Advanced Controls', desc: 'Professional settings for power users. Presets for everyone else.', icon: '⚙️' },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto prose dark:prose-invert">
          <h2>Free Online Image & PDF Tools</h2>
          <p>
            {SITE_CONFIG.name} provides the most comprehensive collection of free online image and PDF tools.
            Whether you need to compress images to a specific file size, resize photos for social media,
            convert between formats, merge PDF files, or extract pages — our tools handle it all with
            professional-grade quality.
          </p>
          <h3>Compress Image Online</h3>
          <p>
            Our smart image compressor lets you reduce image file size to any target KB or MB value.
            Use the quality slider for precise control, or let our adaptive compression algorithm find
            the perfect balance between size and quality. Supports batch processing with ZIP download.
          </p>
          <h3>PDF Tools Online</h3>
          <p>
            Merge, split, compress, and convert PDF files with our enterprise-grade PDF toolkit.
            All processing happens securely with automatic file deletion. No signup required.
          </p>
        </div>
      </section>
    </>
  );
}
