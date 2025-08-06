// components/atoms/NavLink.tsx
import React from 'react';
import Link from 'next/link';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className = '' }) => {
  return (
    <Link
      href={href}
      className={`px-4 py-2 font-bold  text-[#004D5A] hover:text-blue-500 ${className}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;