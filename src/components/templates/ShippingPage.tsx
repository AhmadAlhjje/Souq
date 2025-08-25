"use client"
import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { COLORS } from '../../constants/colors';
import ShippingForm from '../organisms/ShippingForm';
import Button from '../atoms/Button';

const ShippingPage: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const colors = COLORS[theme];

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getBackgroundGradient = () => {
    if (theme === 'light') {
      return 'linear-gradient(135deg, #CFF7EE 0%, #96EDD9 50%, #BAF3E6 100%)';
    } else {
      return 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #374151 100%)';
    }
  };

  return (
    <div 
      className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ 
        background: getBackgroundGradient(),
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Theme Toggle Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="sm"
          className="rounded-full p-2"
          startIcon={theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        >
          {theme === 'light' ? 'الوضع المظلم' : 'الوضع المضيء'}
        </Button>
      </div>

      {/* Main Content - Full Width Container */}
      <div className="flex-1 w-full h-full px-4 py-8 flex items-center justify-center">
        <div className="w-full h-full max-h-full">
          <ShippingForm theme={theme} />
        </div>
      </div>

 
    </div>
  );
};

export default ShippingPage;