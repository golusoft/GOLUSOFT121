import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about ${SITE_CONFIG.name} - the free professional image and PDF tools platform trusted by millions.`,
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        About {SITE_CONFIG.name}
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {SITE_CONFIG.name} is a free, professional-grade online platform for image and PDF processing.
          We believe everyone deserves access to powerful file processing tools without paywalls,
          watermarks, or signup requirements.
        </p>

        <h2>Our Mission</h2>
        <p>
          To provide the fastest, most reliable, and most feature-rich image and PDF tools on the
          internet — completely free. We aim to replace the need for expensive desktop software with
          instant, browser-based solutions that work on any device.
        </p>

        <h2>What Makes Us Different</h2>
        <ul>
          <li><strong>No Signup:</strong> Start using any tool immediately. No account required.</li>
          <li><strong>No Watermarks:</strong> All output files are clean and professional.</li>
          <li><strong>No File Limits:</strong> Process files of any size with batch support.</li>
          <li><strong>Privacy First:</strong> Files are processed on-server and automatically deleted.</li>
          <li><strong>Enterprise Quality:</strong> The same algorithms used by professional software.</li>
          <li><strong>Mobile Ready:</strong> Every tool works perfectly on phones and tablets.</li>
        </ul>

        <h2>Technology</h2>
        <p>
          Our tools are powered by industry-standard libraries including Sharp (image processing),
          pdf-lib (PDF manipulation), and custom optimization algorithms. We use edge computing and
          CDN delivery for ultra-fast performance worldwide.
        </p>

        <h2>Privacy & Security</h2>
        <p>
          Your files are processed securely on our servers and automatically deleted after processing.
          We never store, share, or analyze your files. All transfers are encrypted with TLS.
        </p>

        <h2>Contact</h2>
        <p>
          Have questions, feedback, or feature requests? We would love to hear from you.
          Visit our <a href="/contact">Contact page</a> to get in touch.
        </p>
      </div>
    </div>
  );
}
