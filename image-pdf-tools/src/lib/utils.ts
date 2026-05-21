import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getCompressionPercentage(original: number, compressed: number): number {
  return Math.round(((original - compressed) / original) * 100);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const SITE_CONFIG = {
  name: 'ToolsPro',
  description: 'Free Professional Image & PDF Tools - Compress, Resize, Convert & More',
  url: 'https://toolspro.com',
  ogImage: '/og-image.png',
  creator: 'ToolsPro Team',
  keywords: [
    'image compressor',
    'pdf compressor',
    'image resizer',
    'pdf merger',
    'image converter',
    'online tools',
    'free tools',
  ],
};
