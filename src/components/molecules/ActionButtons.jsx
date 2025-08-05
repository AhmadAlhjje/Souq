// components/molecules/ActionButtons.jsx
import React from 'react';
import Button from '../atoms/Button';

const ActionButtons = () => {
  return (
<div className="flex space-x-2">
  <Button text="تسجيل الدخول" className="bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white" />
  <Button text="أنشئ متجرك مجانًا" className="bg-transparent text-black border border-[#004D5A] hover:bg-[#004D5A] hover:text-white px-4.7 py-2.2 rounded-full" />
</div>
  );
};

export default ActionButtons;