import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/utils';
import { generateFAQJsonLd } from '@/lib/seo';

const faqs = [
  {
    question: 'Is this service really free?',
    answer: 'Yes! All tools are 100% free to use with no hidden charges, no signup required, and no watermarks on output files.',
  },
  {
    question: 'Do I need to create an account?',
    answer: 'No. All tools work instantly without any registration. Just upload your file and start processing.',
  },
  {
    question: 'Are my files safe and private?',
    answer: 'Absolutely. Files are processed in server memory and automatically deleted immediately after processing. We never store, view, or share your files.',
  },
  {
    question: 'What is the maximum file size?',
    answer: 'Images can be up to 50MB and PDFs up to 100MB. For batch processing, you can upload multiple files simultaneously.',
  },
  {
    question: 'How do I compress an image to a specific KB size?',
    answer: 'Use our Smart Image Compressor, select "Target Size Mode", enter your desired file size (e.g., 200 KB), and click compress. Our algorithm will iteratively adjust to hit your target.',
  },
  {
    question: 'Can I process multiple files at once?',
    answer: 'Yes! Most tools support batch processing. Upload multiple files, configure settings once, and process them all simultaneously. Download individually or as a ZIP.',
  },
  {
    question: 'Which image formats are supported?',
    answer: 'We support JPG/JPEG, PNG, WebP, AVIF, GIF, BMP, TIFF, and ICO. Our converter can transform between any of these formats.',
  },
  {
    question: 'Does compression reduce image quality?',
    answer: 'At quality levels above 70%, compression is virtually imperceptible. Our mozjpeg-based compression produces better results than standard encoding, maintaining visual quality while reducing size.',
  },
  {
    question: 'Can I merge more than 2 PDF files?',
    answer: 'Yes! Our PDF merger supports unlimited files. Upload as many PDFs as you need, reorder them by dragging, and merge into a single document.',
  },
  {
    question: 'Do you add watermarks to processed files?',
    answer: 'Never. All output files are completely clean with no watermarks, logos, or branding added.',
  },
  {
    question: 'Does this work on mobile phones?',
    answer: 'Yes! Every tool is optimized for mobile devices. The interface adapts to smaller screens and all processing works on phones and tablets.',
  },
  {
    question: 'How fast is the processing?',
    answer: 'Most files are processed in under 2 seconds. Our servers use enterprise-grade hardware and optimized algorithms for ultra-fast processing.',
  },
];

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions',
  description: 'Find answers to common questions about our free image and PDF tools, file safety, processing limits, and more.',
};

export default function FAQPage() {
  const faqJsonLd = generateFAQJsonLd(faqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Everything you need to know about {SITE_CONFIG.name}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group glass-card overflow-hidden"
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </h2>
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-0">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center glass-card p-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Still have questions?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Can&apos;t find the answer you&apos;re looking for? We&apos;re here to help.
          </p>
          <a
            href="/contact"
            className="inline-flex px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-lg transition-all"
          >
            Contact Us
          </a>
        </div>
      </div>
    </>
  );
}
