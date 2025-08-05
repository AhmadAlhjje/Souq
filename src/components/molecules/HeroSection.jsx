// components/molecules/HeroSection.jsx
import React from 'react';
import Heading from '../atoms/Heading';
import Text from '../atoms/Text';
import Button from '../atoms/Button';

const HeroSection = () => {
  return (
    <div className="flex flex-col justify-center h-screen bg-green-100 px-6 relative">
      {/* Top Banner */}
      <div className="absolute top-28 right-6 sm:right-10 md:right-28 p-3 bg-white bg-opacity-90 rounded-lg shadow-md">
        <span className="text-sm sm:text-base md:text-lg font-bold text-green-600">
          ✅ انضم لأكثر من 60,000 تاجر نشط في TMC
        </span>
      </div>

      {/* Main Content - Right Aligned */}
      <div className="max-w-lg lg:max-w-xl ml-auto mr-0 text-right">
        <Heading text="كن الشيء الكبير القادم" />
        <Text text=" .TMC احلم كبيرًا، أنشئ بسرعة، وانطلق بعيدًا مع " />
        <Text text="نقدم لكم جميع أنواع الخدمات والمبيع والشراء والشحن." />
        <Button
          text="أنشئ متجرك"
          className= "  mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default HeroSection;