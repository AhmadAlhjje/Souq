'use client';
// organisms/CTASection.tsx - تم تعديله ليستخدم مكوناتك
import React from 'react';
import Button from '../atoms/Button';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';

const CTASection: React.FC = () => {
  return (
    <div className="mt-16 text-center">
      <div className="bg-gradient-to-br from-[#004D5A] via-[#005965] to-[#006670] rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-24 h-12 bg-[#96EDD9]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#96EDD9]/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/10 rounded-full"></div>
        <div className="absolute top-4 left-4 w-4 h-4 bg-[#96EDD9]/20 rounded rotate-45"></div>
        <div className="absolute bottom-4 right-4 w-5 h-5 border border-white/20 rounded-full"></div>
        
        <div className="relative text-center" dir="rtl">
          {/* Icon - استخدم مكون Icon */}
          <div className="w-20 h-20 bg-[#96EDD9]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Icon name="cart" size="xl" color="#96EDD9" />
          </div>
          
          <Typography variant="h2" className="text-white mb-4">
            هل أنت مستعد للبدء معنا؟
          </Typography>
          
          <Typography className="text-white/90 text-base lg:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            انضم إلى آلاف العملاء الذين يثقون في خدماتنا ويحققون النجاح معنا. 
            دعنا نساعدك في تحويل أفكارك إلى واقع رقمي مميز
          </Typography>
          
          {/* Action Buttons - استخدم مكون Button الخاص بك */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="secondary" 
              size="lg"
              startIcon={<Icon name="cart" size="sm" />}
              className="relative overflow-hidden group"
            >
              ابدأ رحلتك الآن
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              startIcon={<Icon name="users" size="sm" />}
            >
              تواصل معنا
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;