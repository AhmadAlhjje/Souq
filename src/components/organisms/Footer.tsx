"use client";
import React from "react";
import Text from "../atoms/Text";
import Heading from "../atoms/Heading";
import Badge from "../atoms/Badge";
import { useTranslation } from "react-i18next"; // استخدم مكتبة react-i18next
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
  FaGooglePay,
} from "react-icons/fa";

const Footer = () => {
  const { t, i18n } = useTranslation();

  // تحديد الاتجاه بناء على اللغة
  const isRTL = i18n.language === "ar" || i18n.language === "he"; // عدل حسب اللغات اللي تدعمها اتجاه RTL

  const paymentMethods = [
    { name: t('footer.paymentMethods.creditCards'), icon: <FaCreditCard />, color: "text-blue-400" },
    { name: t('footer.paymentMethods.paypal'), icon: <FaPaypal />, color: "text-blue-500" },
    { name: t('footer.paymentMethods.applePay'), icon: <FaApplePay />, color: "text-gray-300" },
    { name: t('footer.paymentMethods.googlePay'), icon: <FaGooglePay />, color: "text-green-400" },
  ];

  const aboutLinks = [
    t('footer.aboutLinks.topStores'),
    t('footer.aboutLinks.articles'),
    t('footer.aboutLinks.privacyPolicy'),
    t('footer.aboutLinks.termsOfUse'),
    t('footer.aboutLinks.userGuide'),
    t('footer.aboutLinks.faq'),
  ];

  const socialLinks = [
    { name: "Facebook", icon: <FaFacebook />, color: "hover:text-blue-500", url: "#" },
    { name: "Twitter", icon: <FaTwitter />, color: "hover:text-blue-400", url: "#" },
    { name: "LinkedIn", icon: <FaLinkedin />, color: "hover:text-blue-600", url: "#" },
    { name: "Instagram", icon: <FaInstagram />, color: "hover:text-pink-500", url: "#" },
  ];

  const bottomLinks = [
    t('footer.bottomLinks.terms'),
    t('footer.bottomLinks.privacy'),
    t('footer.bottomLinks.agreement')
  ];

  return (
    <footer dir={isRTL ? 'rtl' : 'ltr'} className="relative bg-gradient-to-br from-[#004D5A] via-[#003a45] to-[#002830] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} w-96 h-96 bg-[#96EDD9]/20 rounded-full blur-3xl`}></div>
        <div className={`absolute bottom-0 ${isRTL ? 'left-0' : 'right-0'} w-72 h-72 bg-[#96EDD9]/10 rounded-full blur-3xl`}></div>
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br from-[#96EDD9] to-[#7dd3bf] rounded-2xl flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'}`}>
                    <span className="text-[#004D5A] font-bold text-xl">T</span>
                  </div>
                  <Heading text="TMC" level={3} className="text-2xl font-bold text-white" />
                </div>
                <Text
                  text={t('footer.description')}
                  className="text-white text-base leading-relaxed"
                />
              </div>

              <div>
                <Text text={t('footer.followUs')} className="text-lg text-white font-semibold mb-4" />
                <div className={`flex ${isRTL ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
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

            <div>
              <div className="flex items-center mb-6">
                <Badge text={t('footer.sections.aboutUs')} variant="hero" className="text-base" />
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-[#96EDD9] to-transparent rounded-full mb-6"></div>
              <ul className="space-y-4">
                {aboutLinks.map((link, index) => (
                  <li key={index}>
                    <a href="#" className="group flex items-center text-white/80 hover:text-white transition-all duration-300">
                      <div className={`w-2 h-2 ${isRTL ? 'ml-2' : 'mr-2'} bg-[#96EDD9]/50 rounded-full ${isRTL ? 'mr-3' : 'ml-3'} group-hover:bg-[#96EDD9] transition-colors duration-300`}></div>
                      <Text text={link} className={`text-base text-white group-hover:${isRTL ? 'translate-x-1' : '-translate-x-1'} transition-transform duration-300`} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center mb-6">
                <Badge text={t('footer.sections.paymentMethods')} variant="hero" className="text-base" />
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-[#96EDD9] to-transparent rounded-full mb-6"></div>
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className={`text-2xl ${method.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                      {method.icon}
                    </div>
                    <Text text={method.name} className="text-sm text-white group-hover:text-[#96EDD9]" />
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-[#96EDD9]/20">
                <Text text={t('footer.securePayment')} className="text-center text-white font-medium" />
              </div>
            </div>

            <div>
              <div className="flex items-center mb-6">
                <Badge text={t('footer.sections.contactUs')} variant="hero" className="text-base" />
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-[#96EDD9] to-transparent rounded-full mb-6"></div>
              <div className="space-y-6">
                <div className={`flex items-start ${isRTL ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
                  <div className={`w-12 h-12 ${isRTL ? 'ml-4' : 'mr-4'} bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 mt-1`}>
                    <FaMapMarkerAlt className="text-[#96EDD9] text-lg" />
                  </div>
                  <div>
                    <Text text={t('footer.contact.address.label')} className="text-white font-semibold mb-1" />
                    <Text text={t('footer.contact.address.value')} className="text-white" />
                  </div>
                </div>
                <div className={`flex items-start ${isRTL ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
                  <div className={`w-12 h-12 ${isRTL ? 'ml-4' : 'mr-4'} bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <FaPhone className="text-white text-lg" />
                  </div>
                  <div>
                    <Text text={t('footer.contact.phone.label')} className="text-white font-semibold mb-1" />
                    <Text text={t('footer.contact.phone.value')} className="text-white" />
                  </div>
                </div>
                <div className={`flex items-start ${isRTL ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
                  <div className={`w-12 h-12 ${isRTL ? 'ml-4' : 'mr-4'} bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <FaEnvelope className="text-white text-lg" />
                  </div>
                  <div>
                    <Text text={t('footer.contact.email.label')} className="text-white font-semibold mb-1" />
                    <Text text={t('footer.contact.email.value')} className="text-white" />
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-[#96EDD9]/20">
                  <Text text={t('footer.contact.workingHours.label')} className="text-white font-semibold mb-2" />
                  <Text text={t('footer.contact.workingHours.value')} className="text-white text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className={`flex items-center ${isRTL ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
                <div className={`w-8 h-8 ${isRTL ? 'ml-5' : 'mr-5'} bg-gradient-to-br from-[#96EDD9] to-[#7dd3bf] rounded-lg flex items-center justify-center`}>
                  <span className="text-[#004D5A] font-bold text-sm">©</span>
                </div>
                <Text text={t('footer.copyright')} className="text-white" />
              </div>
              <div className={`flex items-center ${isRTL ? 'space-x-6 space-x-reverse' : 'space-x-6'}`}>
                {bottomLinks.map((link, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-white hover:text-[#96EDD9] transition-colors duration-300 text-sm"
                  >
                    {link}
                  </a>
                ))}
              </div>
              <div className={`flex items-center ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                <Text text={t('footer.madeWith.text')} className="text-white text-sm" />
                <span className="text-red-400 text-lg animate-pulse">❤️</span>
                <Text text={t('footer.madeWith.location')} className="text-white text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
