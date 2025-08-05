// components/atoms/Heading.tsx
import React from 'react';

interface HeadingProps {
  text: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({ text, level = 1, className = '' }) => {
  const Tag = (`h${level}`) as keyof React.JSX.IntrinsicElements;

  return (
    <Tag className={`text-4xl font-bold mb-6 text-center ${className}`}>
      {text}
    </Tag>
  );
};

export default Heading;