// components/organisms/FeatureList.tsx

import React from 'react';
import Image from 'next/image';
import Heading from '../atoms/Heading';

interface FeatureListProps {
  title: string;
  features: { text: string; icon: React.ReactNode }[]; // ← تم التحديث
  images: { src: string; alt: string }[];
}

const FeatureList: React.FC<FeatureListProps> = ({ title, features, images }) => {
  return (
    <div
      className="
        bg-[#E8F8F5] 
        p-16
        rounded-2xl 
        shadow-xl
        w-full
        max-w-screen-2xl
        mx-auto
        flex 
        items-start 
        gap-16
        min-h-96
        dir='rtl'
      "
      style={{ maxWidth: '1400px' }}
    >
      {/* القسم الأيسر: الصور */}
      <div className="flex-shrink-0 flex flex-col items-center space-y-10">
        {images.map((image, index) => (
          <div
            key={index}
            className="
              w-64 h-64 overflow-hidden rounded-2xl ml-6 
              shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out
              transform hover:scale-105
            "
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={240}
              height={240}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* القسم الأيمن: النصوص */}
      <div className="flex-1 text-right space-y-7 mt-16 ">
        {/* العنوان */}
        <h2 className="text-5xl md:text-4xl space-y-7 font-bold text-[#004D5A] leading-tight">
          {title}
        </h2>
       
       <h6 className='text-[#004D5A] text-xl'>
        حقِّق نمو علامتك التجارية في بيع البراغي والشبكات والرواترات 
       </h6>
       <h6 className='text-[#004D5A] text-xl'>
        مع حلول نُسجت بعناية
                لتسهِّل إدارة متجرك

       </h6>
       <h6 className='text-[#004D5A] text-xl'>
        وتقدِّم تجربة تسوُّق استثنائية لعملائك

       </h6>
        {/* القائمة */}
        <ul className="space-y-3 pl-10"> {/* ← استخدم pl-10 بدل pr-10 (في RTL) */}
          {features.map((feature, index) => (
            <li
              key={index}
              className="
                flex 
                items-start 
                justify-end        {/* ← يجعل المحتوى يبدأ من اليمين */}
                gap-6              
                text-right
              "
            >

              {/* النص (على اليسار بعد الترقيم) */}
              <span className=" font-bold  text-[#004D5A] text-xl md:text-xl leading-relaxed text-right max-w-3xl">
                {feature.text}
              </span>
              {/* الترقيم (على اليمين) */}
              <span className="flex-shrink-0 text-3xl font-bold text-[#004D5A] mt-0.5">
                {feature.icon}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeatureList;