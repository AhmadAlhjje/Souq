import React from 'react';
import { Share2, Bell, Settings } from 'lucide-react';
import { Heading, Text, Button } from '../atoms';

interface NavigationBarProps {
  title: string;
  subtitle: string;
  themeClasses: {
    navBackground: string;
    textPrimary: string;
    textSecondary: string;
    buttonBackground: string;
    borderColor: string;
    buttonIcon: string;
  };
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  title,
  subtitle,
  themeClasses
}) => {
  return (
    <div className={`${themeClasses.navBackground} p-4`}>
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="text-right">
          <Heading 
            text={title}
            level={1}
            className={`text-2xl font-bold ${themeClasses.textPrimary} mb-1`}
          />
          <Text 
            text={subtitle}
            className={themeClasses.textSecondary}
          />
        </div>

        <div className="flex gap-3">
          <button className={`${themeClasses.buttonBackground} p-3 rounded-xl transition-colors ${themeClasses.borderColor} border shadow-sm`}>
            <Share2 className={`w-5 h-5 ${themeClasses.buttonIcon}`} />
          </button>
          <button className={`${themeClasses.buttonBackground} p-3 rounded-xl transition-colors ${themeClasses.borderColor} border shadow-sm`}>
            <Bell className={`w-5 h-5 ${themeClasses.buttonIcon}`} />
          </button>
          <button className="bg-teal-400 hover:bg-teal-500 p-3 rounded-xl transition-colors border border-gray-200 shadow-sm">
            <Settings className="w-5 h-5 text-gray-50" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;