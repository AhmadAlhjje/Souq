import React from 'react';
import { Heading, Text } from '../atoms';

interface AboutSectionProps {
  title: string;
  description: string;
  establishedYear: string;
  themeClasses: {
    cardBackground: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
  };
}

const AboutSection: React.FC<AboutSectionProps> = ({
  title,
  description,
  establishedYear,
  themeClasses
}) => {
  return (
    <div className={`${themeClasses.cardBackground} rounded-2xl shadow-lg p-6`}>
      <Heading
        text={title}
        level={3}
        className={`text-lg font-bold ${themeClasses.textPrimary} mb-4`}
      />
      <Text
        text={description}
        className={`${themeClasses.textSecondary} leading-relaxed`}
      />
      <p className={`${themeClasses.textMuted} text-sm mt-4 flex items-center gap-2`}>
        <span>📅</span> {establishedYear}
      </p>
    </div>
  );
};

export default AboutSection;