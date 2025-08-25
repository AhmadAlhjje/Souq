import React from "react";
import Text from "../atoms/Text";
import Button from "../atoms/Button";
import StatItem from "../molecules/StatItem";
import HeroImageCard from "./HeroImageCard";

const HeroSection = () => {
  return (
    <div className="mt-2 relative min-h-screen bg-gradient-to-br from-[#96EDD9] via-[#A8F0DC] to-[#B8F3E0] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 right-1/3 w-40 h-40 bg-gradient-to-br from-[#96EDD9]/30 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-1/4 w-60 h-60 bg-gradient-to-tr from-[#004D5A]/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="min-h-screen flex items-center" dir="rtl">
        <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Text Content */}
            <div className="text-right space-y-8 relative z-10 order-1">
              <div className="space-y-6 animate-in slide-in-from-right duration-1000">
                <div className="flex items-center justify-end gap-4">
                  <div className="w-3 h-3 bg-[#96EDD9] rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-6 animate-in slide-in-from-right duration-1000 delay-300">
                <Text size="xl" className="font-bold leading-relaxed text-[#003940]">
                  شركة 
                  <span className="relative inline-block mx-2">
                    <span className="text-[#004D5A] font-black">TMC</span>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#96EDD9] to-[#004D5A]"></div>
                  </span>
                  Technology Metro Center
                  <span className="block text-lg sm:text-xl lg:text-2xl text-[#004D5A]/80 font-medium mt-2">
                    هي شركة متخصصة في التقنية والتجارة الإلكترونية
                  </span>
                </Text>
                
                <Text color="secondary" className="leading-loose">
                  نوفر منصة متكاملة لبناء المتاجر الإلكترونية بسهولة وأمان، 
                  مع حلول تقنية متقدمة تشمل إدارة المحتوى الشامل والدفع الرقمي، 
                  بالإضافة إلى أدوات تسويقية ذكية تساعد على زيادة التفاعل والمبيعات
                </Text>
              </div>

              <div className="pt-6 animate-in slide-in-from-right duration-1000 delay-500">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="hover:border-[#96EDD9]/30 border-2 border-transparent"
                >
                  ابدأ الآن مجاناً
                </Button>
              </div>

              {/* Stats Section */}
              <div className="pt-2 border-t border-white/40 animate-in slide-in-from-right duration-1000 delay-700">
                <div className="grid grid-cols-3 gap-6 lg:gap-8 text-center">
                  <StatItem value="+60K" label="تاجر نشط" />
                  <StatItem value="24/7" label="دعم تقني" />
                  <StatItem value="99%" label="رضا العملاء" />
                </div>
              </div>
            </div>

            {/* Image Section */}
            <HeroImageCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;