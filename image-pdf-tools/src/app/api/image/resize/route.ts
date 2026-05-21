import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ResizeOptions {
  width?: number;
  height?: number;
  percentage?: number;
  unit?: 'px' | 'percent' | 'inch' | 'cm' | 'mm';
  dpi?: number;
  maintainAspectRatio?: boolean;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  format?: 'jpeg' | 'png' | 'webp';
  quality?: number;
  background?: string;
}

function convertToPixels(value: number, unit: string, dpi: number): number {
  switch (unit) {
    case 'inch': return Math.round(value * dpi);
    case 'cm': return Math.round((value / 2.54) * dpi);
    case 'mm': return Math.round((value / 25.4) * dpi);
    default: return Math.round(value);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const optionsStr = formData.get('options') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const options: ResizeOptions = optionsStr ? JSON.parse(optionsStr) : {};
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const metadata = await sharp(buffer).metadata();
    const originalWidth = metadata.width || 800;
    const originalHeight = metadata.height || 600;
    const dpi = options.dpi || 72;

    let targetWidth: number | undefined;
    let targetHeight: number | undefined;

    if (options.percentage) {
      targetWidth = Math.round(originalWidth * (options.percentage / 100));
      targetHeight = Math.round(originalHeight * (options.percentage / 100));
    } else {
      const unit = options.unit || 'px';
      if (options.width) targetWidth = convertToPixels(options.width, unit, dpi);
      if (options.height) targetHeight = convertToPixels(options.height, unit, dpi);
    }

    const fit = options.fit || (options.maintainAspectRatio !== false ? 'inside' : 'fill');
    
    const pipeline = sharp(buffer)
      .rotate() // Auto-rotate from EXIF
      .resize(targetWidth, targetHeight, {
        fit: fit as keyof sharp.FitEnum,
        withoutEnlargement: false,
        background: options.background || { r: 255, g: 255, b: 255, alpha: 0 },
      });

    // Set DPI in output
    if (options.dpi) {
      pipeline.withMetadata({ density: options.dpi });
    }

    const outputFormat = options.format || (metadata.format === 'png' ? 'png' : 'jpeg') as 'jpeg' | 'png' | 'webp';
    const quality = options.quality || 90;

    switch (outputFormat) {
      case 'jpeg': pipeline.jpeg({ quality, mozjpeg: true }); break;
      case 'png': pipeline.png({ quality }); break;
      case 'webp': pipeline.webp({ quality }); break;
    }

    const result = await pipeline.toBuffer();
    const resultMetadata = await sharp(result).metadata();

    const mimeTypes = { jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

    return new NextResponse(result, {
      headers: {
        'Content-Type': mimeTypes[outputFormat],
        'Content-Disposition': `attachment; filename="resized.${outputFormat === 'jpeg' ? 'jpg' : outputFormat}"`,
        'X-Original-Width': originalWidth.toString(),
        'X-Original-Height': originalHeight.toString(),
        'X-New-Width': (resultMetadata.width || 0).toString(),
        'X-New-Height': (resultMetadata.height || 0).toString(),
        'X-File-Size': result.length.toString(),
      },
    });
  } catch (error) {
    console.error('Resize error:', error);
    return NextResponse.json(
      { error: 'Failed to resize image. Please try again.' },
      { status: 500 }
    );
  }
}
