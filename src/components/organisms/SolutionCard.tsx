'use client';
// organisms/SolutionCard.tsx - تم تعديله ليستخدم مكوناتك
import React from 'react';
import FeatureItem from '../molecules/FeatureItem';
import Button from '../atoms/Button';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';

export interface SolutionFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Solution {
  id: number;
  title: string;
  description: string;
  image: string;
  buttonIcon: React.ReactNode;
  buttonText: string;
  features: SolutionFeature[];
  background: string;
  reverse: boolean;
}

export interface SolutionCardProps {
  solution: Solution;
}

const SolutionCard: React.FC<SolutionCardProps> = ({ solution }) => {
  const getIconName = (id: number): string => {
    const icons: Record<number, string> = {
      1: 'cart',
      2: 'shield', 
      3: 'users'
    };
    return icons[id] || 'cart';
  };

  return (
    <div className="relative">
      {/* Background Effect */}
      <div className={`absolute inset-0 ${
        solution.id === 1
          ? "bg-gradient-to-l from-[#96EDD9]/20 to-transparent"
          : solution.id === 2
          ? "bg-gradient-to-br from-[#96EDD9]/15 via-white/40 to-[#96EDD9]/25"
          : "bg-[#96EDD9]/30"
      } rounded-3xl blur-3xl`}></div>

      {/* Solution Card */}
      <div className="relative backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 p-6 lg:p-10 items-center">
          
          {/* Content Side */}
          <div className={`${solution.reverse ? "lg:order-2" : ""} space-y-6`}>
            <div>
              <Typography variant="h2" className="mb-3">{solution.title}</Typography>
              <Typography variant="body" className="leading-relaxed">
                {solution.description}
              </Typography>
            </div>
            
            {/* Features List */}
            <div className="space-y-4">
              {solution.features.map((feature, index: number) => (
                <FeatureItem
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
            
            {/* Action Button - استخدم مكون Button الخاص بك */}
            <div className="pt-3">
              <Button 
                variant="primary" 
                size="md"
                startIcon={solution.buttonIcon}
                className="text-sm"
              >
                {solution.buttonText}
              </Button>
            </div>
          </div>
          
          {/* Image Side */}
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
                    <Icon name={getIconName(solution.id) as any} size="lg" />
                  </div>
                </div>
                
                <div className="px-2">
                  <Typography variant="h3" className="mb-3">{solution.title}</Typography>
                  <div className="flex space-x-reverse space-x-3 justify-center">
                    <div className="w-3 h-3 bg-[#96EDD9] rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-[#5CA9B5] rounded-full animate-pulse delay-200"></div>
                    <div className="w-3 h-3 bg-[#004D5A] rounded-full animate-pulse delay-400"></div>
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

export default SolutionCard;
