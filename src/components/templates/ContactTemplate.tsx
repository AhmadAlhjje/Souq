import React from 'react';
import ContactSection from '../organisms/ContactSection';
import ContactForm from '../organisms/ContactForm';

const ContactTemplate: React.FC = () => {
  return (
    <div className="min-h-screen mt-20 bg-gradient-to-b from-teal-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-teal-800">تواصل معنا</h1>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            نحن نهتم بآرائك ومقترحاتك. لا تتردد في إرسال رسالة، وسنتواصل معك في أقرب وقت ممكن.
          </p>
        </header>

        <ContactSection />

          <h2 className="text-2xl font-bold text-center text-teal-800 mb-6">أرسل لنا رسالة</h2>
          <ContactForm />
      </div>
    </div>
  );
};

export default ContactTemplate;