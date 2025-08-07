// components/organisms/Footer.tsx
import React from "react";
import Text from "../atoms/Text";
import Heading from "../atoms/Heading";
import Badge from "../atoms/Badge";
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCreditCard,
  FaPaypal,
  FaApplePay,
  FaGooglePay
} from "react-icons/fa";

const Footer = () => {
  const paymentMethods = [
    { name: "بطاقات الائتمان", icon: <FaCreditCard />, color: "text-blue-400" },
    { name: "PayPal", icon: <FaPaypal />, color: "text-blue-500" },
    { name: "Apple Pay", icon: <FaApplePay />, color: "text-gray-300" },
    { name: "Google Pay", icon: <FaGooglePay />, color: "text-green-400" }
  ];

  const aboutLinks = [
    "أشهر المتاجر",
    "مقالاتنا", 
    "سياسة الخصوصية",
    "شروط الاستخدام",
    "دليل الاستخدام",
    "الأسئلة الشائعة"
  ];

  const socialLinks = [
    { name: "Facebook", icon: <FaFacebook />, color: "hover:text-blue-500", url: "#" },
    { name: "Twitter", icon: <FaTwitter />, color: "hover:text-blue-400", url: "#" },
    { name: "LinkedIn", icon: <FaLinkedin />, color: "hover:text-blue-600", url: "#" },
    { name: "Instagram", icon: <FaInstagram />, color: "hover:text-pink-500", url: "#" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-[#004D5A] via-[#003a45] to-[#002830] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#96EDD9]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#96EDD9]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Company Info Section */}
            <div className="lg:col-span-1">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#96EDD9] to-[#7dd3bf] rounded-2xl flex items-center justify-center mr-3">
                    <span className="text-[#004D5A] font-bold text-xl">T</span>
                  </div>
                  <Heading 
                    text="TMC"
                    level={3}
                    className="text-2xl font-bold text-gray-100"
                  />
                </div>
                <Text 
                  text="المنصة الرائدة في سوريا للتجارة الإلكترونية. نساعد التجار على بناء متاجرهم الإلكترونية وتحقيق النجاح."
                  className="text-[#92e9d4] text-base leading-relaxed"
                />
              </div>

              {/* Social Media */}
              <div>
                <Text text="تابعنا على:" className="text-lg text-[#92e9d4] font-semibold mb-4" />
                <div className="flex space-x-4 space-x-reverse">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 ${social.color} hover:bg-white/20 hover:scale-110`}
                      aria-label={social.name}
                    >
                      <span className="text-xl">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* About Us Section */}
            <div>
              <div className="flex items-center mb-6">
                <Badge 
                  text="ℹ️ من نحن"
                  variant="hero"
                  className="text-base"
                />
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-[#96EDD9] to-transparent rounded-full mb-6"></div>
              
              <ul className="space-y-4">
                {aboutLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="group flex items-center text-[#96EDD9]/80 hover:text-[#96EDD9] transition-all duration-300"
                    >
                      <div className="w-2 h-2 mr-2 bg-[#96EDD9]/50 rounded-full ml-3 group-hover:bg-[#96EDD9] transition-colors duration-300"></div>
                      <Text text={link} className="text-base text-[#92e9d4] group-hover:translate-x-1 transition-transform duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment Methods Section */}
            <div>
              <div className="flex items-center mb-6">
                <Badge 
                  text="💳 طرق الدفع"
                  variant="hero"
                  className="text-base"
                />
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-[#96EDD9] to-transparent rounded-full mb-6"></div>
              
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((method, index) => (
                  <div 
                    key={index}
                    className="group bg-white/5 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  >
                    <div className={`text-2xl ${method.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                      {method.icon}
                    </div>
                    <Text 
                      text={method.name}
                      className="text-sm text-[#92e9d4] group-hover:text-[#96EDD9]"
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-[#96EDD9]/20">
                <Text 
                  text="دفع آمن ومضمون 100%"
                  className="text-center text-[#92e9d4] font-medium"
                />
              </div>
            </div>

            {/* Contact Section */}
            <div>
              <div className="flex items-center mb-6">
                <Badge 
                  text="📞 تواصل معنا"
                  variant="hero"
                  className="text-base"
                />
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-[#96EDD9] to-transparent rounded-full mb-6"></div>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-12 h-12 mr-4 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <FaMapMarkerAlt className="text-[#96EDD9] text-lg" />
                  </div>
                  <div>
                    <Text text="العنوان:" className="text-[#92e9d4] font-semibold mb-1" />
                    <Text text="دمشق، سوريا - شارع الثورة" className="text-[#92e9d4]" />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-12 h-12 mr-4 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-[#96EDD9] text-lg" />
                  </div>
                  <div>
                    <Text text="الهاتف:" className="text-[#92e9d4] font-semibold mb-1" />
                    <Text text="+963 11 123 4567" className="text-[#92e9d4]" />
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-12 h-12 mr-4 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-[#92e9d4] text-lg" />
                  </div>
                  <div>
                    <Text text="البريد الإلكتروني:" className="text-[#92e9d4] font-semibold mb-1" />
                    <Text text="info@tmc.com" className="text-[#92e9d4]" />
                  </div>
                </div>

                {/* Working Hours */}
                <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-[#96EDD9]/20">
                  <Text text="ساعات العمل:" className="text-[#92e9d4] font-semibold mb-2" />
                  <Text text="الأحد - الخميس: 9:00 ص - 6:00 م" className="text-[#92e9d4] text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              
              {/* Copyright */}
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-8 h-8 mr-5 bg-gradient-to-br from-[#96EDD9] to-[#7dd3bf] rounded-lg flex items-center justify-center">
                  <span className="text-[#004D5A] font-bold text-sm">©</span>
                </div>
                <Text 
                  text="2024 TMC. جميع الحقوق محفوظة."
                  className="text-[#92e9d4]"
                />
              </div>

              {/* Quick Links */}
              <div className="flex items-center space-x-6 space-x-reverse">
                {["الشروط والأحكام", "سياسة الخصوصية", "اتفاقية الاستخدام"].map((link, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="text-[#92e9d4] hover:text-[#96EDD9] transition-colors duration-300 text-sm"
                  >
                    {link}
                  </a>
                ))}
              </div>

              {/* Made with love */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <Text text="صُنع بـ" className="text-[#92e9d4] text-sm" />
                <span className="text-red-400 text-lg animate-pulse">❤️</span>
                <Text text="في سوريا" className="text-[#92e9d4] text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;