// ========================================
// تحديث src/api/shipping.ts - مع إعادة دالة إنشاء الطلبات
// ========================================

export interface ShippingItem {
  shipping_id: string;
  order_id: number;
  has_identity_images: boolean;
  identity_images_count: number;
}

export interface IdentityInfo {
  images_uploaded: number;
  has_front_image: boolean;
  has_back_image: boolean;
  total_images: number;
}

export interface ShippingResponse {
  success: boolean;
  message: string;
  data: {
    shipping_id: number;
    purchase_id: string;
    customer_session_id: string;
    ready_for_payment: boolean;
    identity_info: IdentityInfo;
    cart_items_count: number;
    next_step: string;
  };
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data?: {
    order_id: string;
    purchase_id: string;
    status: string;
    created_at: string;
  };
}

class ShippingService {
  private baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  // دالة مساعدة لتحويل FormData إلى كائن عادي
  private async formDataToObject(formData: FormData): Promise<Record<string, any>> {
    const obj: Record<string, any> = {};
    
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const base64 = await this.fileToBase64(value);
        obj[key] = base64;
        console.log(`  ${key}: File "${value.name}" converted to Base64 (${base64.length} chars)`);
      } else {
        obj[key] = value;
        console.log(`  ${key}: ${value}`);
      }
    }
    
    return obj;
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('فشل في قراءة الملف'));
        }
      };
      reader.onerror = () => reject(new Error('خطأ في قراءة الملف'));
      reader.readAsDataURL(file);
    });
  }

  // دالة إنشاء الطلب
  async createOrder(purchaseId: string): Promise<OrderResponse> {
    const url = `${this.baseUrl}/orders`;
    
    console.log('إنشاء طلب جديد...');
    console.log('  - Purchase ID:', purchaseId);
    console.log('  - URL:', url);
    
    try {
      const orderData = {
        purchase_id: purchaseId
      };

      console.log('بيانات الطلب:', orderData);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(orderData),
      });

      console.log('حالة استجابة الطلب:', response.status);

      if (!response.ok) {
        let errorMessage = `فشل في إنشاء الطلب: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('تفاصيل خطأ الطلب:', errorData);
        } catch (parseError) {
          console.error('فشل في تحليل خطأ الطلب:', parseError);
        }
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      console.log('نص استجابة الطلب:', responseText);

      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('فشل في تحليل JSON للطلب:', parseError);
        throw new Error('استجابة غير صالحة من الخادم للطلب');
      }

      console.log('بيانات الطلب المُحللة:', data);

      const normalizedResponse: OrderResponse = {
        success: data.success || true,
        message: data.message || 'تم إنشاء الطلب بنجاح',
        data: data.data
      };

      console.log('ملخص إنشاء الطلب:', {
        success: normalizedResponse.success,
        message: normalizedResponse.message,
        order_id: data.data?.order_id
      });

      return normalizedResponse;

    } catch (error) {
      console.error('خطأ في إنشاء الطلب:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('فشل في الاتصال بالخادم لإنشاء الطلب - تحقق من الاتصال بالإنترنت');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('حدث خطأ غير متوقع أثناء إنشاء الطلب');
    }
  }

  async createShipping(formData: FormData): Promise<ShippingResponse> {
    const url = `${this.baseUrl}/shipping/`;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`محاولة إرسال رقم ${attempts}/${maxAttempts}`);

      try {
        // إذا كانت هذه محاولة إعادة، أنشئ session فرعي جديد
        if (attempts > 1) {
          const originalSessionId = formData.get('customer_session_id') as string;
          const newSubSessionId = `${originalSessionId}_sub${attempts}_${Date.now()}`;
          
          formData.set('customer_session_id', newSubSessionId);
          formData.set('parent_session_id', originalSessionId);
          
          console.log(`إنشاء sub-session: ${newSubSessionId}`);
        }

        console.log('محتويات FormData المُرسلة:');
        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}: File "${value.name}" (${value.size} bytes, ${value.type})`);
          } else {
            console.log(`  ${key}: ${value}`);
          }
        }

        // تحويل FormData إلى JSON
        const shippingData = await this.formDataToObject(formData);
        console.log('البيانات المُحولة:', shippingData);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(shippingData),
        });

        console.log(`حالة الاستجابة المحاولة ${attempts}:`, response.status);

        if (response.status === 409) {
          // خطأ 409 - session موجود مسبقاً
          let errorData;
          try {
            errorData = await response.json();
            console.log('تفاصيل خطأ 409:', errorData);
          } catch (e) {
            console.log('فشل قراءة تفاصيل الخطأ');
          }

          if (attempts < maxAttempts) {
            console.log(`إعادة المحاولة بـ session فرعي جديد...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          } else {
            throw new Error(`فشل إنشاء الشحن بعد ${maxAttempts} محاولات. الـ session مستخدم مسبقاً.`);
          }
        }

        if (!response.ok) {
          let errorMessage = `فشل الإرسال: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
            console.error('تفاصيل الخطأ:', errorData);
          } catch (parseError) {
            console.error('فشل في تحليل رسالة الخطأ:', parseError);
            const errorText = await response.text();
            console.error('نص الخطأ الخام:', errorText);
          }
          throw new Error(errorMessage);
        }

        // نجحت العملية
        const responseText = await response.text();
        console.log('نص الاستجابة الخام:', responseText);

        let data: any;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('فشل في تحليل JSON:', parseError);
          throw new Error('استجابة غير صالحة من الخادم');
        }

        console.log('البيانات المُحللة:', data);

        if (!data.success) {
          console.error('بنية استجابة غير متوقعة:', data);
          throw new Error('فشل في إنشاء الشحن');
        }

        // تحويل الاستجابة إلى التنسيق المتوقع
        const normalizedResponse: ShippingResponse = {
          success: data.success,
          message: data.message || 'تم إنشاء الشحن بنجاح',
          data: {
            shipping_id: data.data?.shipping_id || 0,
            purchase_id: data.data?.purchase_id || '',
            customer_session_id: data.data?.customer_session_id || '',
            ready_for_payment: data.data?.ready_for_payment || false,
            identity_info: data.data?.identity_info || {
              images_uploaded: 0,
              has_front_image: false,
              has_back_image: false,
              total_images: 0
            },
            cart_items_count: data.data?.cart_items_count || 0,
            next_step: data.data?.next_step || 'تم إنشاء الشحن'
          }
        };

        console.log('ملخص النتيجة:', {
          success: normalizedResponse.success,
          message: normalizedResponse.message,
          shipping_id: normalizedResponse.data.shipping_id,
          purchase_id: normalizedResponse.data.purchase_id,
          ready_for_payment: normalizedResponse.data.ready_for_payment,
          session_id: normalizedResponse.data.customer_session_id,
          attempt: attempts
        });

        return normalizedResponse;

      } catch (error) {
        if (attempts >= maxAttempts) {
          console.error('فشلت جميع المحاولات:', error);
          
          if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('فشل في الاتصال بالخادم - تحقق من الاتصال بالإنترنت');
          }
          
          if (error instanceof Error) {
            throw error;
          }
          
          throw new Error('حدث خطأ غير متوقع أثناء الإرسال');
        }
        
        console.log(`خطأ في المحاولة ${attempts}، جاري إعادة المحاولة...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    throw new Error('فشل في جميع المحاولات');
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const shippingService = new ShippingService();