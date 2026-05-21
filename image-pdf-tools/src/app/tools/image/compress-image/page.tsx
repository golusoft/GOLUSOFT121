'use client';

import { useState, useCallback } from 'react';
import { FileUpload } from '@/components/shared/FileUpload';
import { showToast } from '@/components/shared/Toaster';
import { formatFileSize, getCompressionPercentage } from '@/lib/utils';

interface ProcessedFile {
  original: File;
  compressed?: Blob;
  originalSize: number;
  compressedSize: number;
  savings: number;
  url?: string;
  processing: boolean;
  error?: string;
}

export default function CompressImagePage() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [quality, setQuality] = useState(80);
  const [targetSize, setTargetSize] = useState<string>('');
  const [targetUnit, setTargetUnit] = useState<'KB' | 'MB'>('KB');
  const [mode, setMode] = useState<'quality' | 'target'>('quality');
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp' | 'avif'>('jpeg');
  const [preserveMetadata, setPreserveMetadata] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    const imageFiles = newFiles.filter(f => f.type.startsWith('image/'));
    const processed: ProcessedFile[] = imageFiles.map(f => ({
      original: f,
      originalSize: f.size,
      compressedSize: 0,
      savings: 0,
      processing: false,
    }));
    setFiles(prev => [...prev, ...processed]);
  }, []);

  const compressAll = async () => {
    setIsProcessing(true);
    const updatedFiles = [...files];

    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i].compressed) continue;
      
      updatedFiles[i].processing = true;
      setFiles([...updatedFiles]);

      try {
        const formData = new FormData();
        formData.append('file', updatedFiles[i].original);

        const options: Record<string, unknown> = {
          format,
          preserveMetadata,
        };

        if (mode === 'target' && targetSize) {
          const sizeInKB = targetUnit === 'MB' ? parseFloat(targetSize) * 1024 : parseFloat(targetSize);
          options.targetSizeKB = sizeInKB;
        } else {
          options.quality = quality;
        }

        formData.append('options', JSON.stringify(options));

        const response = await fetch('/api/image/compress', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Compression failed');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const compressedSize = blob.size;

        updatedFiles[i] = {
          ...updatedFiles[i],
          compressed: blob,
          compressedSize,
          savings: getCompressionPercentage(updatedFiles[i].originalSize, compressedSize),
          url,
          processing: false,
        };
      } catch (error) {
        updatedFiles[i] = {
          ...updatedFiles[i],
          processing: false,
          error: 'Compression failed',
        };
      }

      setFiles([...updatedFiles]);
    }

    setIsProcessing(false);
    showToast('All images compressed successfully!', 'success');
  };

  const downloadFile = (file: ProcessedFile) => {
    if (!file.url) return;
    const a = document.createElement('a');
    a.href = file.url;
    a.download = `compressed_${file.original.name.split('.')[0]}.${format === 'jpeg' ? 'jpg' : format}`;
    a.click();
  };

  const downloadAll = () => {
    files.forEach(f => { if (f.url) downloadFile(f); });
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const updated = [...prev];
      if (updated[index].url) URL.revokeObjectURL(updated[index].url!);
      updated.splice(index, 1);
      return updated;
    });
  };

  const clearAll = () => {
    files.forEach(f => { if (f.url) URL.revokeObjectURL(f.url!); });
    setFiles([]);
  };

  const totalOriginal = files.reduce((sum, f) => sum + f.originalSize, 0);
  const totalCompressed = files.reduce((sum, f) => sum + f.compressedSize, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Smart Image Compressor
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Compress images to any size with intelligent optimization. Reduce file size while maintaining quality.
        </p>
      </div>

      {/* Upload Area */}
      {files.length === 0 && (
        <FileUpload
          accept="image/*"
          multiple
          maxSize={50}
          onFilesSelected={handleFilesSelected}
          label="Drop images here or click to upload"
          description="Supports JPG, PNG, WebP, GIF, BMP, TIFF — up to 50MB each"
        />
      )}

      {/* Controls */}
      {files.length > 0 && (
        <div className="space-y-6">
          {/* Settings Panel */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Compression Settings</h2>
            
            {/* Mode Toggle */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setMode('quality')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'quality'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Quality Mode
              </button>
              <button
                onClick={() => setMode('target')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'target'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Target Size Mode
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mode === 'quality' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Smallest file</span>
                    <span>Best quality</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target File Size
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={targetSize}
                      onChange={(e) => setTargetSize(e.target.value)}
                      placeholder="e.g. 200"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                    <select
                      value={targetUnit}
                      onChange={(e) => setTargetUnit(e.target.value as 'KB' | 'MB')}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="KB">KB</option>
                      <option value="MB">MB</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Output Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as typeof format)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                >
                  <option value="jpeg">JPEG (smallest)</option>
                  <option value="webp">WebP (modern)</option>
                  <option value="png">PNG (lossless)</option>
                  <option value="avif">AVIF (best quality)</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preserveMetadata}
                    onChange={(e) => setPreserveMetadata(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Preserve metadata</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={compressAll}
                disabled={isProcessing || files.every(f => !!f.compressed)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isProcessing ? 'Compressing...' : 'Compress All Images'}
              </button>
              {files.some(f => !!f.url) && (
                <button
                  onClick={downloadAll}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Download All
                </button>
              )}
              <button
                onClick={() => { handleFilesSelected([]); }}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
              >
                + Add more files
              </button>
              <button
                onClick={clearAll}
                className="text-sm text-red-500 hover:text-red-700 underline ml-auto"
              >
                Clear all
              </button>
            </div>
          </div>

          {/* Stats */}
          {totalCompressed > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card p-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Original</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{formatFileSize(totalOriginal)}</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Compressed</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatFileSize(totalCompressed)}</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Saved</p>
                <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
                  {getCompressionPercentage(totalOriginal, totalCompressed)}%
                </p>
              </div>
            </div>
          )}

          {/* File List */}
          <div className="space-y-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="glass-card p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.original.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.originalSize)}
                    {file.compressedSize > 0 && (
                      <span className="text-green-600 dark:text-green-400 ml-2">
                        → {formatFileSize(file.compressedSize)} ({file.savings}% saved)
                      </span>
                    )}
                  </p>
                </div>
                {file.processing && (
                  <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                )}
                {file.url && (
                  <button
                    onClick={() => downloadFile(file)}
                    className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                  >
                    Download
                  </button>
                )}
                {file.error && (
                  <span className="text-xs text-red-500">{file.error}</span>
                )}
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-16 max-w-3xl mx-auto prose dark:prose-invert">
        <h2>How to Compress Images Online</h2>
        <p>
          Our Smart Image Compressor uses advanced algorithms to reduce your image file size
          without visible quality loss. Whether you need to compress a photo to under 100KB for a
          form submission, reduce images for faster web loading, or batch compress hundreds of
          product photos — this tool handles it all.
        </p>
        <h3>Features</h3>
        <ul>
          <li><strong>Target Size Mode:</strong> Specify exact output size in KB or MB</li>
          <li><strong>Quality Mode:</strong> Use the slider for fine-grained control</li>
          <li><strong>Batch Processing:</strong> Compress multiple images simultaneously</li>
          <li><strong>Format Options:</strong> Output as JPEG, WebP, PNG, or AVIF</li>
          <li><strong>Metadata Control:</strong> Choose to preserve or strip EXIF data</li>
          <li><strong>Smart Optimization:</strong> Adaptive algorithm finds the best compression</li>
        </ul>
        <h3>Frequently Asked Questions</h3>
        <h4>How do I compress an image to a specific KB size?</h4>
        <p>
          Select &quot;Target Size Mode&quot;, enter your desired file size (e.g., 200 KB), and click compress.
          Our algorithm will iteratively adjust quality and dimensions to hit your target size.
        </p>
        <h4>Does compression reduce image quality?</h4>
        <p>
          At quality levels above 70%, compression is virtually imperceptible to the human eye.
          Our mozjpeg-based compression produces significantly better results than standard JPEG encoding.
        </p>
      </div>
    </div>
  );
}
