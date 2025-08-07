// components/organisms/FeaturesSection.tsx
import React from 'react';
import Heading from "../atoms/Heading";
import Text from "../atoms/Text";
import Badge from "../atoms/Badge";
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

// Feature Item Component مع تصغير الأيقونات
interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start space-x-4 space-x-reverse group">
      <div className="flex-1">
        <Text 
          text={title}
          className="text-[#004D5A] font-semibold text-base leading-tight mb-1" /* تقليل من text-lg وfont-semibold */
        />
        {description && (
          <Text 
            text={description}
            variant="caption"
            className="text-[#004D5A]/60 text-sm" /* تأكيد حجم النص الصغير */
          />
        )}
      </div>
      <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
    </div>
  );
}

// Icon Wrapper Component مصغر
interface IconWrapperProps {
  icon: React.ReactNode;
  gradient?: string;
}

function IconWrapper({ icon, gradient = "from-[#5CA9B5] to-[#4a9aa7]" }: IconWrapperProps) {
  return (
    <div className={`w-10 h-10 bg-gradient-to-br ml-4 ${gradient} rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300`}>
      {/* تصغير من w-12 h-12 إلى w-10 h-10 وmن rounded-2xl إلى rounded-xl وتغيير mr-4 إلى ml-4 */}
      <div className="text-white text-base text-right"> {/* تصغير من text-xl إلى text-base */}
        {icon}
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  // Solutions Data
  const solutions = [
    {
      id: 1,
      title: "انطلاقات سهلة حتى مع انشغالك",
      description: "لا تحتاج لخبرة سابقة أو تفرغ تام لتبدأ تجارتك معنا. واجهة بديهية وأدوات ذكية تجعل البداية أسهل مما تتوقع",
      image: "/images/image 1.png",
      buttonIcon: <FaStore className="text-sm" />, /* تصغير من text-lg إلى text-sm */
      buttonText: "إنشاء وتدشين المتجر",
      features: [
        {
          icon: <IconWrapper icon={<FaPlug />} />,
          title: "1000+ خدمة من مزوِّدي خدمات التاجر تقدِّم لك كل ما تحتاجه",
          description: "شبكة واسعة من الشركاء المعتمدين"
        },
        {
          icon: <IconWrapper icon={<FaRocket />} />,
          title: "خطوات سهلة وسريعة لإنشاء متجرك",
          description: "إعداد متجرك في دقائق معدودة"
        },
        {
          icon: <IconWrapper icon={<FaUsers />} />,
          title: "تبادل التجارب والخبرات مع آلاف التجار في مجتمع TMC",
          description: "شبكة دعم من التجار الناجحين"
        },
      ],
      background: "bg-white/80",
      reverse: false
    },
    {
      id: 2,
      title: "مدفوعات آمنة، لتجارة مستدامة، وثقة متينة",
      description: "استفد من نظام TMC المتكامل للمدفوعات الإلكترونية لإدارة مدفوعات متجرك وعملائك بأمان وسهولة تامة",
      image: "/images/image22.png",
      buttonIcon: <FaCreditCard className="text-sm" />,
      buttonText: "نظام المدفوعات",
      features: [
        {
          icon: <IconWrapper icon={<FaExchangeAlt />} gradient="from-emerald-500 to-emerald-600" />,
          title: "وسائل دفع متنوعة تلبي كافة احتياجات عملائك",
          description: "بطاقات ائتمان، محافظ رقمية، وحوالات بنكية"
        },
        {
          icon: <IconWrapper icon={<FaBolt />} gradient="from-emerald-500 to-emerald-600" />,
          title: "تفعيل سريع لنظام المدفوعات خلال يوم واحد",
          description: "بدء استقبال المدفوعات فوراً"
        },
        {
          icon: <IconWrapper icon={<FaCalendarCheck />} gradient="from-emerald-500 to-emerald-600" />,
          title: "تحصيل المدفوعات يتم حسب الاتفاق",
          description: "مرونة في جدولة استلام الأموال"
        },
        {
          icon: <IconWrapper icon={<FaShieldAlt />} gradient="from-emerald-500 to-emerald-600" />,
          title: "حماية عالية وأمان لكافة عملياتك",
          description: "تشفير متقدم وحماية من الاحتيال"
        },
      ],
      background: "bg-gradient-to-br from-[#96EDD9]/5 via-white to-[#96EDD9]/10",
      reverse: true
    },
    {
      id: 3,
      title: "أسطول شحن متكامل في خدمة منتجاتك",
      description: "خيارات شحن متنوعة تربط متجرك بالعالم، مع ضمان وصول منتجاتك بأمان وفي الوقت المحدد",
      image: "/images/image3.png",
      buttonIcon: <FaTruck className="text-sm" />,
      buttonText: "الشحن والتوصيل",
      features: [
        {
          icon: <IconWrapper icon={<FaPlug />} gradient="from-blue-500 to-blue-600" />,
          title: "ربط سهل بدون عقود معقدة",
          description: "تفعيل فوري لخدمات الشحن"
        },
        {
          icon: <IconWrapper icon={<FaGlobe />} gradient="from-blue-500 to-blue-600" />,
          title: "اربط متجرك بأكثر من 100 شركة شحن وتوصيل محليَّة ودوليَّة",
          description: "تغطية شاملة لجميع الوجهات"
        },
        {
          icon: <IconWrapper icon={<FaBox />} gradient="from-blue-500 to-blue-600" />,
          title: "خدمات شحن ولوجستيات مخصًّصة لجميع أنواع المنتجات",
          description: "حلول متخصصة لكل نوع منتج"
        },
        {
          icon: <IconWrapper icon={<FaMapMarkerAlt />} gradient="from-blue-500 to-blue-600" />,
          title: "شحن دولي ومحلي يغطي جميع المدن والقرى والأماكن البعيدة",
          description: "وصول لكل مكان في العالم"
        },
      ],
      background: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      reverse: false
    },
    {
      id: 4,
      title: "حلول تسويقيَّة في مكان واحد",
      description: "استهدف المزيد من العملاء بحلول تسويقية مخصصة ومتقدمة تضمن وصول منتجاتك للجمهور المناسب",
      image: "/images/image4.png",
      buttonIcon: <FaBullhorn className="text-sm" />,
      buttonText: "أدوات التسويق",
      features: [
        {
          icon: <IconWrapper icon={<FaGift />} gradient="from-purple-500 to-purple-600" />,
          title: "قدم لعملائك كوبونات خصم مميزة تشجعهم على إتمام الشراء",
          description: "نظام ذكي لإدارة العروض والخصومات"
        },
        {
          icon: <IconWrapper icon={<FaSlidersH />} gradient="from-purple-500 to-purple-600" />,
          title: "تحكم بكافة تفاصيل العروض والخصومات",
          description: "لوحة تحكم شاملة للحملات الترويجية"
        },
        {
          icon: <IconWrapper icon={<FaHandshake />} gradient="from-purple-500 to-purple-600" />,
          title: "دعم التسويق بالعمولة لمتجرك",
          description: "شبكة مسوقين تعمل لصالحك"
        },
        {
          icon: <IconWrapper icon={<FaShoppingCart />} gradient="from-purple-500 to-purple-600" />,
          title: "استهداف دقيق للسلات المتروكة",
          description: "استرداد العملاء المترددين بذكاء"
        },
        {
          icon: <IconWrapper icon={<FaBullhorn />} gradient="from-purple-500 to-purple-600" />,
          title: "إدارة الحملات الإعلانية على مختلف المنصات",
          description: "تسويق متكامل عبر جميع القنوات الرقمية"
        },
      ],
      background: "bg-white/90",
      reverse: true
    }
  ];

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="text-center mb-16">
        <Badge 
          text="🛠️ حلول متكاملة"
          variant="primary"
          className="mb-6"
        />
        <Heading 
          text="حلول TMC تدعمك بكل خطوة من مشوارك التجاري" 
          level={2}
          variant="section"
          className="text-3xl md:text-4xl font-bold text-[#004D5A] leading-tight mb-4" /* تقليل من text-4xl md:text-5xl */
        />
        <Text 
          text="منظومة متكاملة من الأدوات والخدمات التي تضمن نجاح تجارتك وتطويرها"
          variant="subtitle"
          className="text-[#004D5A]/70 text-base md:text-lg max-w-3xl mx-auto leading-relaxed" /* تقليل من text-lg md:text-xl */
        />
      </div>

      {/* Solutions Container */}
      <div className=" text-right space-y-16"> {/* تقليل المسافة من space-y-20 إلى space-y-16 */}
        {solutions.map((solution) => (
          <div key={solution.id} className="relative">
            {/* Background Effect */}
            <div className={`absolute inset-0 ${
              solution.id % 2 === 0 
                ? 'bg-gradient-to-l from-[#96EDD9]/20 to-transparent' 
                : 'bg-gradient-to-r from-[#004D5A]/5 to-transparent'
            } rounded-3xl blur-3xl`}></div>
            
            {/* Solution Card */}
            <div className={`relative ${solution.background} backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden`}>
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 p-6 lg:p-10 items-center"> {/* تقليل المسافات والpadding */}
                {/* Content Side */}
                <div className={`${solution.reverse ? 'lg:order-2' : ''} space-y-6`}> {/* تقليل من space-y-8 إلى space-y-6 */}
                  {/* Header */}
                  <div>
                    <Heading 
                      text={solution.title}
                      level={3}
                      className="text-xl lg:text-2xl font-bold text-[#004D5A] mb-3" /* تقليل الحجم */
                    />
                    <Text 
                      text={solution.description}
                      variant="subtitle"
                      className="text-[#004D5A]/70 leading-relaxed text-sm" /* تقليل حجم النص */
                    />
                  </div>

                  {/* Features List */}
                  <div className="space-y-4"> {/* تقليل من space-y-6 إلى space-y-4 */}
                    {solution.features.map((feature, index) => (
                      <FeatureItem
                        key={index}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                      />
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="pt-3"> {/* تقليل من pt-4 إلى pt-3 */}
                    <button className="inline-flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-[#004D5A] to-[#005965] hover:from-[#005965] hover:to-[#006670] text-white font-semibold py-3 px-5 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm">
                      {/* تقليل الpadding وحجم الخط */}
                      <span>{solution.buttonText}</span>
                      {solution.buttonIcon}
                    </button>
                  </div>
                </div>

                {/* Image Side */}
                <div className={`${solution.reverse ? 'lg:order-1' : ''}`}>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#004D5A]/10 to-[#96EDD9]/10 rounded-3xl transform rotate-2 group-hover:rotate-3 transition-transform duration-500"></div> {/* تقليل الزاوية */}
                    <div className="relative bg-white rounded-3xl p-4 shadow-xl transform group-hover:-rotate-0.5 transition-transform duration-500"> {/* تقليل الpadding والزاوية */}
                      <img 
                        src={solution.image} 
                        alt={solution.title}
                        className="w-full h-auto rounded-2xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Call to Action */}
      <div className="mt-16 text-center"> {/* تقليل من mt-20 إلى mt-16 */}
        <div className="bg-gradient-to-br from-[#004D5A] via-[#005965] to-[#006670] rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"> {/* تقليل الpadding */}
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#96EDD9]/10 rounded-full blur-3xl"></div> {/* تصغير العناصر الديكورية */}
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#96EDD9]/5 rounded-full blur-2xl"></div>
          
          <div className="relative">
            <Heading 
              text="جاهز لبدء رحلتك التجارية؟"
              level={3}
              className="text-xl md:text-2xl font-bold text-gray-50 mb-3" /* تقليل الحجم */
            />
            <Text 
              text="انضم إلى آلاف التجار الذين اختاروا TMC لتطوير أعمالهم وتحقيق النجاح"
              className="text-gray-50 text-base mb-6 max-w-2xl mx-auto" /* تقليل حجم النص */
            />
            <button className="bg-[#96EDD9] hover:bg-[#7dd3bf] text-[#004D5A] font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm">
              {/* تقليل الpadding وحجم الخط */}
              ابدأ مجاناً الآن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}