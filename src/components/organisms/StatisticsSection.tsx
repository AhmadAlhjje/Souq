// components/organisms/StatisticsSection.tsx
import React from 'react';
import StatisticCard from '../atoms/StatisticCard';
import Section from '../molecules/Section';
import Heading from '../atoms/Heading';
import Text from '../atoms/Text';
import { FaChartLine, FaUsers, FaCrown, FaArrowUp } from 'react-icons/fa';

const StatisticsSection: React.FC = () => {
  const stats = [
    {
      title: "مبيعات المتاجر والبائعين",
      value: "100,000,000$",
      icon: <FaChartLine />,
      color: "from-green-500 to-green-600",
      description: "إجمالي المبيعات الشهرية"
    },
    {
      title: "بائعون نشيطون",
      value: "+100,000",
      icon: <FaUsers />,
      color: "from-blue-500 to-blue-600",
      description: "تاجر يثق في منصتنا"
    },
    {
      title: "تجار ناجحون",
      value: "+50,000",
      icon: <FaCrown />,
      color: "from-yellow-500 to-yellow-600",
      description: "حققوا أهدافهم معنا"
    }
  ];

  return (
    <div className="relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#004D5A]/5 via-transparent to-[#96EDD9]/5 rounded-3xl blur-3xl"></div>
      
      <div className="relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-[#004D5A]/5 px-4 py-2 rounded-full border border-[#004D5A]/10 mb-4">
            <FaArrowUp className="text-[#004D5A] ml-2" />
            <span className="text-[#004D5A] font-medium text-sm">📊 إحصائيات مذهلة</span>
          </div>
          <Heading 
            text="أرقام تتحدث عن نفسها"
            level={2}
            variant="section"
            className="text-3xl md:text-4xl font-bold text-[#004D5A] mb-4"
          />
          <Text 
            text="نتائج حقيقية حققها شركاؤنا في النجاح"
            variant="subtitle"
            className="text-[#004D5A]/70 max-w-2xl mx-auto"
          />
        </div>

        {/* Statistics Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Card Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <div className="text-white text-2xl">
                    {stat.icon}
                  </div>
                </div>

                {/* Value */}
                <div className="mb-4">
                  <div className="text-4xl md:text-5xl font-bold text-[#004D5A] mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#004D5A] group-hover:to-[#005965] group-hover:bg-clip-text transition-all duration-300">
                    {stat.value}
                  </div>
                  <Text 
                    text={stat.title}
                    className="text-[#004D5A] font-semibold text-lg leading-tight"
                  />
                </div>

                {/* Description */}
                <Text 
                  text={stat.description}
                  variant="caption"
                  className="text-[#004D5A]/60 group-hover:text-[#004D5A]/80 transition-colors duration-300"
                />

                {/* Decorative Element */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-[#96EDD9]/10 to-transparent rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Text 
            text="انضم إلى آلاف التجار الناجحين اليوم"
            className="text-[#004D5A]/80 text-lg font-medium mb-6"
          />
          <button className="bg-gradient-to-r from-[#004D5A] to-[#005965] hover:from-[#005965] hover:to-[#006670] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            ابدأ رحلتك الآن
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;