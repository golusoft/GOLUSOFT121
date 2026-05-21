'use client';

import { useState, useCallback } from 'react';
import { FileUpload } from '@/components/shared/FileUpload';
import { showToast } from '@/components/shared/Toaster';
import { formatFileSize, getCompressionPercentage } from '@/lib/utils';

export default function CompressPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<'medium' | 'high' | 'maximum' | 'low'>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; size: number; savings: string } | null>(null);

  const handleFilesSelected = useCallback((files: File[]) => {
    const pdf = files.find(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (pdf) {
      setFile(pdf);
      setResult(null);
    } else {
      showToast('Please upload a PDF file', 'error');
    }
  }, []);

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify({ quality, removeMetadata: true }));

      const response = await fetch('/api/pdf/compress', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Compression failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const savings = response.headers.get('X-Savings-Percent') || '0';

      setResult({ url, size: blob.size, savings });
      showToast('PDF compressed successfully!', 'success');
    } catch {
      showToast('Failed to compress PDF', 'error');
    }

    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `compressed_${file?.name || 'document.pdf'}`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Smart PDF Compressor
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Reduce PDF file size with intelligent optimization. Maintains readability while dramatically reducing size.
        </p>
      </div>

      {!file && (
        <FileUpload
          accept=".pdf,application/pdf"
          multiple={false}
          maxSize={100}
          onFilesSelected={handleFilesSelected}
          label="Drop a PDF file here or click to upload"
          description="Supports PDF files up to 100MB"
        />
      )}

      {file && (
        <div className="space-y-6">
          {/* File Info */}
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
              <p className="text-xs text-gray-500">Original size: {formatFileSize(file.size)}</p>
            </div>
            <button
              onClick={() => { setFile(null); setResult(null); }}
              className="text-xs text-gray-500 hover:text-red-500 underline"
            >
              Change file
            </button>
          </div>

          {/* Quality Selection */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Compression Quality</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: 'maximum', label: 'Maximum', desc: 'Largest reduction, lower quality' },
                { value: 'high', label: 'High', desc: 'Good balance of size & quality' },
                { value: 'medium', label: 'Medium', desc: 'Recommended for most files' },
                { value: 'low', label: 'Low', desc: 'Minimal reduction, best quality' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setQuality(opt.value as typeof quality)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    quality === opt.value
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-2 ring-brand-500/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'
                  }`}
                >
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white">{opt.label}</span>
                  <span className="block text-xs text-gray-500 mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleCompress}
              disabled={isProcessing}
              className="w-full mt-6 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg shadow-red-500/25 disabled:opacity-50 transition-all"
            >
              {isProcessing ? 'Compressing PDF...' : 'Compress PDF'}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="glass-card p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Compression Complete!</h3>
              <div className="flex items-center justify-center gap-6 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Original</p>
                  <p className="text-sm font-bold">{formatFileSize(file.size)}</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Compressed</p>
                  <p className="text-sm font-bold text-green-600">{formatFileSize(result.size)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Saved</p>
                  <p className="text-sm font-bold text-brand-600">{result.savings}%</p>
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg transition-all"
              >
                Download Compressed PDF
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-16 max-w-3xl mx-auto prose dark:prose-invert">
        <h2>Compress PDF Files Online</h2>
        <p>
          Our Smart PDF Compressor reduces PDF file size by optimizing document structure,
          recompressing images, removing redundant data, and stripping unnecessary metadata.
          Choose from multiple compression levels to balance file size and quality.
        </p>
        <h3>FAQ</h3>
        <h4>How much can a PDF be compressed?</h4>
        <p>
          Compression ratios vary based on PDF content. Image-heavy PDFs can often be reduced by
          50-80%. Text-only PDFs may see 10-30% reduction. Our optimizer uses multiple strategies.
        </p>
      </div>
    </div>
  );
}
