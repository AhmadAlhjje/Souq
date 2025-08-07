// components/organisms/ImageWithText.tsx

import React from 'react';

interface ImageWithTextProps {
  src: string;
  alt: string;
  title: string;
}

const ImageWithText: React.FC<ImageWithTextProps> = ({ src, alt, title }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* القالب الذي يحتوي الصورة */}
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-md w-56 h-64">
        <img
          src={src}
          alt={alt}
          className="w-24 h-24 object-contain"
        />
      </div>

      {/* النص خارج القالب، مباشرة تحته */}
      <p className="  text-[#004D5A] text-center leading-relaxed mt-3 max-w-48 text-xl font-bold">
        {title}
      </p>
    </div>
  );
};

export default ImageWithText;