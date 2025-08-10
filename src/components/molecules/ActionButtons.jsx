import React from 'react';
import Button from '../../atoms/Button/Button';

const ActionButtons = ({ onLogin, onCreateAccount }) => {
  return (
    <div className="space-y-3">
      <Button onClick={onLogin} variant="primary">
        تسجيل
      </Button>
      <div className="text-center text-xs sm:text-sm text-gray-600 px-2">
        بالتسجيل فإنك توافق على إشتراك استخدام TMC وسياسة الخصوصية
      </div>
    </div>
  );
};

export default ActionButtons;