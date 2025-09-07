'use client';
import React from 'react';
import ContactSection from '../organisms/ContactSection';
import ContactForm from '../organisms/ContactForm';
import useTheme from "@/hooks/useTheme";

const ContactTemplate: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen mt-20 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-b from-teal-50 to-white'
    }`}>
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className={`text-4xl font-extrabold transition-colors duration-300 ${
            isDark ? 'text-emerald-300' : 'text-teal-800'
          }`}>
            تواصل معنا
          </h1>
          <p className={`text-lg mt-4 max-w-2xl mx-auto transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-gray-600'
          }`}>
            نحن نهتم بآرائك ومقترحاتك. لا تتردد في إرسال رسالة، وسنتواصل معك في أقرب وقت ممكن.
          </p>
        </header>

        <ContactSection />

        <h2 className={`text-2xl font-bold text-center mb-6 transition-colors duration-300 ${
          isDark ? 'text-emerald-300' : 'text-teal-800'
        }`}>
          أرسل لنا رسالة
        </h2>
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactTemplate;