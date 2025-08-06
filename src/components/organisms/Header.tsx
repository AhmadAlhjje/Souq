// components/organisms/Header.tsx
import React from 'react';
import NavLink from '../atoms/NavLink';
import ActionButtons from '../molecules/ActionButtons';

const Header: React.FC = () => {
  return (
    <nav className="bg-[#96EDD9] shadow-md p-4 flex justify-between items-center">
      {/* Action Buttons */}
      <ActionButtons />

      {/* Navigation Links */}
      <div className="flex space-x-4 space-x-reverse text-[#004D5A]"> {/* space-x-reverse for RTL */}
        <NavLink href="/cart">السلة</NavLink>
        <NavLink href="/blog">المدونة</NavLink>
        <NavLink href="/stores">المتاجر</NavLink>
        <NavLink href="/about">من نحن</NavLink>
        <NavLink href="/">الرئيسية</NavLink>
      </div>
    </nav>
  );
};

export default Header;