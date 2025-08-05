// components/organisms/Header.jsx
import React from 'react';
import NavLink from '../atoms/NavLink';
import ActionButtons from '../molecules/ActionButtons';

const Header = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        {/* Action Buttons */}
      <ActionButtons />
      {/* Links */}
      <div className="flex space-x-4">
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