
// templates/AboutPageTemplate.tsx - تم تعديله ليستخدم المكونات المحدثة
import React from 'react';
import HeroSection from '../organisms/HeroSections';
import SolutionCard from '../organisms/SolutionCard';
import CTASection from '../organisms/CTASection';
import { Solution } from '../organisms/SolutionCard';

export interface AboutPageTemplateProps {
  solutions: Solution[];
}

const AboutPageTemplate: React.FC<AboutPageTemplateProps> = ({ solutions }) => {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />
      
      {/* About Content Sections */}
      <div className="relative bg-gradient-to-br from-[#96EDD9]/10 via-white to-[#004D5A]/5">
        <div className="container mx-auto px-6 py-16">
          <div className="text-right space-y-16" dir="rtl">
            {solutions.map((solution) => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
          </div>
          
          {/* CTA Section */}
          <CTASection />
        </div>
      </div>
    </>
  );
};

export default AboutPageTemplate;