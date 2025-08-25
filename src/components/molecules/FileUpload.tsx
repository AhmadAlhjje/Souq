import React, { useState } from 'react';
import { COLORS } from '../../constants/colors';
import { X, FileText, ImageIcon } from 'lucide-react';
import Label from '../atoms/Label';

interface FileUploadProps {
  label: string;
  icon: React.ReactNode;
  accept?: string;
  onChange: (file: File | null) => void;
  theme?: 'light' | 'dark';
  disabled?: boolean;
  error?: string;
  helperText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  icon, 
  accept, 
  onChange, 
  theme = 'light',
  disabled = false,
  error,
  helperText
}) => {
  const colors = COLORS[theme];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
    
    onChange(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onChange(null);
    
    // Clean up preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className="mb-4">
      <Label>{label}</Label>
      
      {!selectedFile ? (
        // Upload Area
        <label 
          className={`
            flex flex-col items-center justify-center w-full h-32 
            border-2 border-dashed rounded-lg cursor-pointer 
            transition-all duration-300 hover:shadow-md
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${error ? 'border-red-500' : ''}
          `}
          style={{ 
            borderColor: error ? '#ef4444' : '#1a1a1a',
            backgroundColor: colors.background.secondary + '20'
          }}
          onMouseEnter={(e) => {
            if (!disabled && !error) {
              e.currentTarget.style.borderColor = '#000000';
              e.currentTarget.style.backgroundColor = colors.background.accent + '30';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !error) {
              e.currentTarget.style.borderColor = '#1a1a1a';
              e.currentTarget.style.backgroundColor = colors.background.secondary + '20';
            }
          }}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <p 
              className="text-xs sm:text-sm text-center px-2 mb-2 font-medium" 
              style={{ color: '#1a1a1a' }}
            >
              اضغط لاختيار صورة
            </p>
            <div 
              className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3" 
              style={{ color: disabled ? colors.text.muted : '#1a1a1a' }}
            >
              {icon}
            </div>
            <p 
              className="text-xs sm:text-sm text-center px-2" 
              style={{ color: disabled ? colors.text.muted : colors.text.primary }}
            >
              {label}
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled}
          />
        </label>
      ) : (
        // Preview Area
        <div 
          className="relative w-full h-32 border-2 rounded-lg overflow-hidden"
          style={{ 
            borderColor: error ? '#ef4444' : '#1a1a1a',
            backgroundColor: colors.background.primary
          }}
        >
          {previewUrl ? (
            // Image Preview
            <img 
              src={previewUrl} 
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : (
            // File Icon for non-images
            <div className="flex flex-col items-center justify-center h-full">
              <FileText size={32} style={{ color: colors.primary }} />
              <p className="text-xs mt-2 text-center px-2" style={{ color: colors.text.primary }}>
                {selectedFile.name}
              </p>
            </div>
          )}
          
          {/* Remove Button */}
          <button
            onClick={handleRemoveFile}
            className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            type="button"
          >
            <X size={14} />
          </button>
          
          {/* File Info Overlay */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2"
          >
            <p className="text-xs truncate">{selectedFile.name}</p>
            <p className="text-xs opacity-75">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-500 text-right">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500 text-right">{helperText}</p>
      )}
    </div>
  );
};

export default FileUpload;