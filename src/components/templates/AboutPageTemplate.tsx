'use client';
import React from 'react';
import HeroSection from '../organisms/HeroSection';
import SolutionCard, { Solution } from '../organisms/SolutionCard';
import useTheme from '@/hooks/useTheme';

export interface AboutPageTemplateProps {
  solutions: Solution[];
}

const AboutPageTemplate: React.FC<AboutPageTemplateProps> = ({ solutions }) => {
  const { isDark } = useTheme();

  return (
    <>
      {/* Hero Section */}
      <HeroSection />
            
      {/* About Content Sections - نفس خلفية الـ HeroSection تماماً */}
      <div className={`relative transition-colors duration-500 ${
        isDark 
          ? 'bg-slate-900' 
          : 'bg-gradient-to-br from-teal-50 to-white'
      }`}>
        <div className="container mx-auto px-6 py-16">
          <div className="text-right space-y-16" dir="rtl">
            {solutions.map((solution) => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
          </div>
     
        </div>
      </div>
    </>
  );
};

export default AboutPageTemplate;