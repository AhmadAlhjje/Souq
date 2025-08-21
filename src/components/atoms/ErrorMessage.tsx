// src/components/atoms/ErrorMessage.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = ''
}) => {
  return (
    <p className={`text-red-500 text-sm flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg ${className}`}>
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      {message}
    </p>
  );
};

export default ErrorMessage;