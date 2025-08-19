
// components/atoms/TableCell.tsx
import React from 'react';

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

const TableCell: React.FC<TableCellProps> = ({ children, className = '' }) => {
  return (
    <td className={`py-4 px-3 ${className}`}>
      {children}
    </td>
  );
};

export default TableCell;
