import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files: File[] = [];

    // Get all PDF files from form data
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file') && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 PDF files are required to merge' },
        { status: 400 }
      );
    }

    // Create merged document
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      try {
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      } catch (e) {
        console.error(`Error processing file ${file.name}:`, e);
        return NextResponse.json(
          { error: `Failed to process file: ${file.name}. It may be corrupted.` },
          { status: 400 }
        );
      }
    }

    const mergedBytes = await mergedPdf.save({ useObjectStreams: true });

    return new NextResponse(mergedBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="merged.pdf"`,
        'X-Total-Pages': mergedPdf.getPageCount().toString(),
        'X-Files-Merged': files.length.toString(),
        'X-File-Size': mergedBytes.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('PDF merge error:', error);
    return NextResponse.json(
      { error: 'Failed to merge PDFs. Please check your files and try again.' },
      { status: 500 }
    );
  }
}
