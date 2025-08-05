// components/atoms/NavLink.jsx
import React from 'react';
import Link from 'next/link';

const NavLink = ({ href, children, className }) => {
  return (
    <Link
      href={href}
      className={`px-4 py-2 text-gray-800 hover:text-blue-500 ${className}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;