// components/organisms/ServicesSection.tsx
import React from "react";
import ServiceCard from "../molecules/ServiceCard";

const ServicesSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <ServiceCard
        title="خيار 3"
        description="وصف الخدمة الثالثة."
        imageSrc="/service3.jpg"
        buttonText="اقرأ المزيد"
      />
      <ServiceCard
        title="خيار 2"
        description="وصف الخدمة الثانية."
        imageSrc="/service2.jpg"
        buttonText="اقرأ المزيد"
      />{" "}
      <ServiceCard
        title="خيار 1"
        description="وصف الخدمة الأولى."
        imageSrc="/service1.jpg"
        buttonText="اقرأ المزيد"
      />
    </div>
  );
};

export default ServicesSection;
