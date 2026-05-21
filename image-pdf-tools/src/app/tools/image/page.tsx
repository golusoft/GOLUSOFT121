import { Metadata } from 'next';
import { ToolCard } from '@/components/shared/ToolCard';
import { IMAGE_TOOLS } from '@/lib/tools-data';
import { SITE_CONFIG } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Free Online Image Tools - Compress, Resize, Convert & More',
  description: 'Professional image tools: compress to any size, resize with presets, convert formats, crop, watermark, and more. Free, fast, no signup.',
  alternates: { canonical: `${SITE_CONFIG.url}/tools/image` },
};

export default function ImageToolsPage() {
  const categories = [
    { key: 'compression', label: 'Compression' },
    { key: 'resize', label: 'Resize' },
    { key: 'conversion', label: 'Conversion' },
    { key: 'editing', label: 'Editing' },
    { key: 'filters', label: 'Filters & Effects' },
    { key: 'utility', label: 'Utilities' },
    { key: 'generator', label: 'Generators' },
    { key: 'specialized', label: 'Specialized' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Image Tools
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {IMAGE_TOOLS.length}+ professional image tools. Compress, resize, convert, edit, and optimize images online.
        </p>
      </div>

      {categories.map(cat => {
        const tools = IMAGE_TOOLS.filter(t => t.subcategory === cat.key);
        if (tools.length === 0) return null;
        return (
          <section key={cat.key} id={cat.key} className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {cat.label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
