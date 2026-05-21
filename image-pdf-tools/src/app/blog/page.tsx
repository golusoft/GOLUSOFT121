import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Blog - Tips, Tutorials & Guides',
  description: 'Learn image optimization, PDF management, and file processing tips from our expert guides and tutorials.',
};

const BLOG_POSTS = [
  {
    slug: 'how-to-compress-images-without-losing-quality',
    title: 'How to Compress Images Without Losing Quality',
    excerpt: 'Learn the science behind image compression and how to reduce file sizes by 80% while maintaining visual quality.',
    category: 'Image Tips',
    date: 'January 15, 2025',
    readTime: '5 min read',
  },
  {
    slug: 'best-image-formats-for-web',
    title: 'Best Image Formats for the Web in 2025',
    excerpt: 'WebP vs AVIF vs JPEG — which format should you use? A comprehensive comparison of modern image formats.',
    category: 'Guides',
    date: 'January 10, 2025',
    readTime: '7 min read',
  },
  {
    slug: 'reduce-pdf-size-for-email',
    title: 'How to Reduce PDF Size for Email Attachments',
    excerpt: 'Most email services limit attachments to 25MB. Learn how to compress PDFs to fit within email limits.',
    category: 'PDF Tips',
    date: 'January 5, 2025',
    readTime: '4 min read',
  },
  {
    slug: 'passport-photo-requirements-guide',
    title: 'Complete Passport Photo Requirements Guide (2025)',
    excerpt: 'Photo requirements for US, UK, India, EU, and 50+ countries. Dimensions, DPI, background rules explained.',
    category: 'Guides',
    date: 'December 28, 2024',
    readTime: '8 min read',
  },
  {
    slug: 'batch-image-processing-tips',
    title: 'Batch Image Processing: Save Hours of Work',
    excerpt: 'How to resize, compress, and convert hundreds of images at once using our batch processing tools.',
    category: 'Tutorials',
    date: 'December 20, 2024',
    readTime: '6 min read',
  },
  {
    slug: 'image-seo-optimization',
    title: 'Image SEO: Optimize Images for Google Rankings',
    excerpt: 'File size, format, alt text, and loading speed — everything you need to know about image SEO.',
    category: 'SEO',
    date: 'December 15, 2024',
    readTime: '6 min read',
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Blog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Tips, tutorials, and guides for image and PDF optimization
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLOG_POSTS.map(post => (
          <article
            key={post.slug}
            className="glass-card p-6 flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full">
                {post.category}
              </span>
              <span className="text-xs text-gray-400">{post.readTime}</span>
            </div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {post.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{post.date}</span>
              <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                Read more →
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
