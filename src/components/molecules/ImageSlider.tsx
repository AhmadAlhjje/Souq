import React, { useState, useEffect } from 'react';

interface SlideData {
  id: number;
  image: string;
  title: string;
  description: string;
}

interface ImageSliderProps {
  slides: SlideData[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* الصورة */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg mb-4">
        <img 
          src={slides[currentSlide]?.image || '/api/placeholder/400/250'} 
          alt={slides[currentSlide]?.title || 'Slide'}
          className="w-full h-48 sm:h-64 object-cover transition-all duration-500"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* النقاط المؤشرة */}
      <div className="flex justify-center space-x-2 mb-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
              index === currentSlide 
                ? 'bg-teal-400' 
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* النص */}
      <div className="text-center">
        <h3 className="text-sm sm:text-base font-semibold text-white mb-2">
          {slides[currentSlide]?.title || 'عنوان افتراضي'}
        </h3>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          {slides[currentSlide]?.description || 'وصف افتراضي'}
        </p>
      </div>
    </div>
  );
};

export default ImageSlider;