"use client";

import React, { useState, useEffect } from "react";
import ContactSection from "../organisms/ContactSection";
import ContactForm from "../organisms/ContactForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import useTheme from "@/hooks/useTheme";

const ContactTemplate: React.FC = () => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  // محاكاة تحميل أولي مع toast
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setHasLoaded(true);
      // Toast ترحيبي عند تحميل الصفحة
      showToast("مرحباً بك في صفحة التواصل!", "success");

      // Toast معلوماتي بعد ثانيتين
      setTimeout(() => {
        showToast("نحن هنا لمساعدتك في أي استفسار", "info");
      }, 2000);
    }, 1500);

    return () => clearTimeout(timer);
  }, [showToast]);

  // دالة للنسخ للحافظة
  const handleCopyToClipboard = (text: string, type: string) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          showToast(`تم نسخ ${type} بنجاح`, "success");
        })
        .catch(() => {
          showToast(`فشل في نسخ ${type}`, "error");
        });
    } else {
      showToast("المتصفح لا يدعم النسخ التلقائي", "warning");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center p-4">
        <LoadingSpinner
          size="lg"
          color="green"
          message="نستعد لمساعدتك..."
          overlay={true}
          pulse={true}
          dots={true}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen mt-20 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-b from-teal-50 to-white"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* عنوان الصفحة */}
        <header className="text-center mb-12 transition-opacity duration-1000 delay-150">
          <h1
            className={`text-4xl font-extrabold transition-colors duration-300 ${
              isDark ? "text-emerald-300" : "text-teal-800"
            } ${hasLoaded ? "opacity-100" : "opacity-0"}`}
          >
            تواصل معنا
          </h1>
          <p
            className={`text-lg mt-4 max-w-2xl mx-auto transition-colors duration-300 ${
              isDark ? "text-slate-300" : "text-gray-600"
            } ${hasLoaded ? "opacity-100" : "opacity-0"}`}
          >
            نحن نهتم بآرائك ومقترحاتك. لا تتردد في إرسال رسالة، وسنتواصل معك في
            أقرب وقت ممكن.
          </p>
        </header>

        {/* قسم الاتصال - بدون props إضافية */}
        <div
          className={`transition-opacity duration-1000 delay-300 ${
            hasLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <ContactSection />
        </div>

        {/* نموذج التواصل - بدون props إضافية */}
        <h2
          className={`text-2xl font-bold text-center mb-6 transition-colors duration-300 ${
            isDark ? "text-emerald-300" : "text-teal-800"
          } ${hasLoaded ? "opacity-100" : "opacity-0"}`}
        >
          أرسل لنا رسالة
        </h2>
        <div
          className={`transition-opacity duration-1000 delay-500 ${
            hasLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <ContactForm />
        </div>
      </div>

      {/* تأثير تدريجي للعناصر عند التحميل */}
      <style jsx global>{`
        .opacity-0 {
          opacity: 0;
        }
        .opacity-100 {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default ContactTemplate;
