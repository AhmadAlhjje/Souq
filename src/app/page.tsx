// app/page.tsx أو pages/index.tsx

import React from "react";
import ImageWithText from "../components/organisms/ImageWithText";
import HeroSection from "../components/molecules/HeroSection";
import Header from "../components/organisms/Header";
import Heading from "../components/atoms/Heading";
import ServicesSection from "../components/organisms/ServicesSection";
import StatisticsSection from "../components/organisms/StatisticsSection";
import Footer from "@/components/organisms/Footer";
import MainLayout from "../components/templates/MainLayout";
import TradeCategoryScroll from "../components/molecules/TradeCategoryScroll";
import CallToAction from "../components/organisms/CallToAction";
import FeatureList from '../components/organisms/FeatureList';
import { PiChartLineUp, PiFactory, PiShoppingBag, PiCubeTransparent } from "react-icons/pi";
export default function Home() {
  return (
    <MainLayout>
      <Header />
      <HeroSection />

      <div className="mx-auto p-4">
        {/* العنوان الأول */}
        <div className="font-bold text-4xl p-8 rounded-lg my-8 text-[#004D5A]">
          <Heading text="أكبر منصة سورية للتجارة في الشرق الأوسط" level={2} />
        </div>

        {/* قسم الخدمات */}
        <div className="py-6 px-6 rounded-xl bg-[#96EDD9]">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#004D5A]">خدماتنا</h2>
            <p className="text-lg text-[#004D5A]/80 mt-2">
              TMC نقدم لك كل ما تحتاجه لبناء متجر ناجح
            </p>
          </div>
          <ServicesSection />
        </div>

        {/* عنوان الانضمام */}
        <div className="text-2xl p-8 rounded-lg my-8 text-black">
          <Heading
            text="أنشئ متجرك اليوم وانضم لآلاف الأفراد والمؤسسات والشركات الناجحة مع TMC"
            level={2}
          />
        </div>

        {/* إحصائيات */}
        <StatisticsSection />

        {/* انطلق بتجارتك */}
        <Heading
          className="font-bold text-4xl p-8 rounded-lg my-8 text-[#004D5A]"
          text="انطلق بتجارتك أينما كنت"
          level={2}
        />

        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <TradeCategoryScroll />
          </div>
        </div>
            <div className="flex flex-col items-center justify-center mt-10 bg-gray-100">
     <FeatureList
     
  title="حيث تتلقى السهولة بالأناقة"
  features={[

    {
      text: "تسهّل إدارة متجرك وتقدّم تجربة تسوق استثنائية لعملائك.",
      icon: (
        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-sm border-2 border-[#004D5A]  text-[#004D5A]">
          <PiFactory className="text-xl" />
        </div>
      ),
    },
    {
      text: "استقبل سؤال شراء سهلة وملوّفة لكل عميل.",
      icon: (
        <div className="flex items-center justify-center w-10 h-10  bg-white rounded-xl shadow-sm border-2 border-[#004D5A] text-[#004D5A]">
          <PiShoppingBag className="text-xl" />
        </div>
      ),
    },
    {
      text: "عرض صور ثلاثية الأبعاد تبرز أناقة التفاصيل.",
      icon: (
        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-sm border-2 border-[#004D5A] text-[#004D5A]">
          <PiCubeTransparent className="text-xl" />
        </div>
      ),
    },
  ]}
  images={[
    { src: "/images/logo1.png", alt: "شعار 1" },
    { src: "/images/logo2.png", alt: "شعار 2" },
  ]}
/>
    </div>

        {/* أسعد عملاءك */}
        <Heading
          className="font-bold text-4xl p-8 rounded-lg my-8 text-[#004D5A]"
          text="أسعد عملاءك بتجربة شراء سهلة"
          level={2}
        />

        {/* القسم الجديد: 3 صور مع نصوص تحتها (كل صورة ونص تحتها) */}
        <div className="flex flex-wrap justify-around items-start gap-8 mt-10  px-4">
          <ImageWithText
            src="/images/plus.png"
            alt="شراء مباشر"
            title="TMC من العملاء تزداد ثقتهم في متاجر  "
          />
          <ImageWithText
            src="/images/fast-delivery.png"
            alt="توصيل سريع"
            title="شراء مباشر دون تعقيد أو إنشاء حساب "
          />
          <ImageWithText
            src="/images/secure-payment.png"
            alt="دفع آمن"
            title="TMC من 5 في سوريا اشتروا من متاجر  "
          />
        </div>
        <div className="flex flex-col items-center justify-center mt-10  bg-gray-100 ">
          <CallToAction
            buttonText="أنشئ متجر الآن"
            mainTitle=" TMC امتلك متجرًا احترافيًا في "
            subtitle="أنشئ متجرك الآن بأدوات مرنة وحلول متكاملة تساعدك في كل خطوة نحو نمو مبيعاتك وتسويق منتجاتك"
          />
        </div>
      </div>

      <Footer />
    </MainLayout>
  );
}
