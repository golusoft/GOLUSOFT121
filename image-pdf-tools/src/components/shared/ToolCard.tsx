import Link from 'next/link';
import { Tool } from '@/lib/tools-data';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: Tool;
  compact?: boolean;
}

export function ToolCard({ tool, compact = false }: ToolCardProps) {
  return (
    <Link
      href={`/tools/${tool.category}/${tool.slug}`}
      className={cn(
        'group relative flex flex-col p-5 rounded-2xl border border-gray-200/60 dark:border-gray-700/60',
        'bg-white dark:bg-gray-800/50 hover:bg-gradient-to-br hover:from-brand-50 hover:to-purple-50',
        'dark:hover:from-brand-950/20 dark:hover:to-purple-950/20',
        'hover:border-brand-200 dark:hover:border-brand-700',
        'hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300',
        'hover:-translate-y-0.5'
      )}
    >
      {tool.trending && (
        <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">
          TRENDING
        </span>
      )}
      {tool.new && (
        <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
          NEW
        </span>
      )}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-purple-100 dark:from-brand-900/30 dark:to-purple-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
        {tool.name}
      </h3>
      {!compact && (
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {tool.shortDescription}
        </p>
      )}
    </Link>
  );
}
