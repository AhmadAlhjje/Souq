import { Store, Product, SupportFeature } from '../types';

export const SAMPLE_STORES: Store[] = [
  {
    id: 1,
    name: 'متجر التقنية الحديثة',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop',
    location: 'الرياض، السعودية'
  },
  {
    id: 2,
    name: 'بوتيك الأناقة',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop',
    location: 'جدة، السعودية'
  },
  {
    id: 3,
    name: 'سوبر ماركت الأسرة',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
    location: 'الدمام، السعودية'
  },
  {
    id: 4,
    name: 'معرض الأثاث الراقي',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop',
    location: 'مكة، السعودية'
  },
  {
    id: 5,
    name: 'صيدلية النور',
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=250&fit=crop',
    location: 'المدينة المنورة، السعودية'
  },
  {
    id: 6,
    name: 'مطعم الذوق الرفيع',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop',
    location: 'الطائف، السعودية'
  }
];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'جوال سامسونج غالاكسي S24',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=250&fit=crop',
    originalPrice: '3200',
    salePrice: '2400',
    discount: 25,
    rating: 4.8,
    store: 'متجر التقنية'
  },
  {
    id: 2,
    name: 'حذاء رياضي نايكي',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=250&fit=crop',
    originalPrice: '450',
    salePrice: '315',
    discount: 30,
    rating: 4.6,
    store: 'بوتيك الرياضة'
  },
  {
    id: 3,
    name: 'لاب توب ديل إنسبايرون',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=250&fit=crop',
    originalPrice: '2800',
    salePrice: '2100',
    discount: 25,
    rating: 4.7,
    store: 'عالم الحاسوب'
  },
  {
    id: 4,
    name: 'ساعة ذكية أبل واتش',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=250&fit=crop',
    originalPrice: '1600',
    salePrice: '1200',
    discount: 25,
    rating: 4.9,
    store: 'آي ستور'
  }
];

export const SUPPORT_FEATURES: SupportFeature[] = [
  {
    iconName: 'shield',
    title: 'دفع آمن ومضمون',
    description: 'جميع معاملاتك محمية بأعلى معايير الأمان مع ضمان استرداد الأموال',
    color: '#004D5A'
  },
  {
    iconName: 'credit-card',
    title: 'قبول الشيكات والراتبات',
    description: 'سهّل على نفسك الدفع باستخدام الشيكات الآجلة أو خصم من الراتب',
    color: '#96EDD9'
  },
  {
    iconName: 'truck',
    title: 'توصيل سريع ومجاني',
    description: 'توصيل مجاني لجميع الطلبات فوق 200 ريال خلال 24 ساعة',
    color: '#006B7A'
  },
  {
    iconName: 'headphones',
    title: 'دعم عملاء على مدار الساعة',
    description: 'فريق دعم العملاء متاح 24/7 لمساعدتك في أي استفسار',
    color: '#008599'
  }
];