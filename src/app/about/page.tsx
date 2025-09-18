"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FaRocket,
  FaShieldAlt,
  FaGlobe,
  FaEye,
  FaLightbulb,
  FaHandshake,
  FaCogs,
} from "react-icons/fa";
import AboutPageTemplate from "@/components/templates/AboutPageTemplate";
import IconWrapper from "@/components/molecules/IconWrapper";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/useToast"; // ← استيراد useToast
import { Solution } from "@/types";

const AboutPage: React.FC = () => {
  const { showToast } = useToast(); // ← استخدام Toast hook
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const solutions: Solution[] = useMemo(
    () => [
      {
        id: 1,
        title: "رؤيتنا",
        description: "أن نكون المنصة الرائدة في تمكين التجار من التحول الرقمي.",
        image: "/images/image 72 (2).png",
        buttonIcon: null,
        buttonText: "",
        features: [
          {
            icon: <IconWrapper icon={<FaGlobe />} />,
            title: "فتح آفاق جديدة للنمو والتميز في عالم التكنولوجيا والتجارة.",
            description: "",
          },
          {
            icon: <IconWrapper icon={<FaRocket />} />,
            title: "تقديم تجربة تجارة إلكترونية مبتكرة وسهلة الاستخدام.",
            description: "",
          },
          {
            icon: <IconWrapper icon={<FaShieldAlt />} />,
            title: "ضمان بيئة آمنة للتجار والعملاء على حد سواء.",
            description: "",
          },
        ],
        background: "bg-white/80",
        reverse: false,
      },
      {
        id: 2,
        title: "قيمنا",
        description: "",
        image: "/images/image 73 (2).png",
        buttonIcon: null,
        buttonText: "",
        features: [
          {
            icon: (
              <IconWrapper
                icon={<FaLightbulb />}
                gradient="from-emerald-500 to-emerald-600"
              />
            ),
            title:
              "الابتكار: نطور حلولاً تقنية مبتكرة تواكب تطور التجارة الرقمية.",
            description: "",
          },
          {
            icon: (
              <IconWrapper
                icon={<FaEye />}
                gradient="from-emerald-500 to-emerald-600"
              />
            ),
            title:
              "الشفافية: نلتزم بالوضوح والمصداقية في تعاملاتنا مع التجار والعملاء.",
            description: "",
          },
          {
            icon: (
              <IconWrapper
                icon={<FaHandshake />}
                gradient="from-emerald-500 to-emerald-600"
              />
            ),
            title: "الثقة: نبني علاقة طويلة الأمد قائمة على الأمان والموثوقية.",
            description: "",
          },
          {
            icon: (
              <IconWrapper
                icon={<FaCogs />}
                gradient="from-emerald-500 to-emerald-600"
              />
            ),
            title:
              "التمكين: نمنح التجار الأدوات اللازمة للنمو والنجاح في العالم الرقمي.",
            description: "",
          },
        ],
        background:
          "bg-gradient-to-br from-[#96EDD9]/5 via-white to-[#96EDD9]/10",
        reverse: true,
      },
      {
        id: 3,
        title: "رسالتنا",
        description:
          "في شركة TMC – Technology Metro Center نسعى إلى تمكين التجار من دخول عالم التجارة الإلكترونية بسهولة واحترافية، من خلال توفير منصة متكاملة لإنشاء وإدارة المتاجر الإلكترونية، تدعمهم بحلول تقنية حديثة تشمل أنظمة الدفع الآمنة، خدمات الشحن الموثوقة، وإدارة المخزون بكفاءة. كما نحرص على تزويد التجار بأدوات تسويق مبتكرة تساعدهم على الوصول إلى عملائهم وزيادة مبيعاتهم، مع الالتزام بتقديم بيئة رقمية آمنة وموثوقة تفتح أمامهم آفاقًا جديدة للنمو والتميز في عالم التجارة والتكنولوجيا. نؤمن بأن كل تاجر يستحق الحصول على فرصة متساوية للنجاح في العصر الرقمي، لذا نقدم حلولاً مرنة تتكيف مع احتياجات الأعمال المختلفة، سواء كانت شركات ناشئة أو مؤسسات كبيرة. فريقنا المتخصص يعمل على مدار الساعة لضمان استمرارية الخدمة وتقديم الدعم الفني اللازم، بينما نطور باستمرار ميزات جديدة تواكب التطورات التكنولوجية العالمية. نسعى لبناء شراكات استراتيجية طويلة المدى مع عملائنا، ونعمل كشريك موثوق يرافقهم في رحلة التحول الرقمي من البداية حتى تحقيق أهدافهم التجارية. كما نلتزم بالمعايير الدولية للأمان والجودة، ونحرص على حماية بيانات عملائنا وضمان خصوصيتهم. رؤيتنا تتجاوز مجرد تقديم التكنولوجيا، بل نهدف إلى تمكين التجار من الإبداع والابتكار في أعمالهم، وخلق تجارب استثنائية لعملائهم النهائيين.",
        image: "/images/image 74.png",
        buttonIcon: null,
        buttonText: "",
        features: [],
        background: "bg-gradient-to-br from-gray-50 to-gray-100/50",
        reverse: false,
      },
    ],
    []
  ); // مصفوفة فارغة لأن البيانات ثابتة ولا تتغير

  // حساب إحصائيات الصفحة
  useEffect(() => {
    const startTime = Date.now();
    const timer = setTimeout(() => {
      const loadTime = Date.now() - startTime;
      setIsLoading(false);
      setHasLoaded(true);

      // ← Toast إضافي للترحيب بعد ثانيتين
      setTimeout(() => {
      }, 2000);
    }, 1500);

    return () => clearTimeout(timer);
  }, [showToast, solutions]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <LoadingSpinner
          size="lg"
          color="green"
          message="نعدّ لك تجربة مميزة..."
          overlay={true}
          pulse={true}
          dots={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* المحتوى الرئيسي */}
      <div
        className={`transition-opacity duration-1000 ${
          hasLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <AboutPageTemplate solutions={solutions} />
      </div>

      {/* CSS مخصص للتأثيرات */}
      <style jsx global>{`
        .opacity-0 {
          opacity: 0;
        }
        .opacity-100 {
          opacity: 1;
        }

        /* تأثيرات hover للتفاعل */
        .hover-lift:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }

        /* تأثير pulse للعناصر المهمة */
        .pulse-glow {
          animation: pulse-glow 3s infinite;
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 0 rgba(52, 211, 153, 0);
          }
          50% {
            box-shadow: 0 0 20px rgba(52, 211, 153, 0.3);
          }
        }

        /* تحسين responsive للأجهزة الصغيرة */
        @media (max-width: 768px) {
          .fixed.left-4 {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
