// utils/cartUtils.ts - محسن
import { APICartResponse, APICartItem, CartItem } from '../types/cart';

/**
 * Parse images string from API with enhanced debugging
 */
export const parseImages = (imagesString: string): string[] => {
  console.log('🔍 parseImages input:', imagesString);
  
  if (!imagesString || imagesString.trim() === '') {
    console.log('⚠️ Empty images string');
    return [];
  }

  try {
    // تنظيف النص من المسافات الزائدة
    const cleanedString = imagesString.trim();
    
    // التحقق من كون النص JSON array
    if (cleanedString.startsWith('[') && cleanedString.endsWith(']')) {
      const parsed = JSON.parse(cleanedString);
      
      if (Array.isArray(parsed)) {
        // تنظيف كل عنصر في المصفوفة من المسافات الزائدة
        const cleanedArray = parsed
          .map(img => typeof img === 'string' ? img.trim() : img)
          .filter(img => img && img !== ''); // إزالة العناصر الفارغة
        
        console.log('✅ Parsed JSON array:', cleanedArray);
        return cleanedArray;
      }
    }
    
    // إذا لم يكن JSON، اعتبره رابط صورة واحد
    const result = [cleanedString];
    console.log('✅ Single image string:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error parsing images:', error, 'Input:', imagesString);
    
    // محاولة أخيرة: إذا كان النص يحتوي على فواصل
    if (imagesString.includes(',')) {
      const splitImages = imagesString
        .split(',')
        .map(img => img.trim().replace(/["\[\]]/g, ''))
        .filter(img => img && img !== '');
      
      if (splitImages.length > 0) {
        console.log('✅ Fallback split result:', splitImages);
        return splitImages;
      }
    }
    
    return [];
  }
};

/**
 * Generate fallback image
 */
const generateFallbackImage = (productId?: number, productName?: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://192.168.1.127';
  const fallback = `${baseUrl}/uploads/placeholder.jpg`;
  console.log('🔄 Using fallback image:', fallback);
  return fallback;
};

/**
 * Get product image URL with comprehensive debugging
 */
export const getProductImageUrl = (apiItem: APICartItem): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://192.168.1.127';
  
  console.log('🖼️ Processing image for product:', {
    productName: apiItem.Product?.name,
    productId: apiItem.product_id,
    rawImages: apiItem.Product?.images,
    baseUrl: baseUrl
  });
  
  try {
    if (!apiItem?.Product) {
      console.warn('⚠️ No Product data in cart item');
      return generateFallbackImage(apiItem?.product_id);
    }

    const product = apiItem.Product;
    
    if (!product.images || product.images.trim() === '') {
      console.warn('⚠️ No images field for product:', product.name);
      return generateFallbackImage(product.id, product.name);
    }

    // تحويل النص إلى مصفوفة
    const images = parseImages(product.images);
    console.log('📸 Parsed images array:', images);
    
    if (images.length > 0) {
      // اختيار الصورة الأولى
      const firstImage = images[0];
      console.log('🎯 Processing first image:', firstImage);
      
      if (firstImage && firstImage.trim() !== '') {
        let finalUrl: string;
        
        // التحقق من نوع المسار
        if (firstImage.startsWith('http://') || firstImage.startsWith('https://')) {
          // رابط كامل
          finalUrl = firstImage;
          console.log('🌐 Using full URL:', finalUrl);
        } else if (firstImage.startsWith('/uploads/')) {
          // مسار يبدأ بـ /uploads/
          finalUrl = `${baseUrl}${firstImage}`;
          console.log('📁 Using server path:', finalUrl);
        } else {
          // اسم ملف فقط
          const cleanImageName = firstImage.replace(/^\/+/, ''); // إزالة / من البداية
          finalUrl = `${baseUrl}/uploads/${cleanImageName}`;
          console.log('🧹 Using cleaned path:', finalUrl);
        }
        
        console.log('✅ Final image URL:', finalUrl);
        return finalUrl;
      }
    }

    console.warn('⚠️ No valid images found for product:', product.name);
    return generateFallbackImage(product.id, product.name);
    
  } catch (error) {
    console.error('❌ Error processing product images:', error);
    return generateFallbackImage(apiItem?.product_id, apiItem?.Product?.name);
  }
};

/**
 * استخراج الصورة الأولى فقط (utility function)
 */
export const getFirstProductImage = (imagesString: string): string | null => {
  const images = parseImages(imagesString);
  return images.length > 0 ? images[0] : null;
};

/**
 * بناء رابط الصورة الكامل
 */
export const buildImageUrl = (imagePath: string, baseUrl?: string): string => {
  const base = baseUrl || process.env.NEXT_PUBLIC_BASE_URL || 'http://192.168.1.127';
  
  if (!imagePath) {
    return `${base}/uploads/placeholder.jpg`;
  }
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/uploads/')) {
    return `${base}${imagePath}`;
  }
  
  return `${base}/uploads/${imagePath.replace(/^\/+/, '')}`;
};

/**
 * Transform API cart item to UI cart item with validation
 */
export const transformCartItem = (apiItem: APICartItem): CartItem => {
  console.log('🔄 Transforming cart item:', apiItem.cart_item_id);
  
  try {
    if (!apiItem) {
      throw new Error('Cart item is null or undefined');
    }

    if (!apiItem.Product) {
      throw new Error('Product data is missing from cart item');
    }

    const product = apiItem.Product;
    const price = parseFloat(product.price || '0');
    const quantity = apiItem.quantity || 1;
    const total = price * quantity;
    const isInStock = (product.stock_quantity || 0) > 0;
    
    // الحصول على الصورة بطريقة محسنة
    const imageUrl = getProductImageUrl(apiItem);

    const result: CartItem = {
      id: apiItem.cart_item_id,
      product_id: apiItem.product_id,
      cart_item_id: apiItem.cart_item_id,
      name: product.name || 'منتج غير محدد',
      description: product.description || '',
      price: price,
      quantity: quantity,
      image: imageUrl,
      total: total,
      inStock: isInStock,
      store_name: product.Store?.store_name || 'متجر غير محدد'
    };

    console.log('✅ Transformed cart item:', {
      id: result.id,
      name: result.name,
      image: result.image,
      price: result.price,
      quantity: result.quantity
    });

    return result;

  } catch (error) {
    console.error('❌ Error transforming cart item:', error);
    
    return {
      id: apiItem?.cart_item_id || 0,
      product_id: apiItem?.product_id || 0,
      cart_item_id: apiItem?.cart_item_id || 0,
      name: 'منتج غير صحيح',
      description: 'حدث خطأ في تحميل بيانات المنتج',
      price: 0,
      quantity: apiItem?.quantity || 1,
      image: generateFallbackImage(),
      total: 0,
      inStock: false,
      store_name: 'متجر غير محدد'
    };
  }
};

/**
 * Transform API cart response with comprehensive logging
 */
export const transformCartResponse = (apiResponse: APICartResponse) => {
  console.log('🔄 Transforming cart response...');
  
  try {
    if (!apiResponse) {
      throw new Error('API response is null or undefined');
    }

    let items: CartItem[] = [];
    
    if (apiResponse.CartItems && Array.isArray(apiResponse.CartItems)) {
      console.log('📦 Processing', apiResponse.CartItems.length, 'cart items');
      
      items = apiResponse.CartItems
        .map((item, index) => {
          try {
            if (!item || !item.Product) {
              console.warn(`⚠️ Skipping invalid cart item at index ${index}`);
              return null;
            }
            return transformCartItem(item);
          } catch (error) {
            console.error(`❌ Error transforming cart item at index ${index}:`, error);
            return null;
          }
        })
        .filter((item): item is CartItem => item !== null);
      
      console.log('✅ Successfully transformed', items.length, 'cart items');
    } else {
      console.log('📦 No CartItems found in API response');
    }

    const subtotal = items.reduce((sum: number, item: CartItem) => sum + item.total, 0);
    const deliveryFee = subtotal > 200 ? 0 : 25;
    const tax = subtotal * 0.15;
    const total = subtotal + deliveryFee + tax;

    const result = {
      cart_id: apiResponse.cart_id,
      session_id: apiResponse.session_id,
      created_at: apiResponse.created_at,
      items,
      subtotal,
      deliveryFee,
      tax,
      total
    };

    console.log('✅ Cart transformation completed:', {
      cartId: result.cart_id,
      itemCount: result.items.length,
      subtotal: result.subtotal,
      total: result.total
    });

    return result;

  } catch (error) {
    console.error('❌ Error transforming cart response:', error);
    
    return {
      cart_id: apiResponse?.cart_id || 0,
      session_id: apiResponse?.session_id || '',
      created_at: apiResponse?.created_at || new Date().toISOString(),
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      tax: 0,
      total: 0
    };
  }
};

/**
 * Debug function to log all cart item details
 */
export const debugCartItem = (apiItem: APICartItem): void => {
  console.log('🔍 === CART ITEM DEBUG ===');
  console.log('Cart Item ID:', apiItem.cart_item_id);
  console.log('Product ID:', apiItem.product_id);
  console.log('Quantity:', apiItem.quantity);
  
  if (apiItem.Product) {
    console.log('Product Name:', apiItem.Product.name);
    console.log('Product Price:', apiItem.Product.price);
    console.log('Product Images (raw):', apiItem.Product.images);
    
    const parsedImages = parseImages(apiItem.Product.images || '');
    console.log('Product Images (parsed):', parsedImages);
    console.log('First Image:', parsedImages[0] || 'No images');
    
    console.log('Product Stock:', apiItem.Product.stock_quantity);
    console.log('Generated Image URL:', getProductImageUrl(apiItem));
    
    if (apiItem.Product.Store) {
      console.log('Store Name:', apiItem.Product.Store.store_name);
    }
  } else {
    console.log('❌ No Product data found!');
  }
  
  console.log('🔍 === END DEBUG ===');
};