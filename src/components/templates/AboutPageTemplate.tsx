import React from "react";

const AboutPageTemplate = ({ heroContent, solutionsContent, ctaContent }) => {
  return (
    <div className="relative">
      {/* Hero Section */}
      {heroContent}
      
      {/* Solutions Section */}
      <div className="relative bg-gradient-to-br from-[#96EDD9]/10 via-white to-[#004D5A]/5">
        <div className="container mx-auto px-6 py-16">
          <div className="text-right space-y-16" dir="rtl">
            {solutionsContent}
          </div>
          {ctaContent}
        </div>
      </div>
    </div>
  );
};

export default AboutPageTemplate;