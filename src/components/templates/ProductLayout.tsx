// components/templates/ProductLayout.tsx
'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Product } from '@/types/product';

// تحميل المكونات بشكل ديناميكي
const DynamicSaleCarousel = dynamic(() => import('../organisms/SaleProductsCarousel'), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 rounded-2xl h-64 mb-8"></div>
  ),
});

const DynamicProductsSection = dynamic(() => import('../organisms/ProductsSection'), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 rounded-2xl h-96"></div>
  ),
});

// نوع للبيانات التجريبية
interface SampleProduct {
  id: number;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  rating: number;
  reviewCount: number;
  originalPrice: number;
  salePrice?: number;
  image: string;
  isNew: boolean;
  brand: string;
  brandAr: string;
  description: string;
  descriptionAr: string;
}

// دالة لتحويل SampleProduct إلى Product - محدثة لتشمل جميع الخصائص
const convertToProduct = (sample: SampleProduct): Product => ({
  id: sample.id,
  name: sample.name,
  nameAr: sample.nameAr,
  category: sample.category,
  categoryAr: sample.categoryAr,
  price: sample.originalPrice,
  salePrice: sample.salePrice,
  originalPrice: sample.originalPrice,
  rating: sample.rating,
  reviewCount: sample.reviewCount,
  image: sample.image,
  isNew: sample.isNew,
  stock: Math.floor(Math.random() * 100) + 20, // مخزون عشوائي بين 20-120
  status: 'active' as const,
  description: sample.description,
  descriptionAr: sample.descriptionAr,
  brand: sample.brand,
  brandAr: sample.brandAr,
  sales: Math.floor(Math.random() * 500) + 50, // مبيعات عشوائية
  inStock: true,
  createdAt: new Date().toISOString(),
});


