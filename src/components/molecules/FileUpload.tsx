// src/components/molecules/FileUpload.tsx
import React, { useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  title: string;
  description: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
  error?: string;
  className?: string;
  previewType?: 'cover' | 'logo';
}

const FileUpload: React.FC<FileUploadProps> = ({
  title,
  description,
  file,
  onFileChange,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024,
  error,
  className = '',
  previewType = 'cover'
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    if (selectedFile.size > maxSize) {
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      return;
    }

    onFileChange(selectedFile);
  };

  const removeFile = () => {
    onFileChange(null);
  };

  return (
    <div className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 ${className}`}>
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
          dragOver 
            ? 'border-teal-400 bg-teal-50 dark:bg-teal-900/20' 
            : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
        }`}
      >
        {file ? (
          <div className="relative group">
            {previewType === 'cover' ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Cover Preview"
                className="w-full h-40 object-cover rounded-lg"
              />
            ) : (
              <div className="w-32 h-32 mx-auto bg-white dark:bg-slate-100 rounded-lg p-2 shadow-sm">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Logo Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <button
              onClick={removeFile}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center
                hover:bg-red-600 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 truncate">
              {file.name}
            </div>
          </div>
        ) : (
          <div>
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              اسحب الصورة هنا أو انقر للاختيار
            </p>
            <label className="inline-block px-4 py-2 bg-teal-500 text-white rounded-lg text-sm cursor-pointer
              hover:bg-teal-600 transition-colors duration-200">
              {previewType === 'cover' ? 'اختر صورة' : 'اختر شعار'}
              <input
                type="file"
                accept={accept}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileSelection(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;