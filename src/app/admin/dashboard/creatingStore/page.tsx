"use client";
import React, { useState } from 'react';
import { 
  MapPin, 
  Save,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Button from '../../../../components/atoms/Button';
import InputField from '../../../../components/molecules/InputField';
import TextareaField from '../../../../components/molecules/TextareaField';
import FileUpload from '../../../../components/molecules/FileUpload';
import ProgressSection from '../../../../components/molecules/ProgressSection';
import StepIndicator from '../../../../components/molecules/StepIndicator';
import SuccessMessage from '../../../../components/organisms/SuccessMessage';

interface StoreFormData {
  name: string;
  location: string;
  description: string;
  coverImage: File | null;
  logoImage: File | null;
}

interface FormErrors {
  name?: string;
  location?: string;
  description?: string;
  coverImage?: string;
  logoImage?: string;
}

const CreateStorePage: React.FC = () => {
  // State Managementx
  const [formData, setFormData] = useState<StoreFormData>({
    name: '',
    location: '',
    description: '',
    coverImage: null,
    logoImage: null
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  // Form Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'اسم المتجر مطلوب';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'اسم المتجر يجب أن يكون حرفين على الأقل';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'اسم المتجر طويل جداً';
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = 'موقع المتجر مطلوب';
    } else if (formData.location.trim().length < 2) {
      newErrors.location = 'موقع المتجر قصير جداً';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'وصف المتجر مطلوب';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'الوصف قصير جداً (10 أحرف على الأقل)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input Change Handlers
  const handleInputChange = (field: keyof StoreFormData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // Clear error when user starts typing
      if (errors[field as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    };

  // File Change Handler
  const handleFileChange = (field: 'coverImage' | 'logoImage', file: File | null) => {
    // File validation
    if (file) {
      const maxSize = field === 'coverImage' ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB for cover, 5MB for logo
      
      if (file.size > maxSize) {
        setErrors(prev => ({ 
          ...prev, 
          [field]: `الملف كبير جداً. الحد الأقصى: ${field === 'coverImage' ? '10' : '5'}MB` 
        }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, [field]: 'يرجى اختيار ملف صورة صالح' }));
        return;
      }
    }

    setFormData(prev => ({ ...prev, [field]: file }));
    
    // Clear error when file is selected
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Form Submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          location: '',
          description: '',
          coverImage: null,
          logoImage: null
        });
        setErrors({});
        setSuccess(false);
        setStep(1);
      }, 3000);
    } catch (error) {
      console.error('Error creating store:', error);
    } finally {
      setLoading(false);
    }
  };

  // Utility Functions
  const getCompletionPercentage = (): number => {
    let completed = 0;
    if (formData.name.trim()) completed += 25;
    if (formData.location.trim()) completed += 25;
    if (formData.description.trim()) completed += 25;
    if (formData.coverImage || formData.logoImage) completed += 25;
    return completed;
  };

  const canProceedToStep2 = (): boolean => {
    return !!(formData.name.trim() && formData.location.trim() && formData.description.trim());
  };

  const handleNextStep = () => {
    if (canProceedToStep2()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-200/30 dark:bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-200/30 dark:bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            إنشاء متجر جديد
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            ابدأ رحلتك التجارية في خطوات بسيطة
          </p>
        </div>

        {/* Progress Section */}
        <ProgressSection percentage={getCompletionPercentage()} />

        {/* Success Message */}
        <SuccessMessage show={success} />

        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Step 1: Basic Store Information */}
        {step === 1 && (
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="space-y-6">
              
              {/* Store Name Field */}
              <div>
                <InputField
                  label="اسم المتجر"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  placeholder="اختر اسماً مميزاً لمتجرك"
                  required
                />
                {errors.name && (
                  <div className="mt-2">
                    <p className="text-red-500 text-sm flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Store Location Field */}
              <div>
                <InputField
                  label="الموقع"
                  value={formData.location}
                  onChange={handleInputChange('location')}
                  placeholder="المدينة، الدولة"
                  icon={MapPin}
                  required
                />
                {errors.location && (
                  <div className="mt-2">
                    <p className="text-red-500 text-sm flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.location}
                    </p>
                  </div>
                )}
              </div>

              {/* Store Description Field */}
              <div>
                <TextareaField
                  label="وصف المتجر"
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  placeholder="اكتب وصفاً موجزاً عن متجرك والمنتجات التي تقدمها..."
                  rows={4}
                  maxLength={300}
                  required
                  showCharacterCount
                  minLength={10}
                />
                {errors.description && (
                  <div className="mt-2">
                    <p className="text-red-500 text-sm flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Next Step Button */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleNextStep}
                  disabled={!canProceedToStep2()}
                  size="lg"
                  endIcon={<ArrowRight className="w-4 h-4" />}
                  variant="teal"
                >
                  التالي: إضافة الصور
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Store Images */}
        {step === 2 && (
          <div className="space-y-6">
            
            {/* Images Upload Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Cover Image Upload */}
              <FileUpload
                title="صورة الغلاف"
                description="صورة رئيسية تمثل متجرك (اختيارية)"
                file={formData.coverImage}
                onFileChange={(file) => handleFileChange('coverImage', file)}
                maxSize={10 * 1024 * 1024}
                error={errors.coverImage}
                previewType="cover"
              />

              {/* Logo Image Upload */}
              <FileUpload
                title="شعار المتجر"
                description="الشعار الرسمي لمتجرك (اختياري)"
                file={formData.logoImage}
                onFileChange={(file) => handleFileChange('logoImage', file)}
                maxSize={5 * 1024 * 1024}
                error={errors.logoImage}
                previewType="logo"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6">
              
              {/* Back Button */}
              <Button
                onClick={handlePreviousStep}
                variant="secondary"
                startIcon={<ArrowRight className="w-4 h-4 rotate-180" />}
              >
                رجوع
              </Button>
              
              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={loading || success}
                size="lg"
                variant="teal"
                loading={loading}
                className="min-w-[200px]"
                startIcon={!loading && !success ? <Save className="w-5 h-5" /> : undefined}
                endIcon={!loading && !success ? <Sparkles className="w-4 h-4" /> : undefined}
              >
                {loading ? (
                  'جاري الإنشاء...'
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    تم بنجاح!
                  </>
                ) : (
                  'إنشاء المتجر'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateStorePage;