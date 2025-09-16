// components/forms/ProductReviewForm.tsx
'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { createReview, generateSessionId } from '@/api/stores';
import { useToast } from '@/hooks/useToast';

interface ProductReviewFormProps {
  productId: number;
  onReviewSubmitted?: () => void;
}

const ProductReviewForm: React.FC<ProductReviewFormProps> = ({ 
  productId, 
  onReviewSubmitted 
}) => {
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { showToast } = useToast();

  // دالة إعادة تعيين النموذج
  const resetForm = () => {
    setReviewerName('');
    setRating(0);
    setHoverRating(0);
    setComment('');
  };

  // دالة التحقق من صحة البيانات
  const validateForm = (): { isValid: boolean; message?: string } => {
    // إذا لم يتم إدخال أي شيء
    if (!rating && !comment.trim() && !reviewerName.trim()) {
      return { isValid: false, message: 'يرجى إدخال تقييم أو تعليق على الأقل' };
    }

    // إذا كان هناك تعليق بدون اسم
    if (comment.trim() && !reviewerName.trim()) {
      return { isValid: false, message: 'يجب إدخال اسمك عند كتابة تعليق' };
    }

    return { isValid: true };
  };

  // دالة إرسال التقييم
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من صحة البيانات
    const validation = validateForm();
    if (!validation.isValid) {
      showToast(validation.message!, 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // إعداد بيانات التقييم
      const reviewData: any = {
        session_id: generateSessionId(),
        product_id: productId,
        review_type: 'product'
      };

      // إضافة الحقول المملوءة فقط
      if (reviewerName.trim()) {
        reviewData.reviewer_name = reviewerName.trim();
      }

      if (rating > 0) {
        reviewData.rating = rating;
      }

      if (comment.trim()) {
        reviewData.comment = comment.trim();
      }

      console.log('🚀 إرسال تقييم المنتج:', reviewData);

      // إرسال التقييم
      await createReview(reviewData);

      // رسالة النجاح
      if (rating && comment.trim()) {
        showToast('تم إرسال التقييم والتعليق بنجاح! شكراً لك', 'success');
      } else if (rating) {
        showToast('تم إرسال التقييم بنجاح! شكراً لك', 'success');
      } else if (comment.trim()) {
        showToast('تم إرسال التعليق بنجاح! شكراً لك', 'success');
      }

      // إعادة تعيين النموذج
      resetForm();

      // استدعاء callback إذا كان موجوداً
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

    } catch (error: any) {
      console.error('❌ خطأ في إرسال التقييم:', error);
      
      let errorMessage = 'حدث خطأ أثناء إرسال التقييم';
      
      if (error.response?.status === 400) {
        errorMessage = 'بيانات التقييم غير صحيحة';
      } else if (error.response?.status === 404) {
        errorMessage = 'المنتج غير موجود';
      } else if (error.response?.status >= 500) {
        errorMessage = 'خطأ في الخادم، يرجى المحاولة لاحقاً';
      }

      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 font-cairo">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-yellow-500">⭐</span>
        شاركنا رأيك في هذا المنتج
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* حقل الاسم */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الاسم (اختياري للتقييم، إجباري للتعليق)
          </label>
          <input
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="اكتب اسمك هنا..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            maxLength={50}
          />
        </div>

        {/* التقييم بالنجوم */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            التقييم (اختياري)
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  size={24}
                  className={`${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="mr-2 text-sm text-gray-600">
                ({rating} من 5)
              </span>
            )}
          </div>
        </div>

        {/* حقل التعليق */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            التعليق (اختياري)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="شاركنا تجربتك مع هذا المنتج..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">
            {comment.length}/500 حرف
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري الإرسال...
              </span>
            ) : (
              'إرسال التقييم'
            )}
          </button>

          <button
            type="button"
            onClick={resetForm}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            مسح
          </button>
        </div>

        {/* رسالة توضيحية */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          💡 <strong>ملاحظة:</strong> يمكنك إرسال تقييم فقط، أو تعليق مع اسمك، أو الاثنين معاً
        </div>
      </form>
    </div>
  );
};

export default ProductReviewForm;