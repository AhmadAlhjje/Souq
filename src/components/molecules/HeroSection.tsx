// components/molecules/HeroSection.tsx
import React from 'react';
import Heading from '../atoms/Heading';
import Text from '../atoms/Text';
import Button from '../atoms/Button';

const HeroSection: React.FC = () => {
  return (
    <div className="flex flex-col justify-center h-screen text-[#004D5A] bg-[#96EDD9] px-6 relative">
      {/* Top Banner */}
      <div className="absolute top-28 mr-8 sm:right-10 md:right-6 p-3 bg-white bg-opacity-90 rounded-lg shadow-md">
        <span className="text-sm sm:text-base md:text-lg font-bold ">
          TMC انضم لأكثر من 60,000 تاجر نشط في  
        </span>
      </div>

      {/* Main Content - Right Aligned */}
      <div className="max-w-lg lg:max-w-xl ml-auto mr-0 text-right ">
        <Heading text="كن الشيء الكبير القادم" />
       
        <Text text="  .TMC احلم كثيراً و أنشأ بسرعة، وانطلق بعيدًا مع " />

        <Text text=" .نقدم لكم جميع أنواع الخدمات والمبيع والشراء والشحن "
        className='' />
        <Button
          text="أنشئ متجرك"
          className="mt-6 mr-14 bg-[#004D5A] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default HeroSection;