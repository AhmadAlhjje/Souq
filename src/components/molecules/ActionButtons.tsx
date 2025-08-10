import React from 'react';
import { useRouter } from 'next/navigation'; // Next.js 13+ App Router
// أو استخدم: import { useNavigate } from 'react-router-dom'; // React Router
import Button from '../atoms/Button';

const ActionButtons: React.FC = () => {
  const router = useRouter(); // Next.js
  // أو const navigate = useNavigate(); // React Router

  const handleCreateStore = () => {
    router.push('/LoginPage'); // Next.js
    // أو navigate('/LoginPage'); // React Router
  };

  const handleSignIn = () => {
    router.push('/LoginPage'); // Next.js
    // أو navigate('/LoginPage'); // React Router
  };

  return (
    <div className="flex space-x-2">
      <Button
        text="أنشئ متجرك مجانًا"
        onClick={handleCreateStore}
        className="bg-[#004D5A] text-white border border-[#004D5A] hover:bg-blue-500 hover:text-white px-5 py-2 rounded-full"
      />
      <Button
        text="تسجيل الدخول"
        onClick={handleSignIn}
        className="bg-transparent text-[#004D5A] border border-[#004D5A] hover:bg-blue-500 hover:text-white px-4 py-2 rounded-full"
      />
    </div>
  );
};

export default ActionButtons;