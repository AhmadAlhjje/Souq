// components/molecules/ImageShowcase.tsx
import React from "react";

export default function ImageShowcase() {
  return (
    <div className="relative p-8 lg:p-12 bg-gradient-to-br from-[#004D5A]/5 to-[#96EDD9]/10">
      <div className="relative h-full min-h-[400px]">
        
        {/* Main Large Image */}
        <div className="absolute top-0 right-0 w-4/5 h-3/5 group">
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
            <img
              src="/images/image 1.png"
              alt="منصة TMC"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3">
              <p className="text-[#004D5A] font-bold text-sm">لوحة التحكم</p>
            </div>
          </div>
        </div>

        {/* Secondary Image */}
        <div className="absolute bottom-0 left-0 w-3/5 h-2/5 group">
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-500 delay-100">
            <img
              src="/images/image2.png"
              alt="تطبيق الجوال"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3">
              <p className="text-[#004D5A] font-bold text-sm">تطبيق الجوال</p>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-[#96EDD9] to-[#7dd3bf] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/2 w-10 h-10 bg-gradient-to-br from-[#004D5A] to-[#005965] rounded-full opacity-30 animate-pulse delay-500"></div>
        
        {/* Stats Overlay */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div className="text-center">
            <div className="text-xl font-bold text-[#004D5A] mb-1">99.9%</div>
            <div className="text-xs text-[#004D5A]/70">وقت التشغيل</div>
          </div>
        </div>
      </div>
    </div>
  );
}