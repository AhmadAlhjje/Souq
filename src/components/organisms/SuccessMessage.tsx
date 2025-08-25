// src/components/organisms/SuccessMessage.tsx
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessMessageProps {
  show: boolean;
  message?: string;
  className?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  show,
  message = 'تم إنشاء المتجر بنجاح! 🎉',
  className = ''
}) => {
  if (!show) return null;

  return (
    <div className={`bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 mb-8 animate-pulse ${className}`}>
      <div className="flex items-center gap-3 justify-center">
        <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
        <p className="text-green-700 dark:text-green-300 font-semibold">
          {message}
        </p>
      </div>
    </div>
  );
};

export default SuccessMessage;