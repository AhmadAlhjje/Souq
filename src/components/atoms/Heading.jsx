// components/atoms/Heading.jsx
import React from 'react';

const Heading = ({ text, level = 1, className }) => {
  const Tag = `h${level}`;
  return <Tag className={`text-4xl font-bold mb-4 text-center ${className}`}>{text}</Tag>;
};

export default Heading;