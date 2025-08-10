import React from 'react';
import Icon from '../atoms/Icon';

interface StoreLocationProps {
  location: string;
}

const StoreLocation: React.FC<StoreLocationProps> = ({ location }) => {
  return (
    <div className="flex items-center text-sm text-[#004D5A]/70 mb-4">
      <Icon name="location" size="sm" className="mr-2" />
      {location}
    </div>
  );
};

export default StoreLocation;