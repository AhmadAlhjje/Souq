import React from "react";
import Heading from "../atoms/Heading";
import Icon, { IconProps } from "../atoms/Icon";

interface Solution {
  id: number;
  title: string;
  reverse?: boolean;
}

interface SolutionImageCardProps {
  solution: Solution;
}

const SolutionImageCard: React.FC<SolutionImageCardProps> = ({ solution }) => {
  // رجع string name بدل component
  const getIconName = (id: number): IconProps["name"] => {
    switch (id) {
      case 1:
        return "rocket";
      case 2:
        return "bolt";
      case 3:
        return "globe";
      default:
        return "rocket";
    }
  };

  return (
    <div className={`${solution.reverse ? "lg:order-1" : ""}`}>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#004D5A]/10 to-[#96EDD9]/10 rounded-3xl transform rotate-2 group-hover:rotate-3 transition-transform duration-500"></div>
        <div className="relative bg-white rounded-3xl p-6 shadow-xl transform group-hover:-rotate-0.5 transition-transform duration-500">
          <div className="w-full h-64 md:h-72 lg:h-80 xl:h-96 rounded-2xl overflow-hidden relative mb-6">
            <img
              src="/images/pexels-jill-wellington-1638660-257816.jpg"
              alt={solution.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#004D5A]/20 to-[#96EDD9]/10 group-hover:opacity-75 transition-opacity duration-300"></div>

            <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <Icon name={getIconName(solution.id)} size="xl" />
            </div>
          </div>

          <div className="px-2">
            <Heading level={4} text={solution.title} className="mb-3" />
            <div className="flex space-x-reverse space-x-3 justify-center">
              <div className="w-3 h-3 bg-[#96EDD9] rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-[#5CA9B5] rounded-full animate-pulse delay-200"></div>
              <div className="w-3 h-3 bg-[#004D5A] rounded-full animate-pulse delay-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionImageCard;
