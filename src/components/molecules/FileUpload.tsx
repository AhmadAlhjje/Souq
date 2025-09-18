// src/components/molecules/FileUpload.tsx
import React, { useState } from 'react';
import { Upload, X, AlertCircle, FileText } from 'lucide-react';

// Support both versions by combining interfaces
interface BaseFileUploadProps {
  accept?: string;
  maxSize?: number;
  error?: string;
  className?: string;
  disabled?: boolean;
  helperText?: string;
  onFileChange?: (file: File | null) => void;
  onChange?: (file: File | null) => void;
}

// Version 1 props (shippings branch)
interface FileUploadV1Props extends BaseFileUploadProps {
  label: string;
  icon: React.ReactNode;
  theme?: 'light' | 'dark';
  variant?: 'v1';
}

// Version 2 props (deploy branch)
interface FileUploadV2Props extends BaseFileUploadProps {
  title: string;
  description: string;
  file?: File | null;
  previewType?: 'cover' | 'logo';
  variant?: 'v2';
}

type FileUploadProps = FileUploadV1Props | FileUploadV2Props;

const FileUpload: React.FC<FileUploadProps> = (props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(
    'file' in props ? props.file || null : null
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const isV1 = 'label' in props;
  const isV2 = 'title' in props;

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    // Call the appropriate callback
    if (props.onChange) props.onChange(file);
    if (props.onFileChange) props.onFileChange(file);
  };

  const handleFileSelection = (selectedFile: File) => {
    const maxSize = props.maxSize || 10 * 1024 * 1024;
    
    if (selectedFile.size > maxSize) {
      return;
    }

    if (props.accept && !selectedFile.type.match(props.accept.replace('*', '.*'))) {
      return;
    }

    handleFileChange(selectedFile);
  };

  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    handleFileChange(null);
  };

  // Drag and drop handlers for V2
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

 // Render V1 (shippings branch style)
if (isV1) {
  const v1Props = props as FileUploadV1Props;
  const theme = v1Props.theme || 'light';
  
  return (
    <div className="mb-4">
      {/* ✅ تعديل لون التسمية ليكون أبيض في الوضع الداكن */}
      <label className={`block text-sm font-medium mb-2 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {v1Props.label}
      </label>
      
      {!selectedFile ? (
        <label 
          className={`
            flex flex-col items-center justify-center w-full h-32 
            border-2 border-dashed rounded-lg cursor-pointer 
            transition-all duration-300 hover:shadow-md
            ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${props.error ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'}
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}
          `}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-400'
            }`}>
              {v1Props.icon}
            </div>
            {/* ✅ تعديل نص "اضغط لاختيار صورة" */}
            <p className={`text-xs sm:text-sm text-center px-2 mb-2 font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              اضغط لاختيار صورة
            </p>
            {/* ✅ تعديل نص التسمية المكررة */}
            <p className={`text-xs sm:text-sm text-center px-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {v1Props.label}
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept={props.accept}
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              handleFileChange(file);
            }}
            disabled={props.disabled}
          />
        </label>
      ) : (
        <div className={`relative w-full h-32 border-2 rounded-lg overflow-hidden ${
          props.error ? 'border-red-500' : 'border-gray-300'
        }`}>
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt={v1Props.label}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <FileText size={32} className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <p className={`text-xs mt-2 text-center px-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {selectedFile.name}
              </p>
            </div>
          )}
          
          <button
            onClick={removeFile}
            className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            type="button"
          >
            <X size={14} />
          </button>
          
          <div className={`absolute bottom-0 left-0 right-0 p-2 ${
            theme === 'dark' ? 'bg-black bg-opacity-70 text-white' : 'bg-black bg-opacity-70 text-white'
          }`}>
            <p className="text-xs truncate">{selectedFile.name}</p>
            <p className="text-xs opacity-75">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      )}
      
      {props.error && (
        <p className="mt-1 text-xs text-red-500 text-right">{props.error}</p>
      )}
      {props.helperText && !props.error && (
        <p className={`mt-1 text-xs text-right ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {props.helperText}
        </p>
      )}
    </div>
  );
}
  // Render V2 (deploy branch style)
  if (isV2) {
    const v2Props = props as FileUploadV2Props;
    
    return (
      <div className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 ${props.className}`}>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{v2Props.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {v2Props.description}
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
          {selectedFile ? (
            <div className="relative group">
              {v2Props.previewType === 'cover' ? (
                <img
                  src={previewUrl || URL.createObjectURL(selectedFile)}
                  alt="Cover Preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
              ) : (
                <div className="w-32 h-32 mx-auto bg-white dark:bg-slate-100 rounded-lg p-2 shadow-sm">
                  <img
                    src={previewUrl || URL.createObjectURL(selectedFile)}
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
                {selectedFile.name}
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
                {v2Props.previewType === 'cover' ? 'اختر صورة' : 'اختر شعار'}
                <input
                  type="file"
                  accept={props.accept}
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
        
        {props.error && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {props.error}
          </p>
        )}
      </div>
    );
  }

  return null;
};

export default FileUpload;