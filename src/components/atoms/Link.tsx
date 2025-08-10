import React from 'react';

interface LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

const Link: React.FC<LinkProps> = ({ children, href, className = "" }) => {
  return (
    <a href={href} className={`text-teal-500 hover:text-teal-600 transition-colors text-sm sm:text-base ${className}`}>
      {children}
    </a>
  );
};

export default Link;