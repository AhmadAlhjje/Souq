import React from "react";
import { FaRocket, FaUsers } from "react-icons/fa";
import Heading from "../atoms/Heading";
import Text from "../atoms/Text";
import Button from "../atoms/Button";
import IconWrapper from "../molecules/IconWrapper";

const FinalCTASection: React.FC = () => {
  return (
    <div className="mt-16 text-center">
      <div className="bg-gradient-to-br from-[#004D5A] via-[#005965] to-[#006670] rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-24 h-12 bg-[#96EDD9]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#96EDD9]/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/10 rounded-full"></div>
        <div className="absolute top-4 left-4 w-4 h-4 bg-[#96EDD9]/20 rounded rotate-45"></div>
        <div className="absolute bottom-4 right-4 w-5 h-5 border border-white/20 rounded-full"></div>
        
        <div className="relative text-center" dir="rtl">
          <IconWrapper 
            icon={<FaRocket className="w-8 h-8 text-[#96EDD9]" />}
            size="large"
            gradient="from-[#96EDD9]/20 to-[#96EDD9]/30"
          />
          
          <Heading 
            text="هل أنت مستعد للبدء معنا؟"
            level={2} 
            variant="hero"
            className="mt-6 mb-4"
          />
          
          <Text 
            text="انضم إلى آلاف العملاء الذين يثقون في خدماتنا ويحققون النجاح معنا. دعنا نساعدك في تحويل أفكارك إلى واقع رقمي مميز"
            variant="hero"
            className="mb-8 max-w-2xl mx-auto leading-relaxed opacity-90"
          />
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              text="ابدأ رحلتك الآن"
              variant="secondary" 
              size="lg"
              startIcon={<FaRocket className="w-4 h-4" />}
            />
            
            <Button 
              text="تواصل معنا"
              variant="outline" 
              size="lg"
              startIcon={<FaUsers className="w-4 h-4" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalCTASection;