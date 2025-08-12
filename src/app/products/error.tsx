// app/products/error.tsx (صفحة الخطأ)
'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({  reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F6F8F9' }}>
      <div className="text-center max-w-md mx-auto p-6">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4 font-cairo">حدث خطأ!</h2>
        <p className="text-gray-600 mb-6 font-cairo">
          عذراً، حدث خطأ أثناء تحميل المنتجات. يرجى المحاولة مرة أخرى.
        </p>
        <button
          onClick={reset}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium flex items-center gap-2 mx-auto font-cairo"
        >
          <RefreshCw className="w-4 h-4" />
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}