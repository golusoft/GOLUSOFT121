import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ConvertOptions {
  format: 'jpeg' | 'png' | 'webp' | 'avif' | 'tiff' | 'bmp';
  quality?: number;
  preserveTransparency?: boolean;
  preserveMetadata?: boolean;
  background?: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const optionsStr = formData.get('options') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const options: ConvertOptions = optionsStr ? JSON.parse(optionsStr) : { format: 'jpeg' };
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const metadata = await sharp(buffer).metadata();
    const quality = options.quality || 90;

    let pipeline = sharp(buffer).rotate();

    // Handle transparency for formats that don't support it
    if ((options.format === 'jpeg' || options.format === 'bmp') && metadata.hasAlpha) {
      const bg = options.background || '#ffffff';
      pipeline = pipeline.flatten({ background: bg });
    }

    if (!options.preserveMetadata) {
      // Strip metadata by default for smaller output
    }

    switch (options.format) {
      case 'jpeg':
        pipeline.jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:4:4' });
        break;
      case 'png':
        pipeline.png({ quality, compressionLevel: 9, palette: quality < 50 });
        break;
      case 'webp':
        pipeline.webp({ quality, effort: 6, lossless: quality >= 100 });
        break;
      case 'avif':
        pipeline.avif({ quality, effort: 6, lossless: quality >= 100 });
        break;
      case 'tiff':
        pipeline.tiff({ quality, compression: 'lzw' });
        break;
      case 'bmp':
        // Sharp doesn't directly support BMP output, convert to PNG lossless
        pipeline.png({ compressionLevel: 0 });
        break;
    }

    const result = await pipeline.toBuffer();

    const mimeTypes: Record<string, string> = {
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      avif: 'image/avif',
      tiff: 'image/tiff',
      bmp: 'image/png', // Fallback
    };

    const extensions: Record<string, string> = {
      jpeg: 'jpg',
      png: 'png',
      webp: 'webp',
      avif: 'avif',
      tiff: 'tiff',
      bmp: 'bmp',
    };

    return new NextResponse(result, {
      headers: {
        'Content-Type': mimeTypes[options.format] || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="converted.${extensions[options.format]}"`,
        'X-Original-Format': metadata.format || 'unknown',
        'X-Output-Format': options.format,
        'X-File-Size': result.length.toString(),
      },
    });
  } catch (error) {
    console.error('Convert error:', error);
    return NextResponse.json(
      { error: 'Failed to convert image. Please try again.' },
      { status: 500 }
    );
  }
}
