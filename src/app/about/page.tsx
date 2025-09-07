// pages/AboutPage.tsx
import React from "react";
import {
   FaBullhorn,
   FaRocket,
   FaCreditCard,
   FaTruck,
   FaStore,
   FaPlug,
   FaUsers,
   FaExchangeAlt,
   FaBolt,
   FaCalendarCheck,
   FaShieldAlt,
   FaGlobe,
   FaEye,
   FaLightbulb,
   FaHandshake,
   FaUserShield,
   FaCogs
 } from "react-icons/fa";
import AboutPageTemplate from "@/components/templates/AboutPageTemplate";
import IconWrapper from "@/components/molecules/IconWrapper";
import { Solution } from "@/types";

const AboutPage: React.FC = () => {
  const solutions: Solution[] = [
    {
      id: 1,
      title: "رؤيتنا",
      description: "أن نكون المنصة الرائدة في تمكين التجار من التحول الرقمي.",
      image: "/images/image 72 (2).png", // صورة الرؤية
      buttonIcon: null, // إزالة الأيقونة
      buttonText: "", // إزالة النص
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
      image: "/images/image 73 (2).png", // صورة القيم
      buttonIcon: null, // إزالة الأيقونة
      buttonText: "", // إزالة النص
      features: [
        {
          icon: <IconWrapper icon={<FaLightbulb />} gradient="from-emerald-500 to-emerald-600" />,
          title: "الابتكار: نطور حلولًا تقنية مبتكرة تواكب تطور التجارة الرقمية.",
          description: "",
        },
        {
           icon: <IconWrapper icon={<FaEye />} gradient="from-emerald-500 to-emerald-600" />,
          title: "الشفافية: نلتزم بالوضوح والمصداقية في تعاملاتنا مع التجار والعملاء.",
          description: "",
        },
        {
          icon: <IconWrapper icon={<FaHandshake />} gradient="from-emerald-500 to-emerald-600" />,
          title: "الثقة: نبني علاقة طويلة الأمد قائمة على الأمان والموثوقية.",
          description: "",
        },
        {
          icon: <IconWrapper icon={<FaCogs />} gradient="from-emerald-500 to-emerald-600" />,
          title: "التمكين: نمنح التجار الأدوات اللازمة للنمو والنجاح في العالم الرقمي.",
          description: "",
        },
      ],
      background: "bg-gradient-to-br from-[#96EDD9]/5 via-white to-[#96EDD9]/10",
      reverse: true,
    },
    {
      id: 3,
      title: "رسالتنا",
      description: "في شركة TMC – Technology Metro Center نسعى إلى تمكين التجار من دخول عالم التجارة الإلكترونية بسهولة واحترافية، من خلال توفير منصة متكاملة لإنشاء وإدارة المتاجر الإلكترونية، تدعمهم بحلول تقنية حديثة تشمل أنظمة الدفع الآمنة، خدمات الشحن الموثوقة، وإدارة المخزون بكفاءة. كما نحرص على تزويد التجار بأدوات تسويق مبتكرة تساعدهم على الوصول إلى عملائهم وزيادة مبيعاتهم، مع الالتزام بتقديم بيئة رقمية آمنة وموثوقة تفتح أمامهم آفاقًا جديدة للنمو والتميز في عالم التجارة والتكنولوجيا. نؤمن بأن كل تاجر يستحق الحصول على فرصة متساوية للنجاح في العصر الرقمي، لذا نقدم حلولاً مرنة تتكيف مع احتياجات الأعمال المختلفة، سواء كانت شركات ناشئة أو مؤسسات كبيرة. فريقنا المتخصص يعمل على مدار الساعة لضمان استمرارية الخدمة وتقديم الدعم الفني اللازم، بينما نطور باستمرار ميزات جديدة تواكب التطورات التكنولوجية العالمية. نسعى لبناء شراكات استراتيجية طويلة المدى مع عملائنا، ونعمل كشريك موثوق يرافقهم في رحلة التحول الرقمي من البداية حتى تحقيق أهدافهم التجارية. كما نلتزم بالمعايير الدولية للأمان والجودة، ونحرص على حماية بيانات عملائنا وضمان خصوصيتهم. رؤيتنا تتجاوز مجرد تقديم التكنولوجيا، بل نهدف إلى تمكين التجار من الإبداع والابتكار في أعمالهم، وخلق تجارب استثنائية لعملائهم النهائيين.",
      image: "/images/image 74.png", // صورة الرسالة
      buttonIcon: null, // إزالة الأيقونة
      buttonText: "", // إزالة النص
      features: [],
      background: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      reverse: false,
    },
  ];

 return <AboutPageTemplate solutions={solutions} />;
};

export default AboutPage;