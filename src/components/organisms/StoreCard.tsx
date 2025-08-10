import React from 'react';
import Image from 'next/image';
import Typography from '../atoms/Typography';
import StoreLocation from '../molecules/StoreLocation';
import ActionCard from '../molecules/ActionCard';

interface Store {
  id: number;
  name: string;
  image: string;
  location: string;
}

interface StoreCardProps {
  store: Store;
  onViewDetails: (store: Store) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ 
  store, 
  onViewDetails 
}) => {
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden border-2 border-[#96EDD9]/30 hover:border-[#004D5A] hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 backdrop-blur-sm bg-white/95"
      dir="rtl"
    >
      {/* Store Image */}
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={store.image}
          alt={`متجر ${store.name}`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={false}
        />
        
        {/* Gradient Overlay للنص الأفضل */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Store Info */}
      <div className="p-6">
        {/* اسم المتجر والموقع في نفس السطر */}
        <div className="flex items-start justify-between mb-4">
          <Typography 
            variant="h3" 
            className="group-hover:text-[#006B7A] transition-colors text-right flex-1"
          >
            {store.name}
          </Typography>
          
          {/* الموقع على اليمين */}
          <div className="mr-3 flex-shrink-0">
            <StoreLocation location={store.location} />
          </div>
        </div>

        {/* زر بارتفاع أقل ونفس العرض */}
        <ActionCard 
          onClick={() => onViewDetails(store)}
          title="عرض التفاصيل"
          subtitle=" "
          iconName="chevron-right"
          className="text-right py-2"
        />
      </div>

      {/* تأثير إضافي للهوفر */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#96EDD9]/5 to-[#004D5A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default StoreCard;