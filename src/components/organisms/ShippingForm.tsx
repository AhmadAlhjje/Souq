'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, User, Phone, MapPin, MessageSquare } from 'lucide-react';
import FormField from '@/components/molecules/FormField';
import FileUpload from '@/components/molecules/FileUpload';
import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';
import { shippingService } from '@/api/shipping';
import { useToast } from '@/hooks/useToast';
import { SessionManager } from '@/utils/SessionManager';
import { useThemeContext } from '@/contexts/ThemeContext'; // ✅ استيراد الثيم

interface ShippingFormData {
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string;
  recipient_name: string;
  destination: string;
  identity_front_file: File | null;
  identity_back_file: File | null;
}

interface FormErrors {
  customer_name?: string;
  customer_phone?: string;
  customer_whatsapp?: string;
  recipient_name?: string;
  destination?: string;
  identity_front_file?: string;
  identity_back_file?: string;
}

const ShippingForm: React.FC = () => { // ✅ إزالة prop theme
  const { isDark, isLight } = useThemeContext(); // ✅ استخدام السياق
  const { showToast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState<ShippingFormData>({
    customer_name: '',
    customer_phone: '',
    customer_whatsapp: '',
    recipient_name: '',
    destination: '',
    identity_front_file: null,
    identity_back_file: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const isValidImage = (file: File) => {
    return file.type.startsWith('image/');
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customer_name.trim()) newErrors.customer_name = 'اسم العميل مطلوب';
    if (!formData.customer_phone.trim()) newErrors.customer_phone = 'رقم هاتف العميل مطلوب';
    if (!formData.customer_whatsapp.trim()) newErrors.customer_whatsapp = 'رقم واتساب العميل مطلوب';
    if (!formData.recipient_name.trim()) newErrors.recipient_name = 'اسم المستلم مطلوب';
    if (!formData.destination.trim()) newErrors.destination = 'عنوان الوجهة مطلوب';
    if (!formData.identity_front_file) newErrors.identity_front_file = 'صورة الهوية الأمامية مطلوبة';
    if (!formData.identity_back_file) newErrors.identity_back_file = 'صورة الهوية الخلفية مطلوبة';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ShippingFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleFileChange = (field: 'identity_front_file' | 'identity_back_file') => (file: File | null) => {
    if (file) {
      if (!isValidImage(file)) {
        showToast('يرجى اختيار صورة فقط', 'error');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        showToast('حجم الملف كبير جدًا (الحد الأقصى 5MB)', 'error');
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast('يرجى تصحيح الأخطاء في النموذج', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // الخطوة 1: إنشاء الشحن
      console.log('بدء عملية إنشاء الشحن والطلب...');
      
      // الحصول على الـ session الثابت للمستخدم
      const userSessionId = SessionManager.getOrCreateSessionId();
      SessionManager.extendSession();

      // إنشاء معرف فريد للطلب
      const timestamp = Date.now();
      const requestId = `req_${timestamp}_${Math.random().toString(36).substr(2, 6)}`;
      
      console.log('معلومات الطلب:');
      console.log('  - User Session (ثابت):', userSessionId);
      console.log('  - Request ID (فريد):', requestId);
      console.log('  - Timestamp:', new Date(timestamp).toLocaleString());

      const formDataToSend = new FormData();

      // استخدام الـ session الثابت
      formDataToSend.append('customer_session_id', userSessionId);
      formDataToSend.append('request_id', requestId);
      formDataToSend.append('request_timestamp', timestamp.toString());
      
      // البيانات الأساسية
      formDataToSend.append('customer_name', formData.customer_name.trim());
      formDataToSend.append('customer_phone', formData.customer_phone.trim());
      formDataToSend.append('customer_whatsapp', formData.customer_whatsapp.trim());
      formDataToSend.append('recipient_name', formData.recipient_name.trim());
      formDataToSend.append('destination', formData.destination.trim());
      
      // إضافة shipping_address كقيمة افتراضية أو نفس قيمة destination
      formDataToSend.append('shipping_address', formData.destination.trim());
      
      formDataToSend.append('shipping_method', 'express');

      // إضافة الملفات
      if (formData.identity_front_file && formData.identity_back_file) {
        const frontFileName = `front_${requestId}.jpg`;
        const backFileName = `back_${requestId}.jpg`;
        
        formDataToSend.append('identity_front', formData.identity_front_file, frontFileName);
        formDataToSend.append('identity_back', formData.identity_back_file, backFileName);
      }

      console.log('إرسال طلب شحن جديد...');
      const shippingResult = await shippingService.createShipping(formDataToSend);

      console.log('تم إنشاء طلب الشحن بنجاح:', shippingResult);

      // الخطوة 2: استخراج purchase_id وإنشاء الطلب
      const purchaseId = shippingResult.data?.purchase_id;
      
      if (!purchaseId) {
        console.error('لم يتم العثور على purchase_id في رد الشحن');
        showToast('حدث خطأ: لم يتم العثور على معرف الشراء', 'error');
        return;
      }

      console.log('إنشاء طلب جديد باستخدام purchase_id:', purchaseId);
      
      const orderResult = await shippingService.createOrder(purchaseId);
      
      console.log('تم إنشاء الطلب بنجاح:', orderResult);

      // إظهار رسائل النجاح
      showToast(shippingResult.message || 'تم إنشاء الشحن بنجاح', 'success');
      
      // رسالة إضافية للطلب إذا كان لديها رسالة مختلفة
      if (orderResult.message && orderResult.message !== shippingResult.message) {
        setTimeout(() => {
          showToast(orderResult.message || 'تم إنشاء الطلب بنجاح', 'success');
        }, 1500);
      }

      // إعادة تعيين النموذج للطلب التالي
      setFormData({
        customer_name: '',
        customer_phone: '',
        customer_whatsapp: '',
        recipient_name: '',
        destination: '',
        identity_front_file: null,
        identity_back_file: null,
      });

      console.log('تمت العملية بنجاح - النموذج جاهز لطلب جديد');
      console.log('ملخص العملية:');
      console.log('  - Shipping ID:', shippingResult.data?.shipping_id);
      console.log('  - Purchase ID:', purchaseId);
      console.log('  - Order ID:', orderResult.data?.order_id);

      // التوجه للصفحة الرئيسية بعد النجاح
      setTimeout(() => {
        console.log('توجيه المستخدم للصفحة الرئيسية...');
        router.push('/');
      }, 2000);

    } catch (error: any) {
      console.error('خطأ في عملية إنشاء الشحن أو الطلب:', error);
      showToast(error.message || 'حدث خطأ غير متوقع', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div
        className={`w-full max-w-7xl p-4 sm:p-6 rounded-2xl shadow-xl backdrop-blur-sm border overflow-y-auto ${
          isDark 
            ? 'bg-gray-900 border-gray-700 text-white' 
            : 'bg-white border-white/20 text-gray-900'
        }`}
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #111827 100%)'
            : 'linear-gradient(135deg, #FFFFFF 3%, #F8F9FA 20%, #F1F3F4 40%, #E8EAED 60%, #F1F3F4 80%, #FFFFFF 100%)',
          direction: 'rtl',
          maxHeight: '95vh',
        }}
      >
        {/* العنوان */}
        <div className="text-center mb-4">
          <h2
            className="text-lg sm:text-xl font-bold mb-1"
            style={{ color: isDark ? '#FFFFFF' : '#111827' }}
          >
            معلومات الشحن
          </h2>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            جميع المعلومات محمية ومشفرة بأمان
          </p>
        </div>

        {/* الحقول الأساسية - صفين: 3 في الأول و 2 في الثاني */}
        {/* الصف الأول - 3 حقول */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
          <FormField
            label="اسم العميل"
            type="text"
            placeholder="أحمد محمد علي"
            value={formData.customer_name}
            onChange={handleInputChange('customer_name')}
            icon={User}
            id="customer_name"
            required
            theme={isDark ? 'dark' : 'light'} // ✅ تمرير الثيم حسب السياق
            error={errors.customer_name}
          />

          <FormField
            label="رقم هاتف العميل"
            type="tel"
            placeholder="+201234567890"
            value={formData.customer_phone}
            onChange={handleInputChange('customer_phone')}
            icon={Phone}
            id="customer_phone"
            required
            theme={isDark ? 'dark' : 'light'}
            error={errors.customer_phone}
          />

          <FormField
            label="رقم واتساب العميل"
            type="tel"
            placeholder="+201234567891"
            value={formData.customer_whatsapp}
            onChange={handleInputChange('customer_whatsapp')}
            icon={MessageSquare}
            id="customer_whatsapp"
            required
            theme={isDark ? 'dark' : 'light'}
            error={errors.customer_whatsapp}
          />
        </div>

        {/* الصف الثاني - 2 حقول */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
          <FormField
            label="اسم المستلم"
            type="text"
            placeholder="اسم المستلم"
            value={formData.recipient_name}
            onChange={handleInputChange('recipient_name')}
            icon={User}
            id="recipient_name"
            required
            theme={isDark ? 'dark' : 'light'}
            error={errors.recipient_name}
          />

          <FormField
            label="عنوان الوجهة"
            type="text"
            placeholder="عنوان الوجهة"
            value={formData.destination}
            onChange={handleInputChange('destination')}
            icon={MapPin}
            id="destination"
            required
            theme={isDark ? 'dark' : 'light'}
            error={errors.destination}
          />
        </div>

        {/* صور الهوية */}
        <div className="mb-4">
          <Label>صور الهوية للمستلم</Label>
          <div className="grid grid-cols-2 gap-2">
            <FileUpload
              label="الوجه الأمامي"
              icon={<FileText size={16} />}
              accept="image/*"
              onChange={handleFileChange('identity_front_file')}
              theme={isDark ? 'dark' : 'light'}
              error={errors.identity_front_file}
            />
            <FileUpload
              label="الوجه الخلفي"
              icon={<FileText size={16} />}
              accept="image/*"
              onChange={handleFileChange('identity_back_file')}
              theme={isDark ? 'dark' : 'light'}
              error={errors.identity_back_file}
            />
          </div>
        </div>

        {/* زر التأكيد */}
        <div className="mt-6 mb-16 flex justify-center">
          <Button
            text={isSubmitting ? 'جاري المعالجة...' : 'تأكيد الطلب'}
            onClick={handleSubmit}
            className="w-full max-w-md h-16"
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting}
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;