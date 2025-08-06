// components/molecules/ServiceCard.tsx
import React from 'react';
import Image from 'next/image';
import Button from '../atoms/Button';
import { HiArrowNarrowLeft } from 'react-icons/hi';    // Heroicons

interface ServiceCardProps {
  title: string;
  description: string;
  imageSrc: string;
  buttonText: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, imageSrc, buttonText }) => {
  return (
    <div
      className="bg-white w-full max-w-[310px] h-[350px] rounded-[10px] border border-[#004D5A] shadow-[0_0_50px_rgba(0,0,0,0.19)] text-right flex flex-col mx-auto"
      style={{ direction: 'rtl' }}
    >
      {/* الصورة */}
      <div className="flex justify-center mt-3">
        <Image
          src={imageSrc}
          alt={title}
          width={120}
          height={80}
          className="rounded object-cover"
        />
      </div>

      {/* النصوص */}
      <div className="px-4 mt-24 flex-grow">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-gray-600 text-sm mt-1 leading-tight">{description}</p>
      </div>

      {/* الزر في الأسفل */}
      <div className="px-4 pb-4 text-center">
        <Button
          text={buttonText }
            endIcon={<HiArrowNarrowLeft className="text-2xl " />}

          className="bg-transparent border border-green-300 hover:bg-gray-100 px-4 py-1.5 rounded-full block mx-auto text-xs font-medium"
        />    
      </div>
    </div>
  );
};

export default ServiceCard;