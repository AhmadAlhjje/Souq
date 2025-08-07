// components/organisms/CallToAction.tsx

import React from "react";

interface CallToActionProps {
  buttonText: string;
  mainTitle: string;
  subtitle: string;
}

const CallToAction: React.FC<CallToActionProps> = ({
  buttonText,
  mainTitle,
  subtitle,
}) => {
  return (
    <div
      className="
      bg-[#E8F8F5] 
      p-4 sm:p-6 
      rounded-lg 
      shadow-md 
      flex 
      items-center 
      justify-between
      w-full
      max-w-6xl
      mx-auto
      space-x-4
      rtl:space-x-reverse
    "
    >
      {/* الزر */}
      <button
        className="
          bg-[#004D5A] 
          text-white 
          px-5 py-3 
          rounded-full 
          font-bold 
          text-sm md:text-base 
          hover:bg-[#003d47] 
          transition-colors 
          duration-200
          whitespace-nowrap
        "
      >
        {buttonText}
      </button>

      {/* النصوص */}
      <div className="text-right flex-1 space-y-1">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#004D5A] m-0 leading-tight">
          {mainTitle}
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 m-0 leading-tight">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default CallToAction;
