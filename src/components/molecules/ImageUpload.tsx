import React from 'react';
import { Camera } from 'lucide-react';
import { Avatar, FileUpload } from '../atoms';

interface ImageUploadProps {
  type: 'avatar' | 'cover';
  currentImage?: string | null;
  onImageUpload: (file: File) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  type,
  currentImage,
  onImageUpload,
  size = 'lg',
  className = ''
}) => {
  if (type === 'avatar') {
    return (
      <div className="relative">
        <Avatar
          src={currentImage}
          size={size}
          initials={currentImage ? undefined : "م ت"}
        />
        <FileUpload
          accept="image/*"
          onFileSelect={onImageUpload}
          className="absolute -top-1 -right-1"
        >
          <div className="bg-teal-600 hover:bg-teal-700 text-white p-1.5 rounded-full transition-colors shadow-lg">
            <Camera className="w-3 h-3" />
          </div>
        </FileUpload>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={`h-64 w-full bg-cover bg-center rounded-t-2xl overflow-hidden ${className}`}
        style={{
          backgroundImage: currentImage 
            ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${currentImage})`
            : `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        }}
      />
      <FileUpload
        accept="image/*"
        onFileSelect={onImageUpload}
        className="absolute top-4 right-4"
      >
        <div className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors shadow-lg backdrop-blur-sm">
          <Camera className="w-4 h-4" />
        </div>
      </FileUpload>
    </div>
  );
};

export default ImageUpload;