// components/organisms/FeaturesSection.tsx
import Heading from "../atoms/Heading";
import SolutionSection from "../molecules/SolutionSection";
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
  FaBox,
  FaMapMarkerAlt,
  FaGift,
  FaSlidersH,
  FaHandshake,
  FaShoppingCart,
} from "react-icons/fa";

export default function FeaturesSection() {
  return (
    <div className="rounded-xl bg-white mt-5">
      <div className="font-bold text-4xl p-8 rounded-lg my-8 text-[#004D5A]">
        <Heading text="تدعمك بكل خطوة من مشوارك التجاري TCM حلول " level={2} />
      </div>
      <SolutionSection
        title="انطلاقات سهلة حتى بانشغالك"
        discription="لا تحتاج لخبرة سابقة أو تفرغ تام لتبدأ تجارتك مع سلة"
        image="/images/image 1.png"
        buttonIcon={<FaStore />}
        buttonText="إنشاء وتدشين المتجر"
        items={[
          {
            icon: <FaPlug className="text-[#5CA9B5] text-2xl" />,
            title: "1000+ خدمة من مزوِّدي خدمات التاجر تقدِّم لك كل ما تحتاجه",
          },
          {
            icon: <FaRocket className="text-[#5CA9B5] text-2xl" />,
            title: "خطوات سهلة وسريعة لإنشاء متجرك.",
          },
          {
            icon: <FaUsers className="text-[#5CA9B5] text-2xl" />,
            title: "TMC تبادل التجارب والخبرات مع آلاف التجار في مجتمع تجار.",
          },
        ]}
      />
      <SolutionSection
        title="مدفوعات آمنة، لتجارة مستدامة، وثقة متينة"
        discription="لمتكامل للمدفوعات الإلكترونية لإدارة مدفوعات متجرك
وعملائك. TMC استفد من نظام"
        image="/images/image22.png"
        buttonIcon={<FaCreditCard />}
        buttonText="المدفوعات"
        items={[
          {
            icon: <FaExchangeAlt className="text-[#5CA9B5] text-2xl" />,
            title: "وسائل دفع متنوعة تلبي كافة احتياجات عملائك.",
          },
          {
            icon: <FaBolt className="text-[#5CA9B5] text-2xl" />,
            title: "تفعيل سريع لنظام المدفوعات خلال يوم واحد",
          },
          {
            icon: <FaCalendarCheck className="text-[#5CA9B5] text-2xl" />,
            title: "تحصيل المدفوعات يتم حسب الاتفاق",
          },
          {
            icon: <FaShieldAlt className="text-[#5CA9B5] text-2xl" />,
            title: "حماية عالية وآمان لكافة عملياتك",
          },
        ]}
      />
      <SolutionSection
        title="أسطول شحن متكامل في خدمة منتجاتك"
        discription="خيارات شحن متنوعة تربط متجرك بالعالم."
        image="/images/image3.png"
        buttonIcon={<FaTruck />}
        buttonText="الشحن والتوصيل"
        backgroundColor="bg-gray-100"
        items={[
          {
            icon: <FaPlug className="text-[#5CA9B5] text-2xl" />,
            title: "ربط سهل بدون عقود.",
          },
          {
            icon: <FaGlobe className="text-[#5CA9B5] text-2xl" />,
            title: "اربط متجرك بأكثر من 100 شركة شحن وتوصيل محليَّة ودوليَّة.",
          },
          {
            icon: <FaBox className="text-[#5CA9B5] text-2xl" />,
            title: "خدمات شحن ولوجستيات مخصًّصة لجميع أنواع المنتجات.",
          },
          {
            icon: <FaMapMarkerAlt className="text-[#5CA9B5] text-2xl" />,
            title: "شحن دولي ومحلي يغطي جميع المدن والقرى، والأماكن البعيدة.",
          },
        ]}
        reverse={true}
      />
      <SolutionSection
        title="حلول تسويقيَّة في مكان واحد"
        discription="استهدف المزيد من العملاء بحلول تسويقية مخصصة."
        image="/images/image4.png"
        buttonIcon={<FaBullhorn />}
        buttonText="ادوات التسويق"
        items={[
          {
            icon: <FaGift className="text-[#5CA9B5] text-2xl" />,
            title: "قدم لعملائك كوبونات خصم مميزة تشجعهم على إتمام الشراء.",
          },
          {
            icon: <FaSlidersH className="text-[#5CA9B5] text-2xl" />,
            title: "تحكم بكافة تفاصيل العروض والخصومات.",
          },
          {
            icon: <FaHandshake className="text-[#5CA9B5] text-2xl" />,
            title: "دعم التسويق بالعمولة لمتجرك.",
          },
          {
            icon: <FaShoppingCart className="text-[#5CA9B5] text-2xl" />,
            title: "استهداف دقيق للسلات المتروكة.",
          },
          {
            icon: <FaBullhorn className="text-[#5CA9B5] text-2xl" />,
            title: "إدارة الحملات الإعلانية على مختلف المنصات.",
          },
        ]}
      />
    </div>
  );
}
