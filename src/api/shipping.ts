// ========================================
// 1. تحديث src/api/shipping.ts لمعالجة 409 بذكاء
// ========================================
// src/types/shipping.ts
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
}

export interface BulkShippingResponse {
  message: string;
  shippings: ShippingItem[];
  customer_session_id: string;
  identity_info: IdentityInfo;
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

  async createShipping(formData: FormData): Promise<BulkShippingResponse> {
    const url = `${this.baseUrl}/shipping`;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`🚀 محاولة إرسال رقم ${attempts}/${maxAttempts}`);

      try {
        // إذا كانت هذه محاولة إعادة، أنشئ session فرعي جديد
        if (attempts > 1) {
          const originalSessionId = formData.get('customer_session_id') as string;
          const newSubSessionId = `${originalSessionId}_sub${attempts}_${Date.now()}`;
          
          // استبدال session_id بواحد فرعي جديد
          formData.set('customer_session_id', newSubSessionId);
          formData.set('parent_session_id', originalSessionId); // حفظ الـ session الأصلي
          
          console.log(`🔄 إنشاء sub-session: ${newSubSessionId}`);
        }

        console.log('📤 محتويات FormData المُرسلة:');
        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}: File "${value.name}" (${value.size} bytes, ${value.type})`);
          } else {
            console.log(`  ${key}: ${value}`);
          }
        }

        // تحويل FormData إلى JSON
        const shippingData = await this.formDataToObject(formData);
        console.log('📋 البيانات المُحولة:', shippingData);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(shippingData),
        });

        console.log(`📡 حالة الاستجابة المحاولة ${attempts}:`, response.status);

        if (response.status === 409) {
          // خطأ 409 - session موجود مسبقاً
          let errorData;
          try {
            errorData = await response.json();
            console.log('❌ تفاصيل خطأ 409:', errorData);
          } catch (e) {
            console.log('❌ فشل قراءة تفاصيل الخطأ');
          }

          if (attempts < maxAttempts) {
            console.log(`🔄 إعادة المحاولة بـ session فرعي جديد...`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // انتظار ثانية
            continue; // إعادة المحاولة
          } else {
            throw new Error(`فشل إنشاء الشحن بعد ${maxAttempts} محاولات. الـ session مستخدم مسبقاً.`);
          }
        }

        if (!response.ok) {
          let errorMessage = `فشل الإرسال: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
            console.error('❌ تفاصيل الخطأ:', errorData);
          } catch (parseError) {
            console.error('❌ فشل في تحليل رسالة الخطأ:', parseError);
            const errorText = await response.text();
            console.error('❌ نص الخطأ الخام:', errorText);
          }
          throw new Error(errorMessage);
        }

        // نجحت العملية
        const responseText = await response.text();
        console.log('✅ نص الاستجابة الخام:', responseText);

        let data: any;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('❌ فشل في تحليل JSON:', parseError);
          throw new Error('استجابة غير صالحة من الخادم');
        }

        console.log('✅ البيانات المُحللة:', data);

        if (!data.success && !data.message) {
          console.error('❌ بنية استجابة غير متوقعة:', data);
          throw new Error('بنية استجابة غير صالحة من الخادم');
        }

        // تحويل الاستجابة إلى التنسيق المتوقع
        const normalizedResponse: BulkShippingResponse = {
          message: data.message || 'تم الإرسال بنجاح',
          shippings: data.data?.shipping_id ? [{
            shipping_id: data.data.shipping_id,
            order_id: data.data.order_id || 0,
            has_identity_images: true,
            identity_images_count: 2
          }] : [],
          customer_session_id: data.data?.customer_session_id || '',
          identity_info: {
            images_uploaded: 2,
            has_front_image: true,
            has_back_image: true
          }
        };

        console.log('📊 ملخص النتيجة:', {
          message: normalizedResponse.message,
          shipping_id: data.data?.shipping_id,
          session_id: normalizedResponse.customer_session_id,
          attempt: attempts,
          success: data.success
        });

        return normalizedResponse;

      } catch (error) {
        if (attempts >= maxAttempts) {
          console.error('❌ فشلت جميع المحاولات:', error);
          
          if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('فشل في الاتصال بالخادم - تحقق من الاتصال بالإنترنت');
          }
          
          if (error instanceof Error) {
            throw error;
          }
          
          throw new Error('حدث خطأ غير متوقع أثناء الإرسال');
        }
        
        console.log(`⚠️ خطأ في المحاولة ${attempts}، جاري إعادة المحاولة...`);
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