function ProductContent() {
  const searchParams = useSearchParams();
  const storeId = searchParams?.get('store');
  const storeName = searchParams?.get('storeName');
  
 

  // البيانات التجريبية الموسعة - 28 منتج
  const [sampleProducts] = useState<SampleProduct[]>([
    // إلكترونيات
    {
      id: 1,
      name: "Wireless Premium Headphones",
      nameAr: "سماعات لاسلكية فاخرة",
      category: "electronics",
      categoryAr: "إلكترونيات",
      rating: 4.5,
      reviewCount: 128,
      originalPrice: 299,
      salePrice: 199,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      isNew: false,
      brand: "SoundMax",
      brandAr: "ساوند ماكس",
      description: "Premium wireless headphones with noise cancellation",
      descriptionAr: "سماعات لاسلكية فاخرة مع إلغاء الضوضاء"
    },
    {
      id: 2,
      name: "Smart Sports Watch",
      nameAr: "ساعة ذكية رياضية",
      category: "electronics",
      categoryAr: "إلكترونيات",
      rating: 4.8,
      reviewCount: 89,
      originalPrice: 599,
      salePrice: 449,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      isNew: true,
      brand: "FitTech",
      brandAr: "فيت تيك",
      description: "Waterproof smart watch with fitness tracking",
      descriptionAr: "ساعة ذكية مقاومة للماء مع تتبع اللياقة"
    },
    {
      id: 3,
      name: "Advanced Camera Smartphone",
      nameAr: "هاتف ذكي بكاميرا متطورة",
      category: "electronics",
      categoryAr: "إلكترونيات",
      rating: 4.7,
      reviewCount: 256,
      originalPrice: 1299,
      salePrice: 999,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
      isNew: false,
      brand: "TechPro",
      brandAr: "تيك برو",
      description: "Professional camera smartphone with AI features",
      descriptionAr: "هاتف ذكي بكاميرا احترافية مع ميزات الذكاء الاصطناعي"
    },
    {
      id: 4,
      name: "Wireless Gaming Mouse",
      nameAr: "فأرة ألعاب لاسلكية",
      category: "electronics",
      categoryAr: "إلكترونيات",
      rating: 4.6,
      reviewCount: 342,
      originalPrice: 129,
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop",
      isNew: true,
      brand: "GamePro",
      brandAr: "جيم برو",
      description: "High precision wireless gaming mouse",
      descriptionAr: "فأرة ألعاب لاسلكية عالية الدقة"
    },
    {
      id: 5,
      name: "4K Webcam",
      nameAr: "كاميرا ويب 4K",
      category: "electronics",
      categoryAr: "إلكترونيات",
      rating: 4.4,
      reviewCount: 167,
      originalPrice: 199,
      salePrice: 149,
      image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=400&h=300&fit=crop",
      isNew: false,
      brand: "VisionCam",
      brandAr: "فيجن كام",
      description: "Ultra HD webcam for professional streaming",
      descriptionAr: "كاميرا ويب عالية الدقة للبث الاحترافي"
    },
    {
      id: 6,
      name: "Portable Bluetooth Speaker",
      nameAr: "مكبر صوت بلوتوث محمول",
      category: "electronics",
      categoryAr: "إلكترونيات",
      rating: 4.3,
      reviewCount: 203,
      originalPrice: 89,
      salePrice: 59,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
      isNew: true,
      brand: "AudioMax",
      brandAr: "أوديو ماكس",
      description: "Waterproof portable speaker with deep bass",
      descriptionAr: "مكبر صوت محمول مقاوم للماء مع باس عميق"
    },

    // أكسسوارات
    {
      id: 7,
      name: "Travel Backpack",
      nameAr: "حقيبة ظهر للسفر",
      category: "accessories",
      categoryAr: "إكسسوارات",
      rating: 4.3,
      reviewCount: 67,
      originalPrice: 179,
      salePrice: 129,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      isNew: false,
      brand: "TravelGear",
      brandAr: "ترافيل جير",
      description: "Multi-pocket travel backpack with USB port",
      descriptionAr: "حقيبة ظهر للسفر متعددة الجيوب مع منفذ USB"
    },
    {
      id: 8,
      name: "Leather Wallet",
      nameAr: "محفظة جلدية",
      category: "accessories",
      categoryAr: "إكسسوارات",
      rating: 4.7,
      reviewCount: 134,
      originalPrice: 79,
      salePrice: 49,
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop",
      isNew: true,
      brand: "LeatherCraft",
      brandAr: "ليذر كرافت",
      description: "Premium leather wallet with RFID protection",
      descriptionAr: "محفظة جلدية فاخرة مع حماية RFID"
    },
    {
      id: 9,
      name: "Designer Sunglasses",
      nameAr: "نظارات شمسية مصممة",
      category: "accessories",
      categoryAr: "إكسسوارات",
      rating: 4.5,
      reviewCount: 98,
      originalPrice: 149,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=300&fit=crop",
      isNew: false,
      brand: "StyleVision",
      brandAr: "ستايل فيجن",
      description: "UV protection designer sunglasses",
      descriptionAr: "نظارات شمسية مصممة مع حماية من الأشعة فوق البنفسجية"
    },
    {
      id: 10,
      name: "Luxury Watch",
      nameAr: "ساعة فاخرة",
      category: "accessories",
      categoryAr: "إكسسوارات",
      rating: 4.8,
      reviewCount: 156,
      originalPrice: 899,
      salePrice: 699,
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop",
      isNew: true,
      brand: "TimeMaster",
      brandAr: "تايم ماستر",
      description: "Swiss movement luxury watch with sapphire crystal",
      descriptionAr: "ساعة فاخرة بحركة سويسرية مع كريستال ياقوتي"
    },

    // منزل ومطبخ
    {
      id: 11,
      name: "Coffee Machine",
      nameAr: "آلة القهوة",
      category: "home",
      categoryAr: "منزل ومطبخ",
      rating: 4.6,
      reviewCount: 287,
      originalPrice: 349,
      salePrice: 249,
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
      isNew: false,
      brand: "BrewMaster",
      brandAr: "برو ماستر",
      description: "Automatic espresso machine with milk frother",
      descriptionAr: "آلة إسبريسو أوتوماتيكية مع خفاقة الحليب"
    },
    {
      id: 12,
      name: "Air Fryer",
      nameAr: "قلاية هوائية",
      category: "home",
      categoryAr: "منزل ومطبخ",
      rating: 4.4,
      reviewCount: 234,
      originalPrice: 199,
      salePrice: 159,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      isNew: true,
      brand: "HealthyCook",
      brandAr: "هيلثي كوك",
      description: "Digital air fryer with multiple cooking presets",
      descriptionAr: "قلاية هوائية رقمية مع إعدادات طبخ متعددة"
    },
    {
      id: 13,
      name: "Smart Home Hub",
      nameAr: "مركز المنزل الذكي",
      category: "home",
      categoryAr: "منزل ومطبخ",
      rating: 4.5,
      reviewCount: 178,
      originalPrice: 299,
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
      isNew: true,
      brand: "SmartHome",
      brandAr: "سمارت هوم",
      description: "Voice controlled smart home hub",
      descriptionAr: "مركز منزل ذكي يتم التحكم فيه بالصوت"
    },
    {
      id: 14,
      name: "Robot Vacuum",
      nameAr: "مكنسة روبوت",
      category: "home",
      categoryAr: "منزل ومطبخ",
      rating: 4.3,
      reviewCount: 145,
      originalPrice: 499,
      salePrice: 379,
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
      isNew: false,
      brand: "CleanBot",
      brandAr: "كلين بوت",
      description: "Smart robot vacuum with mapping technology",
      descriptionAr: "مكنسة روبوت ذكية مع تقنية رسم الخرائط"
    },

    // رياضة وصحة
    {
      id: 15,
      name: "Yoga Mat",
      nameAr: "بساط يوجا",
      category: "sports",
      categoryAr: "رياضة وصحة",
      rating: 4.7,
      reviewCount: 89,
      originalPrice: 49,
      salePrice: 29,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      isNew: true,
      brand: "FlexFit",
      brandAr: "فليكس فيت",
      description: "Non-slip eco-friendly yoga mat",
      descriptionAr: "بساط يوجا صديق للبيئة مانع للانزلاق"
    },
    {
      id: 16,
      name: "Dumbbells Set",
      nameAr: "مجموعة دمبل",
      category: "sports",
      categoryAr: "رياضة وصحة",
      rating: 4.6,
      reviewCount: 156,
      originalPrice: 149,
      salePrice: 99,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      isNew: false,
      brand: "FitPro",
      brandAr: "فيت برو",
      description: "Adjustable dumbbells set with storage rack",
      descriptionAr: "مجموعة دمبل قابلة للتعديل مع حامل تخزين"
    },
    {
      id: 17,
      name: "Running Shoes",
      nameAr: "أحذية جري",
      category: "sports",
      categoryAr: "رياضة وصحة",
      rating: 4.8,
      reviewCount: 342,
      originalPrice: 129,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
      isNew: true,
      brand: "RunMax",
      brandAr: "رن ماكس",
      description: "Lightweight running shoes with cushioning",
      descriptionAr: "أحذية جري خفيفة الوزن مع وسائد"
    },
    {
      id: 18,
      name: "Protein Shake Blender",
      nameAr: "خلاط مشروبات البروتين",
      category: "sports",
      categoryAr: "رياضة وصحة",
      rating: 4.4,
      reviewCount: 67,
      originalPrice: 79,
      salePrice: 59,
      image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop",
      isNew: false,
      brand: "NutriFit",
      brandAr: "نيوتري فيت",
      description: "Portable protein shake blender with USB charging",
      descriptionAr: "خلاط مشروبات البروتين المحمول مع شحن USB"
    },

    // كتب وتعليم
    {
      id: 19,
      name: "E-Reader",
      nameAr: "قارئ إلكتروني",
      category: "books",
      categoryAr: "كتب وتعليم",
      rating: 4.6,
      reviewCount: 145,
      originalPrice: 399,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
      isNew: true,
      brand: "ReadTech",
      brandAr: "ريد تيك",
      description: "High-resolution e-reader with backlight",
      descriptionAr: "قارئ إلكتروني عالي الدقة مع إضاءة خلفية"
    },
    {
      id: 20,
      name: "Study Desk",
      nameAr: "مكتب دراسة",
      category: "books",
      categoryAr: "كتب وتعليم",
      rating: 4.5,
      reviewCount: 78,
      originalPrice: 299,
      salePrice: 219,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      isNew: false,
      brand: "StudySpace",
      brandAr: "ستادي سبيس",
      description: "Adjustable height study desk with storage",
      descriptionAr: "مكتب دراسة قابل لتعديل الارتفاع مع تخزين"
    },
    {
      id: 21,
      name: "Notebook Set",
      nameAr: "مجموعة دفاتر",
      category: "books",
      categoryAr: "كتب وتعليم",
      rating: 4.3,
      reviewCount: 123,
      originalPrice: 29,
      salePrice: 19,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
      isNew: true,
      brand: "PaperCraft",
      brandAr: "بيبر كرافت",
      description: "Premium notebook set with different sizes",
      descriptionAr: "مجموعة دفاتر فاخرة بأحجام مختلفة"
    },

    // أزياء
    {
      id: 22,
      name: "Casual T-Shirt",
      nameAr: "تي شيرت كاجوال",
      category: "fashion",
      categoryAr: "أزياء",
      rating: 4.4,
      reviewCount: 234,
      originalPrice: 39,
      salePrice: 25,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
      isNew: false,
      brand: "CasualWear",
      brandAr: "كاجوال وير",
      description: "100% cotton comfortable casual t-shirt",
      descriptionAr: "تي شيرت كاجوال مريح من القطن الخالص"
    },
    {
      id: 23,
      name: "Denim Jeans",
      nameAr: "جينز دنيم",
      category: "fashion",
      categoryAr: "أزياء",
      rating: 4.6,
      reviewCount: 189,
      originalPrice: 89,
      salePrice: 69,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
      isNew: true,
      brand: "DenimStyle",
      brandAr: "دنيم ستايل",
      description: "Slim fit denim jeans with stretch fabric",
      descriptionAr: "جينز دنيم ضيق مع قماش مرن"
    },
    {
      id: 24,
      name: "Winter Jacket",
      nameAr: "جاكيت شتوي",
      category: "fashion",
      categoryAr: "أزياء",
      rating: 4.7,
      reviewCount: 167,
      originalPrice: 199,
      salePrice: 149,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop",
      isNew: false,
      brand: "WarmWear",
      brandAr: "وارم وير",
      description: "Waterproof winter jacket with thermal insulation",
      descriptionAr: "جاكيت شتوي مقاوم للماء مع عزل حراري"
    },
    {
      id: 25,
      name: "Dress Shirt",
      nameAr: "قميص رسمي",
      category: "fashion",
      categoryAr: "أزياء",
      rating: 4.5,
      reviewCount: 134,
      originalPrice: 79,
      image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=300&fit=crop",
      isNew: true,
      brand: "FormalWear",
      brandAr: "فورمال وير",
      description: "Elegant dress shirt for formal occasions",
      descriptionAr: "قميص رسمي أنيق للمناسبات الرسمية"
    },

    // ألعاب وترفيه
    {
      id: 26,
      name: "Board Game Set",
      nameAr: "مجموعة ألعاب لوحية",
      category: "games",
      categoryAr: "ألعاب وترفيه",
      rating: 4.8,
      reviewCount: 98,
      originalPrice: 59,
      salePrice: 39,
      image: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=300&fit=crop",
      isNew: false,
      brand: "GameNight",
      brandAr: "جيم نايت",
      description: "Classic board games collection for family fun",
      descriptionAr: "مجموعة ألعاب لوحية كلاسيكية للمتعة العائلية"
    },
    {
      id: 27,
      name: "Puzzle 1000 Pieces",
      nameAr: "أحجية 1000 قطعة",
      category: "games",
      categoryAr: "ألعاب وترفيه",
      rating: 4.4,
      reviewCount: 76,
      originalPrice: 29,
      salePrice: 19,
      image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&h=300&fit=crop",
      isNew: true,
      brand: "PuzzleMaster",
      brandAr: "بازل ماستر",
      description: "1000-piece jigsaw puzzle with beautiful landscape",
      descriptionAr: "أحجية 1000 قطعة مع منظر طبيعي جميل"
    },
    {
      id: 28,
      name: "Gaming Controller",
      nameAr: "يد تحكم ألعاب",
      category: "games",
      categoryAr: "ألعاب وترفيه",
      rating: 4.7,
      reviewCount: 245,
      originalPrice: 89,
      salePrice: 69,
      image: "https://images.unsplash.com/photo-1592840062661-ba4f1b6d6e95?w=400&h=300&fit=crop",
      isNew: false,
      brand: "GamePad Pro",
      brandAr: "جيم باد برو",
      description: "Wireless gaming controller with haptic feedback",
      descriptionAr: "يد تحكم ألعاب لاسلكية مع ردود فعل لمسية"
    }
  ]);

 // تحويل البيانات التجريبية إلى منتجات كاملة
const products: Product[] = sampleProducts.map(convertToProduct);
const saleProducts = products.filter(product => product.salePrice && product.salePrice > 0);

const handleNavigateLeft = () => {
  console.log('التنقل لليسار');
};

const handleNavigateRight = () => {
  console.log('التنقل لليمين');
};

// يمكنك حذف handleAddToCart بالكامل لأن ProductCard يتعامل مع السلة مباشرة
// أو الاحتفاظ به إذا كنت تحتاجه في مكان آخر

const handleViewDetails = (product: Product) => {
  alert(`عرض تفاصيل: ${product.nameAr || product.name}\n\nسيتم توجيهك لصفحة تفاصيل المنتج...`);
};

return (
  <div className="min-h-screen mt-20 font-cairo" style={{ backgroundColor: '#F6F8F9' }}>
    <div className=" mx-auto   ">
      {/* رسالة ترحيب إذا جاء من متجر معين */}
      {storeId && storeName && (
        <div className=" p-6 mb-6 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200  text-center shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-2xl">🏪</span>
            <h2 className="text-xl font-bold text-teal-800">
              مرحباً بك في {decodeURIComponent(storeName)}!
            </h2>
          </div>
          <p className="text-teal-600">
            تتصفح الآن مجموعة مختارة من أفضل المنتجات ({products.length} منتج)
          </p>
        </div>
      )}

      <DynamicSaleCarousel 
        saleProducts={saleProducts}
        onNavigateLeft={handleNavigateLeft}
        onNavigateRight={handleNavigateRight}
      />
      
      <div className="grid grid-cols-1 gap-8">
        <DynamicProductsSection
          products={products}
          onViewDetails={handleViewDetails}
        />
      </div>

      <div className="mt-12 p-8 rounded-2xl text-center shadow-lg" style={{ backgroundColor: "#f9fafb" }}>
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4" style={{ color: "#111827" }}>
            شكراً لتسوقكم معنا! 🙏
          </h3>
          <p className="text-lg mb-2" style={{ color: "#1f2937" }}>
            نقدر ثقتكم بنا ونسعى دائماً لتقديم أفضل المنتجات والخدمات
          </p>
          <p className="text-base mb-4" style={{ color: "#374151" }}>
            تجربة تسوق ممتعة ومريحة هي هدفنا الأول
          </p>
          <div className="text-sm text-gray-500">
            تم عرض {products.length} منتج من {new Set(products.map(p => p.brand)).size} علامة تجارية مختلفة
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

const ProductLayout: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center font-cairo" style={{ backgroundColor: '#F6F8F9' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل المنتجات...</p>
        </div>
      </div>
    }>
      <ProductContent />
    </Suspense>
  );
};

export default ProductLayout;