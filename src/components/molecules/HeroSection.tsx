"use client";
import React, { useEffect, useRef, useState } from "react";
import Heading from "../atoms/Heading";
import Text from "../atoms/Text";
import { useTranslation } from "react-i18next";
import Link from "next/link";

const HeroSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
      return () => section.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  // Dynamic classes based on direction
  const textAlign = isRTL ? "text-right" : "text-left";
  const justifyContent = isRTL ? "justify-start" : "justify-end";
  const marginAuto = isRTL ? "ml-auto" : "mr-auto";
  const gradientDirection = isRTL ? "to-l" : "to-r";
  const bannerPosition = isRTL
    ? "right-4 sm:right-8 md:right-12"
    : "left-4 sm:left-8 md:left-12";

  return (
    <div 
      ref={sectionRef}
      className="relative mt-16 min-h-screen bg-gradient-to-br from-[#96EDD9] via-[#A8F0DC] to-[#B8F3E0] overflow-hidden"
    >
      {/* Enhanced Background Pattern with Parallax */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute top-20 right-20 w-32 h-32 bg-white rounded-full transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-40 left-20 w-24 h-24 bg-white rounded-full transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
          }}
        ></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/4 right-1/3 w-8 h-8 bg-white/50 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 left-1/4 w-6 h-6 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Enhanced Top Banner with slide-down animation */}
      <div className={`absolute top-6 ${bannerPosition} z-10 ${isVisible ? 'animate-slide-down' : 'opacity-0 -translate-y-4'}`}>
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 transition-all duration-300 hover:shadow-xl hover:scale-105">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#004D5A] rounded-full animate-pulse"></div>
            <span className="text-sm sm:text-base font-bold text-[#004D5A]">
              {t("hero_banner")}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Container - الصورة دائماً على اليسار والنص على اليمين */}
      <div className="grid lg:grid-cols-2 gap-0 min-h-screen">
        {/* Image Section - دائماً الترتيب الأول (اليسار) */}
        <div className="relative flex items-center justify-center p-8 order-1">
          <div className={`relative w-full max-w-2xl ${isVisible ? 'animate-fade-in-left' : 'opacity-0 -translate-x-8'}`} style={{animationDelay: '0.4s'}}>
            {/* Floating decorative elements around image */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#004D5A]/20 to-transparent rounded-full animate-float"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-[#96EDD9] to-[#A8F0DC] rounded-full animate-float" style={{animationDelay: '1s'}}></div>
            
            {/* Main Hero Image with enhanced effects */}
            <div className="relative group">
              <div className="relative w-full h-auto rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-all duration-700 group-hover:rotate-1">
                <img
                  src="/images/image 76.png"
                  alt={t('hero_image_alt')}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#004D5A]/10 to-transparent group-hover:from-[#004D5A]/5 transition-all duration-500"></div>
                
                {/* Overlay effects on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#004D5A]/30 to-[#96EDD9]/30 opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10 blur-xl scale-110"></div>
            </div>
          </div>
        </div>

        {/* Text Content - دائماً الترتيب الثاني (اليمين) */}
        <div className="flex items-center justify-center px-6 sm:px-12 md:px-16 lg:px-20 order-2">
          <div className={`max-w-2xl ${textAlign} space-y-8 relative z-10`}>
            {/* Main Heading with typewriter effect */}
            <div className={`space-y-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`} style={{animationDelay: '0.3s'}}>
              <Heading
                text={t("hero_title")}
                level={1}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#004D5A] leading-tight hover:text-[#003940] transition-colors duration-300"
              />

              {/* Decorative Line with expand animation */}
              <div
                className={`w-20 h-1 bg-gradient-${gradientDirection} from-[#004D5A] to-transparent ${marginAuto} rounded-full transform origin-left transition-all duration-1000 ${isVisible ? 'scale-x-100' : 'scale-x-0'}`}
                style={{animationDelay: '0.8s'}}
              ></div>
            </div>

            {/* Description Text with slide-in effect */}
            <div className={`space-y-6 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`} style={{animationDelay: '0.6s'}}>
              <Text
                text={t("hero_subtitle")}
                className="text-xl sm:text-2xl text-[#003940] font-medium leading-relaxed hover:text-[#004D5A] transition-colors duration-300"
              />

              <Text
                text={t("hero_description")}
                className="text-lg sm:text-xl text-[#004D5A]/80 leading-relaxed"
              />
            </div>

            {/* Call to Action with bounce effect */}
            <div className={`pt-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`} style={{animationDelay: '0.9s'}}>
              <Link
                href="/LoginPage"
                className="group relative bg-[#004D5A] hover:bg-[#003940] text-white font-bold py-4 px-8 sm:px-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 text-base sm:text-lg inline-block"
                prefetch={true}
              >
                <span className="relative z-10">{t("create_store_free")}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#003940] to-[#004D5A] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* Stats with counter animation */}
            <div className={`pt-8 border-t border-white/30 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`} style={{animationDelay: '1.2s'}}>
              <div
                className={`flex ${
                  isRTL ? "justify-start" : "justify-end"
                } gap-8 text-center`}
              >
                <div className="space-y-2 transform hover:scale-110 transition-transform duration-300">
                  <div className="text-2xl font-bold text-[#004D5A] animate-counter">60K+</div>
                  <div className="text-sm text-[#004D5A]/70">
                    {t("hero_stats_active_traders")}
                  </div>
                </div>
                <div className="space-y-2 transform hover:scale-110 transition-transform duration-300">
                  <div className="text-2xl font-bold text-[#004D5A] animate-counter">24/7</div>
                  <div className="text-sm text-[#004D5A]/70">
                    {t("hero_stats_tech_support")}
                  </div>
                </div>
                <div className="space-y-2 transform hover:scale-110 transition-transform duration-300">
                  <div className="text-2xl font-bold text-[#004D5A] animate-counter">99%</div>
                  <div className="text-sm text-[#004D5A]/70">
                    {t("hero_stats_customer_satisfaction")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Gradient with animated particles */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/5 to-transparent pointer-events-none">
        <div className="absolute bottom-4 left-1/4 w-1 h-1 bg-white/50 rounded-full animate-ping"></div>
        <div className="absolute bottom-8 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-12 left-1/2 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(2rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-2rem);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes counter {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out forwards;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-counter {
          animation: counter 1s ease-out 1.5s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;