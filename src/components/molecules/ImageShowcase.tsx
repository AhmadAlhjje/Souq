// components/molecules/ImageShowcase.tsx
import React from "react";

export default function ImageShowcase() {
  return (
    <div className="relative h-full bg-gradient-to-br from-[#004D5A]/5 to-[#96EDD9]/10">
      <div className="relative w-full h-full min-h-[500px]">
        
        {/* Main Large Image - Fills the entire space completely */}
        <div className="absolute inset-0 group">
          <div className="relative w-full h-full overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">
            <img
              src="/images/image_2025-09-12_20-22-34.png"
              alt="منصة TMC"
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle overlay for better text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}