// utils/cartUtils.ts - إصلاح شامل لمعالجة أنواع البيانات المختلفة
import { APICartResponse, APICartItem, CartItem } from '../types/cart';

/**
 * Parse images from API - now handles both string and array inputs
 */
export const parseImages = (imagesInput: any): string[] => {
  console.log('🔍 [CART] parseImages input:', {
    data: imagesInput,
    type: typeof imagesInput,
    isArray: Array.isArray(imagesInput)
  });
  
  // التحقق من القيم الفارغة
  if (!imagesInput) {
    console.log('⚠️ [CART] Empty or null input');
    return [];
  }

  // ✅ إذا كانت array بالفعل - هذا يحل المشكلة الأساسية
  if (Array.isArray(imagesInput)) {
    console.log('✅ [CART] Input is already an array:', imagesInput);
    return imagesInput
      .map(img => typeof img === 'string' ? img.trim() : String(img).trim())
      .filter(img => img && img !== '' && img !== 'null' && img !== 'undefined');
  }

  // إذا كانت string
  if (typeof imagesInput === 'string') {
    const trimmed = imagesInput.trim();
    
    if (trimmed === '' || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined') {
      console.log('⚠️ [CART] Empty or special value string');
      return [];
    }

    // ✅ الآن فقط نستخدم startsWith لأننا متأكدين أنه string
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        
        if (Array.isArray(parsed)) {
          const cleanedArray = parsed
            .map(img => typeof img === 'string' ? img.trim() : String(img).trim())
            .filter(img => img && img !== '');
          
          console.log('✅ [CART] Parsed JSON array:', cleanedArray);
          return cleanedArray;
        }
      } catch (error) {
        console.error('❌ [CART] Error parsing JSON:', error);
        
        // محاولة أخيرة: إذا كان النص يحتوي على فواصل
        if (trimmed.includes(',')) {
          const splitImages = trimmed
            .replace(/[\[\]"]/g, '') // إزالة الأقواس والقوتان
            .split(',')
            .map(img => img.trim())
            .filter(img => img && img !== '');
          
          if (splitImages.length > 0) {
            console.log('✅ [CART] Fallback split result:', splitImages);
            return splitImages;
          }
        }
      }
    }
    
    // إذا لم يكن JSON، اعتبره رابط صورة واحد
    console.log('✅ [CART] Single image string:', trimmed);
    return [trimmed];
  }

  // نوع غير متوقع - محاولة تحويل
  console.log('⚠️ [CART] Unexpected type, attempting conversion');
  try {
    const stringValue = String(imagesInput);
    return stringValue && stringValue !== 'undefined' && stringValue !== 'null' 
      ? [stringValue] 
      : [];
  } catch (error) {
    console.error('❌ [CART] Failed to convert to string:', error);
    return [];
  }
};

/**
 * Generate fallback image
 */
const generateFallbackImage = (productId?: number, productName?: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://192.168.1.127';
  const fallback = `${baseUrl}/uploads/placeholder.jpg`;
  console.log('🔄 [CART] Using fallback image:', fallback);
  return fallback;
};

/**
 * Get product image URL with comprehensive debugging
 */
