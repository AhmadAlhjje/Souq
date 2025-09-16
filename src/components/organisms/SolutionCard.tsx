// ===========================================
// 2. SolutionCard.tsx - ألوان مطابقة تماماً  
// ===========================================
'use client';
import React from 'react';
import FeatureItem from '../molecules/FeatureItem';
import Button from '../atoms/Button';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import useTheme from '@/hooks/useTheme';

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
  buttonIcon: React.ReactNode | null;
  buttonText: string;
  features: SolutionFeature[];
  background: string;
  reverse: boolean;
}

export interface SolutionCardProps {
  solution: Solution;
}

const SolutionCard: React.FC<SolutionCardProps> = ({ solution }) => {
  const { isDark } = useTheme();
  
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
      <div className={`absolute inset-0 rounded-3xl blur-3xl transition-colors duration-300 ${
        isDark 
          ? (solution.id === 1
              ? "bg-emerald-500/20"
              : solution.id === 2
              ? "bg-emerald-500/15"
              : "bg-emerald-500/30")
          : (solution.id === 1
              ? "bg-gradient-to-l from-teal-500/20 to-transparent"
              : solution.id === 2
              ? "bg-gradient-to-br from-teal-500/15 via-white/40 to-teal-500/25"
              : "bg-teal-500/30")
      }`}></div>

      {/* Solution Card */}
      <div className={`relative backdrop-blur-sm rounded-3xl shadow-lg border overflow-hidden transition-colors duration-300 ${
        isDark 
          ? 'bg-slate-800/50 border border-slate-600' 
          : 'bg-white border border-gray-100'
      }`}>
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 p-6 lg:p-10 items-center">
          
          {/* Content Side */}
          <div className={`${solution.reverse ? "lg:order-2" : ""} space-y-6`}>
            <div>
              <Typography 
                variant="h2" 
                className={`mb-3 transition-colors duration-300 ${
                  isDark ? 'text-emerald-300' : 'text-teal-800'
                }`}
              >
                {solution.title}
              </Typography>
              <Typography 
                variant="body" 
                className={`leading-relaxed transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : 'text-gray-600'
                }`}
              >
                {solution.description}
              </Typography>
            </div>
            
            {/* Features List */}
            <div className="space-y-3">
              {solution.features.map((feature, index: number) => (
                <FeatureItem
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
            
            {/* Action Button - يظهر فقط عند وجود نص */}
            {solution.buttonText && solution.buttonText.trim() && (
              <div className="pt-3">
                <Button 
                  variant="primary" 
                  size="md"
                  startIcon={solution.buttonIcon}
                  className={`text-sm transition-colors duration-300 ${
                    isDark 
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  {solution.buttonText}
                </Button>
              </div>
            )}
          </div>
          
          {/* Image Side */}
          <div className={`${solution.reverse ? "lg:order-1" : ""}`}>
            <div className="relative group">
              <div className={`absolute inset-0 rounded-3xl transform rotate-2 group-hover:rotate-3 transition-all duration-500 ${
                isDark 
                  ? 'bg-slate-700/20' 
                  : 'bg-gradient-to-br from-teal-800/10 to-teal-500/10'
              }`}></div>
              <div className={`relative rounded-3xl p-6 shadow-xl transform group-hover:-rotate-0.5 transition-all duration-500 ${
                isDark ? 'bg-gray-200' : 'bg-white'
              }`}>
                <div className="w-full h-64 md:h-72 lg:h-80 xl:h-96 rounded-2xl overflow-hidden relative mb-6">
                  <img 
                    src={solution.image} 
                    alt={solution.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 group-hover:opacity-75 transition-opacity duration-300 ${
                    isDark 
                      ? 'bg-slate-900/30' 
                      : 'bg-gradient-to-br from-teal-800/20 to-teal-500/10'
                  }`}></div>
                  
                  <div className={`absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-all duration-300 ${
                    isDark ? 'bg-gray-400' : 'bg-white/90'
                  }`}>
                    <Icon name={getIconName(solution.id) as any} size="lg" />
                  </div>
                </div>
                
                <div className="px-2">
                
                  <div className="flex space-x-reverse space-x-3 justify-center">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${
                      isDark ? 'bg-emerald-400' : 'bg-teal-500'
                    }`}></div>
                    <div className={`w-3 h-3 rounded-full animate-pulse delay-200 ${
                      isDark ? 'bg-emerald-500' : 'bg-teal-600'
                    }`}></div>
                    <div className={`w-3 h-3 rounded-full animate-pulse delay-400 ${
                      isDark ? 'bg-emerald-600' : 'bg-teal-800'
                    }`}></div>
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