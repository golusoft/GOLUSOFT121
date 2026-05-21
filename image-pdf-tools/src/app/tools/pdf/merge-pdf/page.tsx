'use client';

import { useState, useCallback } from 'react';
import { FileUpload } from '@/components/shared/FileUpload';
import { showToast } from '@/components/shared/Toaster';
import { formatFileSize } from '@/lib/utils';

interface PDFFile {
  file: File;
  name: string;
  size: number;
}

export default function MergePDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string>('');
  const [resultSize, setResultSize] = useState(0);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    const pdfs = newFiles
      .filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'))
      .map(f => ({ file: f, name: f.name, size: f.size }));
    
    if (pdfs.length === 0) {
      showToast('Please upload PDF files only', 'error');
      return;
    }
    setFiles(prev => [...prev, ...pdfs]);
    setResultUrl('');
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newFiles.length) return;
    [newFiles[index], newFiles[target]] = [newFiles[target], newFiles[index]];
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      showToast('Please add at least 2 PDF files', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      files.forEach((f, i) => formData.append(`file${i}`, f.file));

      const response = await fetch('/api/pdf/merge', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Merge failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultSize(blob.size);
      showToast('PDFs merged successfully!', 'success');
    } catch {
      showToast('Failed to merge PDFs', 'error');
    }
    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = 'merged.pdf';
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Merge PDF Files
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Combine multiple PDF files into one document. Drag to reorder pages. Fast and secure.
        </p>
      </div>

      <FileUpload
        accept=".pdf,application/pdf"
        multiple
        maxSize={100}
        onFilesSelected={handleFilesSelected}
        label={files.length > 0 ? 'Add more PDF files' : 'Drop PDF files here or click to upload'}
        description="Select multiple PDF files to merge into one"
      />

      {files.length > 0 && (
        <div className="mt-6 space-y-6">
          {/* File List */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Files to merge ({files.length})
              </h2>
              <span className="text-xs text-gray-500">
                Drag to reorder or use arrows
              </span>
            </div>
            <div className="space-y-2">
              {files.map((f, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{f.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(f.size)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveFile(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveFile(index, 'down')}
                      disabled={index === files.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleMerge}
              disabled={isProcessing || files.length < 2}
              className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-brand-500/25 disabled:opacity-50 transition-all"
            >
              {isProcessing ? 'Merging PDFs...' : `Merge ${files.length} PDFs`}
            </button>
            <button
              onClick={() => setFiles([])}
              className="px-6 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Clear All
            </button>
          </div>

          {/* Result */}
          {resultUrl && (
            <div className="glass-card p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                PDFs Merged Successfully!
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {files.length} files merged • {formatFileSize(resultSize)}
              </p>
              <button
                onClick={handleDownload}
                className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg transition-all"
              >
                Download Merged PDF
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-16 max-w-3xl mx-auto prose dark:prose-invert">
        <h2>Merge PDF Files Online Free</h2>
        <p>
          Combine multiple PDF documents into a single file instantly. Reorder pages by dragging,
          add or remove files, and download your merged PDF. No signup required, no file limits.
        </p>
      </div>
    </div>
  );
}