export const getProductImageUrl = (apiItem: APICartItem): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://192.168.1.127';
  
  console.log('🖼️ [CART] Processing image for product:', {
    productName: apiItem.Product?.name,
    productId: apiItem.product_id,
    rawImages: apiItem.Product?.images,
    rawImagesType: typeof apiItem.Product?.images,
    baseUrl: baseUrl
  });
  
  try {
    if (!apiItem?.Product) {
      console.warn('⚠️ [CART] No Product data in cart item');
      return generateFallbackImage(apiItem?.product_id);
    }

    const product = apiItem.Product;
    
    if (!product.images) {
      console.warn('⚠️ [CART] No images field for product:', product.name);
      return generateFallbackImage(product.id, product.name);
    }

    // تحويل النص أو المصفوفة إلى مصفوفة نظيفة
    const images = parseImages(product.images);
    console.log('📸 [CART] Parsed images array:', images);
    
    if (images.length > 0) {
      const firstImage = images[0];
      console.log('🎯 [CART] Processing first image:', firstImage);
      
      if (firstImage && firstImage.trim() !== '') {
        let finalUrl: string;
        
        if (firstImage.startsWith('http://') || firstImage.startsWith('https://')) {
          finalUrl = firstImage;
          console.log('🌐 [CART] Using full URL:', finalUrl);
        } else if (firstImage.startsWith('/uploads/')) {
          finalUrl = `${baseUrl}${firstImage}`;
          console.log('📁 [CART] Using server path:', finalUrl);
        } else {
          const cleanImageName = firstImage.replace(/^\/+/, '');
          finalUrl = `${baseUrl}/uploads/${cleanImageName}`;
          console.log('🧹 [CART] Using cleaned path:', finalUrl);
        }
        
        console.log('✅ [CART] Final image URL:', finalUrl);
        return finalUrl;
      }
    }

    console.warn('⚠️ [CART] No valid images found for product:', product.name);
    return generateFallbackImage(product.id, product.name);
    
  } catch (error) {
    console.error('❌ [CART] Error processing product images:', error);
    return generateFallbackImage(apiItem?.product_id, apiItem?.Product?.name);
  }
};

/**
 * استخراج الصورة الأولى فقط (utility function)
 */
export const getFirstProductImage = (imagesInput: any): string | null => {
  const images = parseImages(imagesInput);
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
  console.log('🔄 [CART] Transforming cart item:', apiItem.cart_item_id);
  
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

    console.log('✅ [CART] Transformed cart item:', {
      id: result.id,
      name: result.name,
      image: result.image,
      price: result.price,
      quantity: result.quantity
    });

    return result;

  } catch (error) {
    console.error('❌ [CART] Error transforming cart item:', error);
    
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
  console.log('🔄 [CART] Transforming cart response...');
  
  try {
    if (!apiResponse) {
      throw new Error('API response is null or undefined');
    }

    let items: CartItem[] = [];
    
    if (apiResponse.CartItems && Array.isArray(apiResponse.CartItems)) {
      console.log('📦 [CART] Processing', apiResponse.CartItems.length, 'cart items');
      
      items = apiResponse.CartItems
        .map((item, index) => {
          try {
            if (!item || !item.Product) {
              console.warn(`⚠️ [CART] Skipping invalid cart item at index ${index}`);
              return null;
            }
            return transformCartItem(item);
          } catch (error) {
            console.error(`❌ [CART] Error transforming cart item at index ${index}:`, error);
            return null;
          }
        })
        .filter((item): item is CartItem => item !== null);
      
      console.log('✅ [CART] Successfully transformed', items.length, 'cart items');
    } else {
      console.log('📦 [CART] No CartItems found in API response');
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

    console.log('✅ [CART] Cart transformation completed:', {
      cartId: result.cart_id,
      itemCount: result.items.length,
      subtotal: result.subtotal,
      total: result.total
    });

    return result;

  } catch (error) {
    console.error('❌ [CART] Error transforming cart response:', error);
    
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
  console.log('🔍 [CART] === CART ITEM DEBUG ===');
  console.log('Cart Item ID:', apiItem.cart_item_id);
  console.log('Product ID:', apiItem.product_id);
  console.log('Quantity:', apiItem.quantity);
  
  if (apiItem.Product) {
    console.log('Product Name:', apiItem.Product.name);
    console.log('Product Price:', apiItem.Product.price);
    console.log('Product Images (raw):', apiItem.Product.images);
    console.log('Product Images (type):', typeof apiItem.Product.images);
    
    const parsedImages = parseImages(apiItem.Product.images || '');
    console.log('Product Images (parsed):', parsedImages);
    console.log('First Image:', parsedImages[0] || 'No images');
    
    console.log('Product Stock:', apiItem.Product.stock_quantity);
    console.log('Generated Image URL:', getProductImageUrl(apiItem));
    
    if (apiItem.Product.Store) {
      console.log('Store Name:', apiItem.Product.Store.store_name);
    }
  } else {
    console.log('❌ [CART] No Product data found!');
  }
  
  console.log('🔍 [CART] === END DEBUG ===');
};