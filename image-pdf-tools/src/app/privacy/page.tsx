import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${SITE_CONFIG.name}. Learn how we protect your data and files.`,
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: January 2025</p>

      <div className="prose dark:prose-invert max-w-none">
        <h2>Introduction</h2>
        <p>
          At {SITE_CONFIG.name}, we take your privacy seriously. This Privacy Policy explains how we collect,
          use, and protect your information when you use our free online tools.
        </p>

        <h2>File Processing</h2>
        <p>
          <strong>Your files are never stored permanently.</strong> When you upload a file for processing:
        </p>
        <ul>
          <li>Files are processed in server memory or temporary storage</li>
          <li>Files are automatically deleted immediately after processing</li>
          <li>We never view, analyze, or share your file contents</li>
          <li>All transfers are encrypted with TLS/SSL</li>
          <li>No file data is retained after you download your result</li>
        </ul>

        <h2>Information We Collect</h2>
        <p>We collect minimal information to improve our service:</p>
        <ul>
          <li><strong>Usage Analytics:</strong> Anonymous page views and tool usage statistics</li>
          <li><strong>Device Information:</strong> Browser type, operating system (for optimization)</li>
          <li><strong>Error Logs:</strong> Technical error information to improve reliability</li>
        </ul>
        <p>We do <strong>NOT</strong> collect:</p>
        <ul>
          <li>Personal identification information</li>
          <li>Email addresses (unless you contact us)</li>
          <li>File contents or metadata</li>
          <li>Location data</li>
        </ul>

        <h2 id="cookies">Cookies</h2>
        <p>We use minimal cookies for:</p>
        <ul>
          <li>Theme preference (light/dark mode)</li>
          <li>Anonymous analytics (can be disabled)</li>
          <li>Essential functionality</li>
        </ul>
        <p>We do NOT use cookies for tracking, advertising profiles, or cross-site tracking.</p>

        <h2>Third-Party Services</h2>
        <p>
          We may use anonymous analytics services to understand usage patterns. These services
          do not receive any file data or personal information.
        </p>

        <h2>Advertising</h2>
        <p>
          We may display advertisements to support our free service. Ad providers may use cookies
          for ad personalization. You can opt out of personalized ads through your browser settings.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement industry-standard security measures including encrypted transfers,
          secure server infrastructure, and regular security audits.
        </p>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Know what data we collect about you</li>
          <li>Request deletion of any stored data</li>
          <li>Opt out of analytics tracking</li>
          <li>Contact us with privacy concerns</li>
        </ul>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this policy periodically. Changes will be posted on this page with an
          updated revision date.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy questions or concerns, please <a href="/contact">contact us</a>.
        </p>
      </div>
    </div>
  );
}
