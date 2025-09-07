"use client";
import React from "react";
import Button from "../atoms/Button";
import Typography from "../atoms/Typography";
import Icon from "../atoms/Icon";
import HeroImageCard from "./HeroImageCard";
import useTheme from "@/hooks/useTheme";
import StatsCard from "../molecules/StatsCard";

interface StatData {
  value: string;
  label: string;
}

const HeroSection: React.FC = () => {
  const { isDark } = useTheme();

  const stats: StatData[] = [
    { value: "+60K", label: "تاجر نشط" },
    { value: "24/7", label: "دعم تقني" },
    { value: "99%", label: "رضا العملاء" },
  ];

  return (
    <div
      className={`mt-2 relative min-h-screen overflow-hidden transition-colors duration-500 ${
        isDark ? "bg-slate-900" : "bg-gradient-to-br from-teal-50 to-white"
      }`}
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-32 right-1/3 w-40 h-40 rounded-full blur-2xl transition-colors duration-500 ${
            isDark
              ? "bg-emerald-500/20"
              : "bg-gradient-to-br from-teal-500/30 to-transparent"
          }`}
        ></div>
        <div
          className={`absolute bottom-32 left-1/4 w-60 h-60 rounded-full blur-3xl transition-colors duration-500 ${
            isDark
              ? "bg-emerald-600/15"
              : "bg-gradient-to-tr from-teal-800/20 to-transparent"
          }`}
        ></div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center" dir="rtl">
        <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="text-right space-y-8 relative z-10 order-1">
              <div className="space-y-6 animate-in slide-in-from-right duration-1000">
                <div className="flex items-center justify-end gap-4">
                  <div
                    className={`w-3 h-3 rounded-full animate-pulse transition-colors duration-300 ${
                      isDark ? "bg-emerald-400" : "bg-teal-500"
                    }`}
                  ></div>
                </div>
              </div>

              <div className="space-y-6 animate-in slide-in-from-right duration-1000 delay-300">
                <Typography
                  className={`text-xl sm:text-2xl lg:text-3xl font-bold leading-relaxed transition-colors duration-300 ${
                    isDark ? "text-emerald-300" : "text-teal-800"
                  }`}
                >
                  شركة
                  <span className="relative inline-block mx-2">
                    <span
                      className={`font-black transition-colors duration-300 ${
                        isDark ? "text-emerald-400" : "text-teal-800"
                      }`}
                    >
                      TMC
                    </span>
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors duration-300 ${
                        isDark
                          ? "bg-emerald-400"
                          : "bg-gradient-to-r from-teal-500 to-teal-800"
                      }`}
                    ></div>
                  </span>
                  Technology Metro Center
                  <span
                    className={`block text-lg sm:text-xl lg:text-2xl font-medium mt-2 transition-colors duration-300 ${
                      isDark ? "text-emerald-300/80" : "text-teal-800/80"
                    }`}
                  >
                    هي شركة متخصصة في التقنية والتجارة الإلكترونية
                  </span>
                </Typography>

                <Typography
                  variant="body"
                  className={`text-lg lg:text-xl leading-loose transition-colors duration-300 ${
                    isDark ? "text-slate-300" : "text-gray-600"
                  }`}
                >
                  نوفر منصة متكاملة لبناء المتاجر الإلكترونية بسهولة وأمان، مع
                  حلول تقنية متقدمة تشمل إدارة المحتوى الشامل والدفع الرقمي،
                  بالإضافة إلى أدوات تسويقية ذكية تساعد على زيادة التفاعل
                  والمبيعات
                </Typography>
              </div>

              <div className="pt-10 animate-in slide-in-from-right duration-1000 delay-500">
                <Button
                  variant="primary"
                  size="lg"
                  startIcon={<Icon name="rocket" size="md" />}
                  className={`transition-all duration-300 gap-x-2 ${
                    isDark
                      ? "bg-emerald-600 hover:bg-emerald-500 border-2 border-transparent hover:border-emerald-400/30"
                      : "bg-teal-600 hover:bg-teal-700 border-2 border-transparent hover:border-teal-500/30"
                  }`}
                >
                  ابدأ الآن مجاناً
                </Button>
              </div>

              {/* Stats Section */}
              <div
                className={`pt-2 animate-in slide-in-from-right duration-1000 delay-700 border-t transition-colors duration-300 ${
                  isDark ? "border-slate-600/40" : "border-gray-200/40"
                }`}
              >
                <div className="grid grid-cols-3 gap-6 lg:gap-8 text-center">
                  {stats.map((stat: StatData, index: number) => (
                    <StatsCard
                      key={index}
                      value={stat.value}
                      label={stat.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Image Section */}
            <HeroImageCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
