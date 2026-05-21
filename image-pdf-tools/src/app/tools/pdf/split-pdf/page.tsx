'use client';

import { useState, useCallback } from 'react';
import { FileUpload } from '@/components/shared/FileUpload';
import { showToast } from '@/components/shared/Toaster';
import { formatFileSize } from '@/lib/utils';

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'extract' | 'ranges'>('extract');
  const [pages, setPages] = useState<string>('');
  const [ranges, setRanges] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string>('');
  const [resultSize, setResultSize] = useState(0);

  const handleFilesSelected = useCallback((files: File[]) => {
    const pdf = files.find(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (pdf) {
      setFile(pdf);
      setResultUrl('');
    } else {
      showToast('Please upload a PDF file', 'error');
    }
  }, []);

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      let options: Record<string, unknown>;
      if (mode === 'extract') {
        const pageNums = pages.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
        options = { mode: 'extract', pages: pageNums };
      } else {
        options = { mode: 'ranges', ranges };
      }

      formData.append('options', JSON.stringify(options));

      const response = await fetch('/api/pdf/split', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Split failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultSize(blob.size);
      showToast('PDF split successfully!', 'success');
    } catch {
      showToast('Failed to split PDF', 'error');
    }
    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `split_${file?.name || 'document.pdf'}`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Split PDF
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Extract specific pages or split PDF by ranges. Get exactly the pages you need.
        </p>
      </div>

      {!file && (
        <FileUpload
          accept=".pdf,application/pdf"
          multiple={false}
          maxSize={100}
          onFilesSelected={handleFilesSelected}
          label="Drop a PDF file here"
          description="Upload the PDF you want to split"
        />
      )}

      {file && (
        <div className="space-y-6">
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
            <button onClick={() => { setFile(null); setResultUrl(''); }} className="text-xs text-gray-500 hover:text-red-500 underline">
              Change
            </button>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Split Mode</h2>
            
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setMode('extract')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'extract' ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
              >
                Extract Pages
              </button>
              <button
                onClick={() => setMode('ranges')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'ranges' ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
              >
                Split by Range
              </button>
            </div>

            {mode === 'extract' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Page Numbers (comma-separated)
                </label>
                <input
                  type="text"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  placeholder="e.g. 1, 3, 5, 7"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                />
                <p className="text-xs text-gray-500 mt-2">Enter the page numbers you want to extract</p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Page Ranges
                </label>
                <input
                  type="text"
                  value={ranges}
                  onChange={(e) => setRanges(e.target.value)}
                  placeholder="e.g. 1-3, 5-7, 10-12"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                />
                <p className="text-xs text-gray-500 mt-2">Enter page ranges separated by commas</p>
              </div>
            )}

            <button
              onClick={handleSplit}
              disabled={isProcessing || (mode === 'extract' ? !pages : !ranges)}
              className="w-full mt-6 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white font-semibold shadow-lg disabled:opacity-50 transition-all"
            >
              {isProcessing ? 'Splitting...' : 'Split PDF'}
            </button>
          </div>

          {resultUrl && (
            <div className="glass-card p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Split Complete!</h3>
              <p className="text-sm text-gray-500 mb-4">{formatFileSize(resultSize)}</p>
              <button
                onClick={handleDownload}
                className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg transition-all"
              >
                Download Split PDF
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-16 max-w-3xl mx-auto prose dark:prose-invert">
        <h2>Split PDF Online Free</h2>
        <p>
          Extract specific pages from a PDF or split it into multiple documents by page ranges.
          Perfect for extracting chapters, removing unwanted pages, or dividing large documents.
        </p>
      </div>
    </div>
  );
}
