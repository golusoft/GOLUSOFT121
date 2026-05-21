'use client';

import { useState, useCallback } from 'react';
import { FileUpload } from '@/components/shared/FileUpload';
import { showToast } from '@/components/shared/Toaster';
import { formatFileSize } from '@/lib/utils';

const PRESETS = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Facebook Cover', width: 820, height: 312 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'Twitter Header', width: 1500, height: 500 },
  { name: 'LinkedIn Banner', width: 1584, height: 396 },
  { name: 'WhatsApp DP', width: 500, height: 500 },
  { name: 'Passport (US)', width: 600, height: 600 },
  { name: 'Passport (India)', width: 350, height: 350 },
  { name: 'A4 Print 300DPI', width: 2480, height: 3508 },
  { name: 'HD 1920x1080', width: 1920, height: 1080 },
  { name: '4K 3840x2160', width: 3840, height: 2160 },
];

export default function ResizeImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [unit, setUnit] = useState<'px' | 'percent' | 'inch' | 'cm'>('px');
  const [dpi, setDpi] = useState(72);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [quality, setQuality] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string>('');
  const [resultInfo, setResultInfo] = useState<{ width: number; height: number; size: number } | null>(null);

  const handleFilesSelected = useCallback((files: File[]) => {
    const f = files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResultUrl('');
      setResultInfo(null);
    }
  }, []);

  const applyPreset = (preset: { width: number; height: number }) => {
    setWidth(preset.width.toString());
    setHeight(preset.height.toString());
    setUnit('px');
  };

  const handleResize = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const options: Record<string, unknown> = {
        unit,
        dpi,
        maintainAspectRatio: maintainRatio,
        format,
        quality,
      };

      if (unit === 'percent') {
        options.percentage = parseFloat(width || '100');
      } else {
        if (width) options.width = parseFloat(width);
        if (height) options.height = parseFloat(height);
      }

      formData.append('options', JSON.stringify(options));

      const response = await fetch('/api/image/resize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Resize failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultInfo({
        width: parseInt(response.headers.get('X-New-Width') || '0'),
        height: parseInt(response.headers.get('X-New-Height') || '0'),
        size: blob.size,
      });

      showToast('Image resized successfully!', 'success');
    } catch (error) {
      showToast('Failed to resize image', 'error');
    }

    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `resized_${file?.name?.split('.')[0] || 'image'}.${format === 'jpeg' ? 'jpg' : format}`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Smart Image Resizer
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Resize images by pixels, percentage, inches, or centimeters. Use presets for social media and documents.
        </p>
      </div>

      {!file && (
        <FileUpload
          accept="image/*"
          multiple={false}
          maxSize={50}
          onFilesSelected={handleFilesSelected}
          label="Drop an image here or click to upload"
          description="Supports JPG, PNG, WebP, GIF, BMP, TIFF — up to 50MB"
        />
      )}

      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-5">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Dimensions</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as typeof unit)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                  >
                    <option value="px">Pixels (px)</option>
                    <option value="percent">Percentage (%)</option>
                    <option value="inch">Inches</option>
                    <option value="cm">Centimeters (cm)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {unit === 'percent' ? 'Scale (%)' : 'Width'}
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder={unit === 'percent' ? '100' : '800'}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                    />
                  </div>
                  {unit !== 'percent' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Height</label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="600"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                      />
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintainRatio}
                    onChange={(e) => setMaintainRatio(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs text-gray-700 dark:text-gray-300">Maintain aspect ratio</span>
                </label>

                {(unit === 'inch' || unit === 'cm') && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">DPI</label>
                    <select
                      value={dpi}
                      onChange={(e) => setDpi(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                    >
                      <option value={72}>72 DPI (Screen)</option>
                      <option value={96}>96 DPI (Web)</option>
                      <option value={150}>150 DPI (Draft)</option>
                      <option value={300}>300 DPI (Print)</option>
                      <option value={600}>600 DPI (High Print)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as typeof format)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                  >
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WebP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
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
              </div>

              <button
                onClick={handleResize}
                disabled={isProcessing || (!width && !height)}
                className="w-full mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isProcessing ? 'Resizing...' : 'Resize Image'}
              </button>

              {resultUrl && (
                <button
                  onClick={handleDownload}
                  className="w-full mt-3 px-4 py-3 rounded-xl border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
                >
                  Download ({resultInfo && formatFileSize(resultInfo.size)})
                </button>
              )}
            </div>

            {/* Presets */}
            <div className="glass-card p-5">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Presets</h2>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all text-left"
                  >
                    <span className="block text-gray-900 dark:text-white">{preset.name}</span>
                    <span className="text-gray-400">{preset.width}×{preset.height}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Preview</h2>
                <button
                  onClick={() => { setFile(null); setPreview(''); setResultUrl(''); }}
                  className="text-xs text-gray-500 hover:text-red-500 underline"
                >
                  Change image
                </button>
              </div>
              <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resultUrl || preview}
                  alt="Preview"
                  className="max-w-full max-h-[500px] object-contain"
                />
              </div>
              {resultInfo && (
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <span>Output: {resultInfo.width} × {resultInfo.height}px</span>
                  <span>Size: {formatFileSize(resultInfo.size)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-16 max-w-3xl mx-auto prose dark:prose-invert">
        <h2>Resize Images Online for Free</h2>
        <p>
          Resize any image to exact dimensions in pixels, percentage, inches, or centimeters.
          Our smart resizer maintains aspect ratio by default and supports batch processing.
          Use presets for social media platforms like Instagram, Facebook, YouTube, and Twitter.
        </p>
        <h3>Common Use Cases</h3>
        <ul>
          <li>Resize photos for passport and visa applications</li>
          <li>Create perfect social media images with platform presets</li>
          <li>Prepare images for print with exact DPI settings</li>
          <li>Batch resize product photos for e-commerce</li>
          <li>Reduce image dimensions for faster web loading</li>
        </ul>
      </div>
    </div>
  );
}
