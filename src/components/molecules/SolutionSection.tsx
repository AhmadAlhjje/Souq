// components/organisms/SolutionSection.tsx
import ServiceItem from "../atoms/ServiceItem";
import Image from "next/image";
import { FC, JSX } from "react";
import { FaRocket } from "react-icons/fa"; // استيراد الرمز إذا كنت ستستخدمه

interface SectionProps {
  title: string;
  discription?: string;
  items: { icon: JSX.Element; title: string; description?: string }[];
  image: string;
  reverse?: boolean;
  buttonIcon?: JSX.Element;
  buttonText?: string; // ✅ النص القابل للتغيير
  backgroundColor?: string;
}

const SolutionSection: FC<SectionProps> = ({
  title,
  discription,
  items,
  image,
  reverse = false,
  buttonIcon,
  buttonText, // ✅ استقبال النص
  backgroundColor,
}) => {
  const textAlignClass = reverse ? "text-left" : "text-right";
  const orderTextClass = reverse ? "order-2 md:order-1" : "order-1 md:order-2";
  const orderImageClass = reverse ? "order-1 md:order-2" : "order-2 md:order-1";
  const justifyButton = reverse ? "justify-start" : "justify-end";

  return (
    <section
      className={`${
        backgroundColor || ""
      } flex flex-col md:flex-row items-center justify-between gap-8 mt-32 py-10 px-4 rounded-lg`}
    >
      {" "}
      {/* الصورة */}
      <div className={`flex-1 ${orderImageClass}`}>
        <Image
          src={image}
          alt={title}
          width={500}
          height={300}
          className="rounded-lg"
        />
      </div>
      {/* القسم النصي */}
      <div className={`flex-1 m-7 ${orderTextClass}`}>
        {/* الزر مع نص وأيقونة قابلين للتغيير */}
        <div className={`flex ${justifyButton} mb-6`}>
          <button className="bg-[#96EDD9] rounded-full px-5 py-2 flex items-center gap-2 text-[#004D5A] font-bold shadow-md hover:bg-gray-100 transition duration-300 text-sm">
            {buttonText || "إنشاء وتدشين المتجر"} {buttonIcon || <FaRocket />}
          </button>
        </div>

        {/* العنوان والوصف */}
        <h2
          className={`text-4xl font-bold text-[#004D5A] mb-6 ${textAlignClass}`}
        >
          {title}
        </h2>
        <h2
          className={`text-lg font-bold text-gray-500 mb-6 ${textAlignClass}`}
        >
          {discription}
        </h2>

        {/* قائمة الخدمات */}
        <div className={`flex flex-col gap-4 ${textAlignClass}`}>
          {items.map((item, idx) => (
            <ServiceItem key={idx} {...item} textAlign={textAlignClass} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
