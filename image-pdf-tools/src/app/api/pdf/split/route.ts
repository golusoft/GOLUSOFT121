import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface SplitOptions {
  mode: 'ranges' | 'every' | 'extract';
  ranges?: string; // "1-3,5-7,10-12"
  everyN?: number;
  pages?: number[]; // specific pages to extract
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const optionsStr = formData.get('options') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const options: SplitOptions = optionsStr ? JSON.parse(optionsStr) : { mode: 'every', everyN: 1 };
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const totalPages = pdf.getPageCount();

    // For single extraction, return a single PDF
    if (options.mode === 'extract' && options.pages) {
      const newPdf = await PDFDocument.create();
      const pageIndices = options.pages
        .map(p => p - 1) // Convert to 0-indexed
        .filter(p => p >= 0 && p < totalPages);
      
      const copiedPages = await newPdf.copyPages(pdf, pageIndices);
      copiedPages.forEach(page => newPdf.addPage(page));
      
      const result = await newPdf.save({ useObjectStreams: true });
      
      return new NextResponse(result, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="extracted.pdf"`,
          'X-Total-Pages': copiedPages.length.toString(),
        },
      });
    }

    // For range splitting, parse and extract
    if (options.mode === 'ranges' && options.ranges) {
      const ranges = options.ranges.split(',').map(r => {
        const parts = r.trim().split('-');
        return {
          start: parseInt(parts[0]) - 1,
          end: parts[1] ? parseInt(parts[1]) - 1 : parseInt(parts[0]) - 1,
        };
      });

      // Return first range as single PDF
      const firstRange = ranges[0];
      const newPdf = await PDFDocument.create();
      const indices = [];
      for (let i = firstRange.start; i <= Math.min(firstRange.end, totalPages - 1); i++) {
        indices.push(i);
      }
      
      const copiedPages = await newPdf.copyPages(pdf, indices);
      copiedPages.forEach(page => newPdf.addPage(page));
      
      const result = await newPdf.save({ useObjectStreams: true });
      
      return new NextResponse(result, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="split_pages_${firstRange.start + 1}-${firstRange.end + 1}.pdf"`,
          'X-Total-Pages': copiedPages.length.toString(),
          'X-Original-Pages': totalPages.toString(),
        },
      });
    }

    // Default: split every page
    const newPdf = await PDFDocument.create();
    const everyN = options.everyN || 1;
    const indices = [];
    for (let i = 0; i < Math.min(everyN, totalPages); i++) {
      indices.push(i);
    }
    
    const copiedPages = await newPdf.copyPages(pdf, indices);
    copiedPages.forEach(page => newPdf.addPage(page));
    
    const result = await newPdf.save({ useObjectStreams: true });

    return new NextResponse(result, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="split.pdf"`,
        'X-Total-Pages': copiedPages.length.toString(),
        'X-Original-Pages': totalPages.toString(),
      },
    });
  } catch (error) {
    console.error('PDF split error:', error);
    return NextResponse.json(
      { error: 'Failed to split PDF. Please check your file and try again.' },
      { status: 500 }
    );
  }
}
