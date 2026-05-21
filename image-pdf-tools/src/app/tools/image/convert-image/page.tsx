'use client';

import { useState, useCallback } from 'react';
import { FileUpload } from '@/components/shared/FileUpload';
import { showToast } from '@/components/shared/Toaster';
import { formatFileSize } from '@/lib/utils';

interface ConvertFile {
  original: File;
  converted?: Blob;
  url?: string;
  size: number;
  processing: boolean;
  error?: string;
}

const FORMATS = [
  { value: 'jpeg', label: 'JPEG', desc: 'Best for photos, smallest size' },
  { value: 'png', label: 'PNG', desc: 'Lossless, supports transparency' },
  { value: 'webp', label: 'WebP', desc: 'Modern format, great compression' },
  { value: 'avif', label: 'AVIF', desc: 'Best quality-to-size ratio' },
  { value: 'tiff', label: 'TIFF', desc: 'High quality, print-ready' },
] as const;

export default function ConvertImagePage() {
  const [files, setFiles] = useState<ConvertFile[]>([]);
  const [targetFormat, setTargetFormat] = useState<string>('webp');
  const [quality, setQuality] = useState(90);
  const [preserveTransparency, setPreserveTransparency] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    const imageFiles = newFiles.filter(f => f.type.startsWith('image/'));
    const items: ConvertFile[] = imageFiles.map(f => ({
      original: f,
      size: f.size,
      processing: false,
    }));
    setFiles(prev => [...prev, ...items]);
  }, []);

  const convertAll = async () => {
    setIsProcessing(true);
    const updated = [...files];

    for (let i = 0; i < updated.length; i++) {
      if (updated[i].converted) continue;
      updated[i].processing = true;
      setFiles([...updated]);

      try {
        const formData = new FormData();
        formData.append('file', updated[i].original);
        formData.append('options', JSON.stringify({
          format: targetFormat,
          quality,
          preserveTransparency,
        }));

        const response = await fetch('/api/image/convert', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Conversion failed');

        const blob = await response.blob();
        updated[i] = {
          ...updated[i],
          converted: blob,
          url: URL.createObjectURL(blob),
          size: blob.size,
          processing: false,
        };
      } catch {
        updated[i] = { ...updated[i], processing: false, error: 'Failed' };
      }
      setFiles([...updated]);
    }

    setIsProcessing(false);
    showToast('All images converted!', 'success');
  };

  const downloadFile = (file: ConvertFile) => {
    if (!file.url) return;
    const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
    const a = document.createElement('a');
    a.href = file.url;
    a.download = `${file.original.name.split('.')[0]}.${ext}`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Smart Image Converter
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Convert images between JPG, PNG, WebP, AVIF, TIFF and more. Batch conversion with quality control.
        </p>
      </div>

      {files.length === 0 && (
        <FileUpload
          accept="image/*"
          multiple
          maxSize={50}
          onFilesSelected={handleFilesSelected}
          label="Drop images to convert"
          description="Supports JPG, PNG, WebP, GIF, BMP, TIFF, AVIF, HEIC"
        />
      )}

      {files.length > 0 && (
        <div className="space-y-6">
          {/* Format Selection */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Convert To</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
              {FORMATS.map(fmt => (
                <button
                  key={fmt.value}
                  onClick={() => setTargetFormat(fmt.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    targetFormat === fmt.value
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-2 ring-brand-500/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600'
                  }`}
                >
                  <span className="block text-sm font-bold text-gray-900 dark:text-white">{fmt.label}</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">{fmt.desc}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preserveTransparency}
                    onChange={(e) => setPreserveTransparency(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Preserve transparency (if supported)</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={convertAll}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold shadow-lg shadow-brand-500/25 disabled:opacity-50 transition-all"
              >
                {isProcessing ? 'Converting...' : `Convert All to ${targetFormat.toUpperCase()}`}
              </button>
              <button
                onClick={() => setFiles([])}
                className="px-4 py-3 text-sm text-red-500 hover:text-red-700 underline"
              >
                Clear all
              </button>
            </div>
          </div>

          {/* File List */}
          <div className="space-y-3">
            {files.map((file, index) => (
              <div key={index} className="glass-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.original.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.original.size)}
                    {file.converted && (
                      <span className="ml-2 text-green-600">→ {formatFileSize(file.size)} ({targetFormat.toUpperCase()})</span>
                    )}
                  </p>
                </div>
                {file.processing && <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />}
                {file.url && (
                  <button onClick={() => downloadFile(file)} className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg">
                    Download
                  </button>
                )}
                {file.error && <span className="text-xs text-red-500">{file.error}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-16 max-w-3xl mx-auto prose dark:prose-invert">
        <h2>Convert Images Between Any Format</h2>
        <p>
          Convert images between JPEG, PNG, WebP, AVIF, TIFF, and more formats instantly.
          Our converter handles transparency, quality optimization, and batch processing.
        </p>
        <h3>Supported Conversions</h3>
        <ul>
          <li>JPG to PNG, WebP, AVIF, TIFF</li>
          <li>PNG to JPG, WebP, AVIF (with transparency handling)</li>
          <li>WebP to JPG, PNG, AVIF, TIFF</li>
          <li>HEIC to JPG, PNG, WebP</li>
          <li>BMP to any modern format</li>
          <li>TIFF to JPG, PNG, WebP</li>
        </ul>
      </div>
    </div>
  );
}
