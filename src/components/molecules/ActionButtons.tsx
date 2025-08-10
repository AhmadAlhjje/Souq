import React from 'react';
import Link from 'next/link';

const ActionButtons: React.FC = () => {
  return (
    <div className="flex space-x-2">
      <Link
        href="/LoginPage"
        className="bg-[#004D5A] text-white border border-[#004D5A] hover:bg-blue-500 hover:text-white px-5 py-2 rounded-full transition-all duration-200 ease-in-out transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-block text-center font-medium"
        prefetch={true}
      >
        أنشئ متجرك مجانًا
      </Link>
      <Link
        href="/LoginPage"
        className="bg-transparent text-[#004D5A] border border-[#004D5A] hover:bg-blue-500 hover:text-white px-4 py-2 rounded-full transition-all duration-200 ease-in-out transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-block text-center font-medium"
        prefetch={true}
      >
        تسجيل الدخول
      </Link>
    </div>
  );
};

export default ActionButtons;