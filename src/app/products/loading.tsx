import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F6F8F9' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-cairo">جاري تحميل المنتجات...</p>
      </div>
    </div>
  );
}
