import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get in touch with ${SITE_CONFIG.name}. We'd love to hear your feedback, questions, or feature requests.`,
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Have questions or feedback? We would love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="glass-card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Send us a message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
              <select className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500">
                <option>General Inquiry</option>
                <option>Bug Report</option>
                <option>Feature Request</option>
                <option>Feedback</option>
                <option>Partnership</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea
                rows={5}
                placeholder="Your message..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold shadow-lg shadow-brand-500/25 transition-all"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Support</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              For common questions, check our <a href="/faq" className="text-brand-600 dark:text-brand-400 underline">FAQ page</a> first. Most questions are answered there.
            </p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Response Time</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We typically respond within 24-48 hours. For urgent issues, please include &quot;URGENT&quot; in your subject line.
            </p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Feature Requests</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We actively develop new tools based on user requests. Let us know what tools you need and we will prioritize them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
