// components/molecules/ActionButtons.tsx
import React from 'react';
import Button from '../atoms/Button';

const ActionButtons: React.FC = () => {
  return (
    <div className="flex space-x-2">
      <Button
        text="أنشئ متجرك مجانًا"
        className=" bg-[#004D5A] text-white border border-[#004D5A] hover:bg-blue-500 hover:text-white px-5 py-2 rounded-full"
      />
      <Button
        text="تسجيل الدخول"
        className="bg-transparent  text-[#004D5A] border border-[#004D5A] hover:bg-blue-500 hover:text-white px-4 py-2 rounded-full"
      />
    </div>
  );
};

export default ActionButtons;