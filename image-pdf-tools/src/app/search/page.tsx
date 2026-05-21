'use client';

import { useState, useMemo } from 'react';
import { ToolCard } from '@/components/shared/ToolCard';
import { ALL_TOOLS } from '@/lib/tools-data';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_TOOLS.filter(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some(k => k.includes(q)) ||
        t.subcategory.includes(q)
    );
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Search Tools
        </h1>
        <div className="relative max-w-xl mx-auto">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for tools... (e.g., compress, resize, merge)"
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-sm"
            autoFocus
          />
        </div>
      </div>

      {query && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {results.length} {results.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}

      {query && results.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No tools found</h2>
          <p className="text-sm text-gray-500">Try different keywords or browse all tools</p>
        </div>
      )}

      {!query && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Start typing to search through {ALL_TOOLS.length}+ tools
          </p>
        </div>
      )}
    </div>
  );
}
