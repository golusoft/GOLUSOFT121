import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: `Terms of Use for ${SITE_CONFIG.name}. Read our terms of service, disclaimer, and DMCA policy.`,
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Terms of Use
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: January 2025</p>

      <div className="prose dark:prose-invert max-w-none">
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using {SITE_CONFIG.name}, you agree to these Terms of Use. If you do not
          agree, please do not use our services.
        </p>

        <h2>Service Description</h2>
        <p>
          {SITE_CONFIG.name} provides free online tools for image and PDF processing. Our tools include
          compression, resizing, conversion, merging, splitting, and other file manipulation functions.
        </p>

        <h2>Acceptable Use</h2>
        <p>You agree to:</p>
        <ul>
          <li>Use the service only for lawful purposes</li>
          <li>Not upload illegal, harmful, or infringing content</li>
          <li>Not attempt to overload or disrupt our servers</li>
          <li>Not use automated tools to excessively access the service</li>
          <li>Not reverse-engineer or copy our tools</li>
        </ul>

        <h2>File Ownership</h2>
        <p>
          You retain all ownership rights to files you upload. We do not claim any rights to your
          content. Files are processed and immediately deleted from our servers.
        </p>

        <h2>Service Availability</h2>
        <p>
          While we strive for 99.9% uptime, we do not guarantee uninterrupted service. We may
          perform maintenance or updates that temporarily affect availability.
        </p>

        <h2 id="disclaimer">Disclaimer</h2>
        <p>
          Our tools are provided &quot;as is&quot; without warranties of any kind. While we strive for
          accuracy and reliability, we cannot guarantee that all processing results will be
          perfect for every use case. Always verify output quality for critical applications.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          {SITE_CONFIG.name} shall not be liable for any direct, indirect, incidental, or
          consequential damages arising from the use of our services.
        </p>

        <h2 id="dmca">DMCA Policy</h2>
        <p>
          We respect intellectual property rights. If you believe content processed through our
          service infringes your copyright, please contact us with:
        </p>
        <ul>
          <li>Description of the copyrighted work</li>
          <li>Description of the infringing material</li>
          <li>Your contact information</li>
          <li>A statement of good faith belief</li>
          <li>A statement under penalty of perjury</li>
          <li>Your physical or electronic signature</li>
        </ul>

        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of the service
          after changes constitutes acceptance of the new terms.
        </p>

        <h2>Contact</h2>
        <p>
          For questions about these terms, please <a href="/contact">contact us</a>.
        </p>
      </div>
    </div>
  );
}
