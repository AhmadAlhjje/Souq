import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Heading, Text, Button } from '../atoms';

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  themeClasses: {
    cardBackground: string;
    textPrimary: string;
    textMuted: string;
  };
}

const ActionCard: React.FC<ActionCardProps> = ({
  icon: Icon,
  title,
  description,
  buttonText,
  onButtonClick,
  themeClasses
}) => {
  return (
    <div className={`${themeClasses.cardBackground} rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center`}>
      <div className="bg-teal-600 p-4 rounded-2xl mb-4">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <Heading 
        text={title}
        level={3}
        className={`font-bold ${themeClasses.textPrimary} mb-2`}
      />
      <Text 
        text={description}
        variant="caption"
        className={`${themeClasses.textMuted} mb-4 text-center`}
      />
      <Button
        text={buttonText}
        onClick={onButtonClick}
        variant="ghost"
        className="bg-teal-100 text-teal-600 px-6 py-2 rounded-lg hover:bg-teal-200 transition-colors"
      />
    </div>
  );
};

export default ActionCard;  