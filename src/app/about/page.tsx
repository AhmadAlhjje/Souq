
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
  FaGlobe 
} from "react-icons/fa";
import AboutPageTemplate from "@/components/templates/AboutPageTemplate";
import IconWrapper from "@/components/molecules/IconWrapper";
import { Solution } from "@/types";

const AboutPage: React.FC = () => {
  const solutions: Solution[] = [
    {
      id: 1,
      title: "رؤيتنا",
      description: "تركز الشركة المجتمعية المتكاملة لصناعة الرقمية والتجارة الالكترونية",
      image: "/images/image1.png",
      buttonIcon: <FaStore className="text-sm" />,
      buttonText: "اعرف المزيد",
      features: [
        {
          icon: <IconWrapper icon={<FaPlug />} />,
          title: "تطوير الأعمال والتسويق الرقمي والتجارة الالكترونية",
          description: "",
        },
        {
          icon: <IconWrapper icon={<FaRocket />} />,
          title: "أتمتة الخدمات وتطوير البيئات التفاعلية",
          description: "",
        },
        {
          icon: <IconWrapper icon={<FaUsers />} />,
          title: "إدارة المشاريع ومتابعة الفرق",
          description: "",
        },
      ],
      background: "bg-white/80",
      reverse: false,
    },
    {
      id: 2,
      title: "قيمتنا",
      description: "نسعى جاهدين لتطوير برامج وحلول تقنية متقدمة تغطي احتياجات التقنية والتجارة",
      image: "/images/image22.png",
      buttonIcon: <FaCreditCard className="text-sm" />,
      buttonText: "اعرف المزيد",
      features: [
        {
          icon: <IconWrapper icon={<FaExchangeAlt />} gradient="from-emerald-500 to-emerald-600" />,
          title: "تقديم خيارات متقدمة للعملاء للتخصيص",
          description: "",
        },
        { 
          icon: <IconWrapper icon={<FaBolt />} gradient="from-emerald-500 to-emerald-600" />,
          title: "الاستجابة السريعة للطلبات والملاحظات من العملاء",
          description: "",
        },
        {
          icon: <IconWrapper icon={<FaCalendarCheck />} gradient="from-emerald-500 to-emerald-600" />,
          title: "التحديث المستمر لضمان أحدث التقنيات",
          description: "",
        },
        {
          icon: <IconWrapper icon={<FaShieldAlt />} gradient="from-emerald-500 to-emerald-600" />,
          title: "حماية البيانات وخصوصية العملاء",
          description: "",
        },
      ],
      background: "bg-gradient-to-br from-[#96EDD9]/5 via-white to-[#96EDD9]/10",
      reverse: true,
    },
    {
      id: 3,
      title: "رسالتنا",
      description: "إن شركة Technology Metro Center هي مؤسسة تقنية متخصصة في جمع الخبرات والقدرات في مجال التقنية، واستخدام أحدث البرامج والتقنيات. نركز على تطوير الحلول التقنية المبتكرة التي تلبي احتياجات السوق المحلي والعالمي، مع التركيز على الجودة والكفاءة والاستدامة.",
      image: "/images/image3.png",
      buttonIcon: <FaTruck className="text-sm" />,
      buttonText: "اعرف المزيد",
      features: [
        {
          icon: <IconWrapper icon={<FaPlug />} gradient="from-blue-500 to-blue-600" />,
          title: "تطوير الحلول التقنية المبتكرة",
          description: "",
        },
        {
          icon: <IconWrapper icon={<FaGlobe />} gradient="from-blue-500 to-blue-600" />,
          title: "خدمة السوق المحلي والعالمي",
          description: "",
        },
        {
          icon: <IconWrapper icon={<FaBolt />} gradient="from-blue-500 to-blue-600" />,
          title: "التركيز على الجودة والكفاءة",
          description: "",
        },
        {
          icon: <IconWrapper icon={<FaShieldAlt />} gradient="from-blue-500 to-blue-600" />,
          title: "ضمان الاستدامة في التطوير",
          description: "",
        },
      ],
      background: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      reverse: false,
    },
  ];

  return <AboutPageTemplate solutions={solutions} />;
};

export default AboutPage;
