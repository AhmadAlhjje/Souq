import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  onFileSelect: (file: File) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = "image/*",
  onFileSelect,
  className = '',
  children,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      
      {children ? (
        <div onClick={handleClick} className={disabled ? 'opacity-50' : 'cursor-pointer'}>
          {children}
        </div>
      ) : (
        <button
          onClick={handleClick}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200
            border-2 border-dashed border-gray-300 rounded-lg
            text-gray-600 transition-colors
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Upload className="w-5 h-5" />
          <span>رفع ملف</span>
        </button>
      )}
    </div>
  );
};

export default FileUpload;