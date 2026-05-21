import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface CompressOptions {
  targetSizeKB?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  preserveMetadata?: boolean;
  mode?: 'smart' | 'quality' | 'size';
}

async function compressToTargetSize(
  buffer: Buffer,
  targetKB: number,
  format: 'jpeg' | 'png' | 'webp' | 'avif' = 'jpeg'
): Promise<Buffer> {
  const targetBytes = targetKB * 1024;
  let quality = 90;
  let result = buffer;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const pipeline = sharp(buffer);
    
    switch (format) {
      case 'jpeg':
        pipeline.jpeg({ quality, mozjpeg: true });
        break;
      case 'png':
        pipeline.png({ quality, compressionLevel: 9 - Math.floor(quality / 12) });
        break;
      case 'webp':
        pipeline.webp({ quality, effort: 6 });
        break;
      case 'avif':
        pipeline.avif({ quality, effort: 6 });
        break;
    }

    result = await pipeline.toBuffer();

    if (result.length <= targetBytes || quality <= 5) {
      break;
    }

    // Adaptive quality reduction
    const ratio = targetBytes / result.length;
    if (ratio < 0.3) {
      quality = Math.max(5, quality - 20);
    } else if (ratio < 0.6) {
      quality = Math.max(5, quality - 10);
    } else {
      quality = Math.max(5, quality - 5);
    }
    
    attempts++;
  }

  // If still too large, resize down
  if (result.length > targetBytes && targetKB < 100) {
    const metadata = await sharp(buffer).metadata();
    const scaleFactor = Math.sqrt(targetBytes / result.length) * 0.9;
    const newWidth = Math.round((metadata.width || 800) * scaleFactor);
    
    const pipeline = sharp(buffer).resize(newWidth);
    switch (format) {
      case 'jpeg': pipeline.jpeg({ quality: Math.max(20, quality), mozjpeg: true }); break;
      case 'png': pipeline.png({ quality: Math.max(20, quality) }); break;
      case 'webp': pipeline.webp({ quality: Math.max(20, quality) }); break;
      case 'avif': pipeline.avif({ quality: Math.max(20, quality) }); break;
    }
    result = await pipeline.toBuffer();
  }

  return result;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const optionsStr = formData.get('options') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const options: CompressOptions = optionsStr ? JSON.parse(optionsStr) : {};
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Detect format
    const metadata = await sharp(buffer).metadata();
    const inputFormat = metadata.format || 'jpeg';
    const outputFormat = options.format || (inputFormat === 'png' ? 'png' : 'jpeg') as 'jpeg' | 'png' | 'webp' | 'avif';

    let result: Buffer;

    if (options.targetSizeKB) {
      // Compress to target size
      result = await compressToTargetSize(buffer, options.targetSizeKB, outputFormat);
    } else {
      // Compress with quality setting
      const quality = options.quality || 80;
      const pipeline = sharp(buffer);
      
      if (!options.preserveMetadata) {
        pipeline.rotate(); // Auto-rotate based on EXIF, then strip metadata
      }

      switch (outputFormat) {
        case 'jpeg':
          pipeline.jpeg({ quality, mozjpeg: true });
          break;
        case 'png':
          pipeline.png({ quality, compressionLevel: 9 });
          break;
        case 'webp':
          pipeline.webp({ quality, effort: 6 });
          break;
        case 'avif':
          pipeline.avif({ quality, effort: 6 });
          break;
      }

      result = await pipeline.toBuffer();
    }

    const mimeTypes = {
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      avif: 'image/avif',
    };

    return new NextResponse(result, {
      headers: {
        'Content-Type': mimeTypes[outputFormat],
        'Content-Disposition': `attachment; filename="compressed.${outputFormat === 'jpeg' ? 'jpg' : outputFormat}"`,
        'X-Original-Size': buffer.length.toString(),
        'X-Compressed-Size': result.length.toString(),
        'X-Compression-Ratio': ((1 - result.length / buffer.length) * 100).toFixed(1),
      },
    });
  } catch (error) {
    console.error('Compression error:', error);
    return NextResponse.json(
      { error: 'Failed to compress image. Please try again.' },
      { status: 500 }
    );
  }
}
