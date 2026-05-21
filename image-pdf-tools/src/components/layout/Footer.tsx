import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/utils';

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-bold gradient-text">{SITE_CONFIG.name}</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Free professional image and PDF tools. No signup required. Fast, secure, and reliable.
            </p>
          </div>

          {/* Image Tools */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Image Tools</h3>
            <ul className="space-y-2">
              {[
                { name: 'Compress Image', href: '/tools/image/compress-image' },
                { name: 'Resize Image', href: '/tools/image/resize-image' },
                { name: 'Convert Image', href: '/tools/image/convert-image' },
                { name: 'Crop Image', href: '/tools/image/crop-image' },
                { name: 'Passport Photo', href: '/tools/image/passport-photo-maker' },
                { name: 'QR Generator', href: '/tools/image/qr-code-generator' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* PDF Tools */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">PDF Tools</h3>
            <ul className="space-y-2">
              {[
                { name: 'Compress PDF', href: '/tools/pdf/compress-pdf' },
                { name: 'Merge PDF', href: '/tools/pdf/merge-pdf' },
                { name: 'Split PDF', href: '/tools/pdf/split-pdf' },
                { name: 'PDF to JPG', href: '/tools/pdf/pdf-to-jpg' },
                { name: 'JPG to PDF', href: '/tools/pdf/jpg-to-pdf' },
                { name: 'Protect PDF', href: '/tools/pdf/protect-pdf' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'Blog', href: '/blog' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Support', href: '/contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {[
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Use', href: '/terms' },
                { name: 'Cookie Policy', href: '/privacy#cookies' },
                { name: 'DMCA', href: '/terms#dmca' },
                { name: 'Disclaimer', href: '/terms#disclaimer' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved. Free forever.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              No signup required &bull; No watermarks &bull; Unlimited use
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
