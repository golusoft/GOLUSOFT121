# ToolsPro - Enterprise Image & PDF Tools Platform

A world-class, ultra-fast, enterprise-grade Image & PDF Tools platform built with Next.js 15.

## Features

- **20+ Image Tools**: Smart Compressor, Resizer, Converter, Crop, Watermark, DPI Converter, Passport Photo Maker, and more
- **12+ PDF Tools**: Compressor, Merger, Splitter, Converter, Watermark, Security tools, and more
- **Real Processing**: Powered by Sharp, pdf-lib, and custom optimization algorithms
- **No Signup Required**: All tools work instantly without registration
- **Batch Processing**: Process hundreds of files simultaneously
- **Mobile Optimized**: Works flawlessly on any device
- **SEO Optimized**: Full structured data, sitemaps, and metadata
- **Dark/Light Mode**: Premium UI with theme support

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Image Processing**: Sharp (mozjpeg, WebP, AVIF, PNG)
- **PDF Processing**: pdf-lib
- **UI**: Custom glassmorphism design system
- **SEO**: JSON-LD schemas, dynamic sitemaps, Open Graph

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # Backend API routes
│   │   ├── image/         # Image processing endpoints
│   │   └── pdf/           # PDF processing endpoints
│   ├── tools/             # Tool pages
│   │   ├── image/         # Image tool pages
│   │   └── pdf/           # PDF tool pages
│   └── ...                # Static pages (about, contact, etc.)
├── components/            # React components
│   ├── layout/            # Header, Footer
│   ├── shared/            # Reusable components
│   └── tools/             # Tool-specific components
├── lib/                   # Utilities and data
│   ├── tools-data.ts      # Tool definitions and categories
│   ├── seo.ts             # SEO utilities
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript types
```

## API Routes

- `POST /api/image/compress` - Smart image compression with target size
- `POST /api/image/resize` - Image resize with px/percent/inches/cm
- `POST /api/image/convert` - Format conversion (JPG, PNG, WebP, AVIF, TIFF)
- `POST /api/pdf/compress` - PDF compression and optimization
- `POST /api/pdf/merge` - Merge multiple PDFs
- `POST /api/pdf/split` - Split PDF by pages or ranges

## Deployment

Optimized for Vercel deployment:

```bash
vercel deploy
```

## License

All rights reserved.
