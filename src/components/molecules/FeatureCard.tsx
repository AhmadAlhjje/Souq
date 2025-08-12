// components/molecules/FeatureCard.tsx
import React from "react";
import Text from "../atoms/Text";

interface FeatureCardProps {
  text: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  index: number;
}

export default function FeatureCard({
  text,
  description,
  icon,
  color,
  index,
}: FeatureCardProps) {
  return (
    <div className="group flex items-start space-x-5 space-x-reverse">
      <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
        <div
          className={`flex items-center justify-center w-12 h-12 ml-4 bg-gradient-to-br ${color} rounded-xl shadow-lg`}
        >
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-lg md:text-xl font-semibold text-[#004D5A] mb-2 leading-tight">
          {text}
        </h4>
        <Text
          text={description}
          className="text-[#004D5A]/60 text-sm leading-relaxed"
        />

        {/* Progress Bar - مصغر */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-0.5">
          <div
            className={`h-0.5 bg-gradient-to-r ${color} rounded-full transition-all duration-1000 group-hover:w-full`}
            style={{ width: `${(index + 1) * 25}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
