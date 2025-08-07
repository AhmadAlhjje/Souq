// components/atoms/NavLink.tsx
import React from 'react';
import Link from 'next/link';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ 
  href, 
  children, 
  className = '', 
  isActive = false 
}) => {
  return (
    <Link
      href={href}
      className={`
        relative px-4 py-2 font-medium text-[#004D5A] 
        transition-all duration-300 ease-in-out
        hover:text-[#002A33] hover:scale-105
        before:absolute before:bottom-0 before:left-0 before:right-0 
        before:h-0.5 before:bg-[#004D5A] before:transform before:scale-x-0 
        before:transition-transform before:duration-300 before:origin-center
        hover:before:scale-x-100
        ${isActive ? 'text-[#002A33] font-bold before:scale-x-100' : ''}
        ${className}
      `}
    >
      {children}
    </Link>
  );
};

export default NavLink;