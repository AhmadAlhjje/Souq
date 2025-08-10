import React from 'react';

const Link = ({ children, href, className = "" }) => {
  return (
    <a href={href} className={`text-teal-500 hover:text-teal-600 transition-colors text-sm sm:text-base ${className}`}>
      {children}
    </a>
  );
};

export default Link;