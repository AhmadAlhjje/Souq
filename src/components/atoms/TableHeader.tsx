
// components/atoms/TableHeader.tsx
import React from 'react';

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({ children, className = '' }) => {
  return (
    <th className={`text-right py-4 px-3 text-gray-700 font-bold text-sm ${className}`}>
      {children}
    </th>
  );
};

export default TableHeader;
