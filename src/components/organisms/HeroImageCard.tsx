import React from "react";
import { FaRocket, FaPlug, FaGlobe, FaShieldAlt } from "react-icons/fa";
import Heading from "../atoms/Heading";
import Text from "../atoms/Text";
import Icon from "../atoms/Icon";
import IconWrapper from "../molecules/IconWrapper";

const HeroImageCard = () => {
  return (
    <div className="relative order-2 animate-in slide-in-from-left duration-1000 delay-200">
      <div className="relative group">
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#96EDD9]/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-[#004D5A]/20 rounded-full blur-lg animate-pulse delay-1000"></div>
        
        <div className="relative z-10 flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
          <div className="relative transform group-hover:scale-105 transition-transform duration-700">
            <div className="absolute inset-0 bg-gradient-to-br from-[#96EDD9]/40 to-[#004D5A]/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"></div>
            
            <div className="relative w-72 h-80 lg:w-80 lg:h-96 xl:w-96 xl:h-[420px] max-w-full rounded-3xl shadow-2xl bg-gradient-to-br from-[#96EDD9] via-[#5CA9B5] to-[#004D5A] p-1">
              <div className="w-full h-full bg-white/95 backdrop-blur-sm rounded-3xl p-6 lg:p-8 flex flex-col items-center justify-center relative overflow-hidden">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 right-4 w-12 h-12 border-2 border-[#004D5A] rounded-lg rotate-12"></div>
                  <div className="absolute bottom-6 left-6 w-8 h-8 border border-[#96EDD9] rounded-full"></div>
                  <div className="absolute top-1/2 left-4 w-6 h-6 bg-[#5CA9B5] rounded rotate-45"></div>
                </div>
                
                <div className="relative z-10 mb-6">
                  <IconWrapper 
                    icon={<Icon icon={FaRocket} size="3xl" color="white" />}
                    size="xl"
                    gradient="from-[#004D5A] to-[#005965]"
                  />
                </div>
                
                <div className="text-center relative z-10">
                  <Heading level={3} className="mb-3">التميز التقني</Heading>
                  <Text size="sm" color="secondary" className="mb-4 leading-relaxed">
                    نحول أفكارك إلى حلول رقمية متقدمة تساعدك في تحقيق أهدافك التجارية
                  </Text>
                  
                  <div className="flex justify-center space-x-reverse space-x-4 mb-4">
                    <IconWrapper icon={<Icon icon={FaPlug} size="sm" />} size="sm" />
                    <IconWrapper icon={<Icon icon={FaGlobe} size="sm" />} size="sm" />
                    <IconWrapper icon={<Icon icon={FaShieldAlt} size="sm" />} size="sm" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-2">
                      <div className="text-lg font-bold text-[#004D5A]">5+</div>
                      <div className="text-xs text-[#004D5A]/60">سنوات خبرة</div>
                    </div>
                    <div className="p-2">
                      <div className="text-lg font-bold text-[#004D5A]">100%</div>
                      <div className="text-xs text-[#004D5A]/60">جودة عالية</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroImageCard;