import React from 'react';
import ContactCard from '../molecules/ContactCard';
import useTheme from "@/hooks/useTheme";

const ContactSection: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <section className={`py-12 rounded-2xl mb-16 transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-800/50 border border-slate-600' 
        : 'bg-teal-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold transition-colors duration-300 ${
            isDark ? 'text-emerald-300' : 'text-teal-800'
          }`}>
            معلومات الاتصال
          </h2>
          <p className={`mt-2 transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-gray-600'
          }`}>
            نحن هنا لمساعدتك في كل وقت
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ContactCard
            title="موقعنا"
            description="شارع الملك عبد الله، عمّان، الأردن"
            icon="location"
          />
          <ContactCard
            title="البريد الإلكتروني"
            description="support@company.com"
            icon="envelope"
          />
          <ContactCard
            title="رقم الهاتف"
            description="+962 7 1234 5678"
            icon="phone"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;