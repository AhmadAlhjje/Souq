import { FC, ReactNode } from 'react';

interface ServiceItemProps {
  icon: ReactNode;
  title: string;
  description?: string;
  textAlign?: 'text-right' | 'text-left'; // جديد
}

const ServiceItem: FC<ServiceItemProps> = ({ 
  icon, 
  title, 
  description, 
  textAlign = 'text-right' 
}) => (
  <div className={`flex items-start gap-2 ${textAlign === 'text-right' ? 'flex-row-reverse' : 'flex-row'} ${textAlign}`}>
    <div className="mt-1">{icon}</div>
    <div>
      <h4 className="font-bold text-[#004D5A] text-lg">{title}</h4>
      {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
    </div>
  </div>
);

export default ServiceItem;