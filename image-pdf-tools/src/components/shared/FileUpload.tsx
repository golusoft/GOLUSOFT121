'use client';

import { useCallback, useState } from 'react';
import { cn, formatFileSize } from '@/lib/utils';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onFilesSelected: (files: File[]) => void;
  label?: string;
  description?: string;
}

export function FileUpload({
  accept = 'image/*',
  multiple = true,
  maxSize = 50,
  onFilesSelected,
  label = 'Drop files here or click to upload',
  description = 'Supports JPG, PNG, WebP, GIF, BMP, TIFF',
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files).filter(
        file => file.size <= maxSize * 1024 * 1024
      );
      if (files.length > 0) onFilesSelected(files);
    },
    [maxSize, onFilesSelected]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter(
        file => file.size <= maxSize * 1024 * 1024
      );
      if (files.length > 0) onFilesSelected(files);
      e.target.value = '';
    },
    [maxSize, onFilesSelected]
  );

  return (
    <div
      className={cn(
        'upload-zone relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl cursor-pointer transition-all duration-300',
        'bg-gradient-to-br from-brand-50/50 to-purple-50/50 dark:from-brand-950/20 dark:to-purple-950/20',
        'hover:from-brand-50 hover:to-purple-50 dark:hover:from-brand-950/30 dark:hover:to-purple-950/30',
        dragOver && 'dragover scale-[1.02]'
      )}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
      />
      <div className="flex flex-col items-center text-center pointer-events-none">
        <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
          {label}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {description}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Max file size: {maxSize}MB {multiple && '• Multiple files supported'}
        </p>
      </div>
    </div>
  );
}
