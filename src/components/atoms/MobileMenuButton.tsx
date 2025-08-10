import React from 'react';
import { Menu, X } from "lucide-react";
import useTheme from "../../hooks/useTheme";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onToggle }) => {
  const { isDark } = useTheme();

  return (
    <button
      onClick={onToggle}
      className={`lg:hidden flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
        isDark 
          ? 'bg-slate-700/30 hover:bg-slate-600/30' 
          : 'bg-white/20 hover:bg-white/30'
      }`}
    >
      {isOpen ? 
        <X className={`w-6 h-6 ${isDark ? 'text-emerald-300' : 'text-[#004D5A]'}`} /> : 
        <Menu className={`w-6 h-6 ${isDark ? 'text-emerald-300' : 'text-[#004D5A]'}`} />
      }
    </button>
  );
};

export default MobileMenuButton;