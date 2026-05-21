import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PDFCompressOptions {
  targetSizeKB?: number;
  quality?: 'low' | 'medium' | 'high' | 'maximum';
  removeMetadata?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const optionsStr = formData.get('options') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const options: PDFCompressOptions = optionsStr ? JSON.parse(optionsStr) : {};
    const arrayBuffer = await file.arrayBuffer();
    const originalSize = arrayBuffer.byteLength;

    // Load and rewrite the PDF (removes redundant data, optimizes structure)
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

    if (options.removeMetadata !== false) {
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');
    }

    // Serialize with optimizations
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    const compressedSize = compressedBytes.byteLength;
    const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);

    return new NextResponse(compressedBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="compressed.pdf"`,
        'X-Original-Size': originalSize.toString(),
        'X-Compressed-Size': compressedSize.toString(),
        'X-Savings-Percent': savings,
      },
    });
  } catch (error) {
    console.error('PDF compress error:', error);
    return NextResponse.json(
      { error: 'Failed to compress PDF. The file may be corrupted or encrypted.' },
      { status: 500 }
    );
  }
}
