// components/molecules/ServiceCard.tsx
import React from 'react';
import Image from 'next/image';
import Button from '../atoms/Button';

interface ServiceCardProps {
  title: string;
  description: string;
  imageSrc: string;
  buttonText: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, imageSrc, buttonText }) => {
  return (
<div className="bg-white p-4 rounded-lg shadow-md text-right">
  <Image src={imageSrc} alt={title} width={200} height={150} className="mb-4 mx-auto" />
  <h3 className="text-xl font-bold mb-2">{title}</h3>
  <p className="text-gray-600 mb-4">{description}</p>
  
  {/* الزر في المنتصف */}
  <Button 
    text={buttonText} 
    className="bg-transparent border border-green-300 hover:bg-gray-100 px-4 py-2 rounded-full block mx-auto" 
  />
</div>
  );
};

export default ServiceCard;