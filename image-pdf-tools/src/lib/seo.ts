import type { Metadata } from 'next';
import { SITE_CONFIG } from './utils';
import { Tool } from './tools-data';

export function generateToolMetadata(tool: Tool): Metadata {
  const title = `${tool.name} - Free Online ${tool.category === 'image' ? 'Image' : 'PDF'} Tool | ${SITE_CONFIG.name}`;
  const description = tool.description;

  return {
    title,
    description,
    keywords: tool.keywords.join(', '),
    openGraph: {
      title,
      description,
      url: `${SITE_CONFIG.url}/tools/${tool.category}/${tool.slug}`,
      siteName: SITE_CONFIG.name,
      type: 'website',
      images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: tool.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [SITE_CONFIG.ogImage],
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/tools/${tool.category}/${tool.slug}`,
    },
  };
}

export function generateToolJsonLd(tool: Tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    url: `${SITE_CONFIG.url}/tools/${tool.category}/${tool.slug}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: tool.features,
  };
}

export function generateFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.description,
    sameAs: [],
  };
}
