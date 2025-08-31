import React, { useState } from 'react';
import { FileText, User, Phone, MapPin, Hash } from 'lucide-react';
import { COLORS } from '../../constants/colors';
import FormField from '../molecules/FormField';
import FileUpload from '../molecules/FileUpload';
import Button from '../atoms/Button';
import Label from '../atoms/Label';

interface ShippingFormData {
  title: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  identityFile: File | null;
  addressFile: File | null;
}

interface FormErrors {
  title?: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  identityFile?: string;
  addressFile?: string;
}

const ShippingForm: React.FC<{ theme?: 'light' | 'dark' }> = ({ theme = 'light' }) => {
  const colors = COLORS[theme];
  
  const [formData, setFormData] = useState<ShippingFormData>({
    title: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    identityFile: null,
    addressFile: null
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'العنوان مطلوب';
    }
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'اسم المستلم مطلوب';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'رقم الهاتف مطلوب';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'رقم الهاتف غير صحيح';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'العنوان التفصيلي مطلوب';
    }
    
    if (!formData.identityFile) {
      newErrors.identityFile = 'صورة الهوية الخلفية مطلوبة';
    }
    
    if (!formData.addressFile) {
      newErrors.addressFile = 'صورة الهوية الأمامية مطلوبة';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ShippingFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleFileChange = (field: 'identityFile' | 'addressFile') => (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted successfully:', formData);
      
      setFormData({
        title: '',
        fullName: '',
        phoneNumber: '',
        address: '',
        identityFile: null,
        addressFile: null
      });
      
      alert('تم إرسال البيانات بنجاح!');
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="mt-16 w-full max-w-2xl mx-auto p-4 sm:p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-white/20 max-h-[90vh] overflow-y-auto" 
      style={{ 
        background: 'linear-gradient(135deg, #FFFFFF 3%, #F8F9FA 20%, #F1F3F4 40%, #E8EAED 60%, #F1F3F4 80%, #FFFFFF 100%)',
        direction: 'rtl' 
      }}
    >
      <div className="text-center mb-4 sm:mb-6">
        <h2 
          className="text-lg sm:text-xl font-bold mb-2" 
          style={{ color: colors.text.primary }}
        >
          معلومات الشحن
        </h2>
        <p className="text-sm text-gray-500">جميع المعلومات محمية ومشفرة بأمان</p>
      </div>

      {/* Grid Layout - 2 columns on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* العنوان */}
        <FormField
          label="العنوان"
          type="text"
          placeholder="أدخل العنوان"
          value={formData.title}
          onChange={handleInputChange('title')}
          icon={Hash}
          id="title"
          required
          theme={theme}
          error={errors.title}
          className="mb-2 sm:mb-3"
        />

        {/* اسم المستلم */}
        <FormField
          label="اسم المستلم"
          type="text"
          placeholder="الاسم الكامل"
          value={formData.fullName}
          onChange={handleInputChange('fullName')}
          icon={User}
          id="fullName"
          required
          theme={theme}
          error={errors.fullName}
          className="mb-2 sm:mb-3"
        />

        {/* رقم الهاتف */}
        <FormField
          label="رقم الهاتف"
          type="tel"
          placeholder="رقم الهاتف"
          value={formData.phoneNumber}
          onChange={handleInputChange('phoneNumber')}
          icon={Phone}
          id="phoneNumber"
          required
          theme={theme}
          error={errors.phoneNumber}
          className="mb-2 sm:mb-3"
        />

        {/* العنوان التفصيلي */}
        <FormField
          label="العنوان التفصيلي"
          type="text"
          placeholder="العنوان التفصيلي"
          value={formData.address}
          onChange={handleInputChange('address')}
          icon={MapPin}
          id="address"
          required
          theme={theme}
          error={errors.address}
          className="mb-2 sm:mb-3"
        />
      </div>

      {/* File Upload Section */}
      <div className="mt-4 sm:mt-6 mb-4 sm:mb-6">
        <Label>صورة الهوية</Label>
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <FileUpload
            label="الوجه الخلفي"
            icon={<FileText size={18} />}
            accept="image/*"
            onChange={handleFileChange('identityFile')}
            theme={theme}
            error={errors.identityFile}
          />
          <FileUpload
            label="الوجه الأمامي"
            icon={<FileText size={18} />}
            accept="image/*"
            onChange={handleFileChange('addressFile')}
            theme={theme}
            error={errors.addressFile}
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button 
        text={isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
        onClick={handleSubmit}
        className="w-full"
        size="lg"
        loading={isSubmitting}
        disabled={isSubmitting}
        variant="primary"
      />
    </div>
  );
};

export default ShippingForm;