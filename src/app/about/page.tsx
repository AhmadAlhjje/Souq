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

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start space-x-4 space-x-reverse group">
      <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-[#004D5A] font-semibold text-base leading-tight mb-1">
          {title}
        </h4>
        {description && (
          <p className="text-[#004D5A]/60 text-sm">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

interface IconWrapperProps {
  icon: React.ReactNode;
  gradient?: string;
}

function IconWrapper({
  icon,
  gradient = "from-[#5CA9B5] to-[#4a9aa7]",
}: IconWrapperProps) {
  return (
    <div
      className={`w-10 h-10 bg-gradient-to-br ml-4 ${gradient} rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300`}
    >
      <div className="text-white text-base text-right">{icon}</div>
    </div>
  );
}

export default function About() {
  const solutions = [
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
          icon: (
            <IconWrapper
              icon={<FaExchangeAlt />}
              gradient="from-emerald-500 to-emerald-600"
            />
          ),
          title: "تقديم خيارات متقدمة للعملاء للتخصيص",
          description: "",
        },
        { 
          icon: (
            <IconWrapper
              icon={<FaBolt />}
              gradient="from-emerald-500 to-emerald-600"
            />
          ),
          title: "الاستجابة السريعة للطلبات والملاحظات من العملاء",
          description: "",
        },
        {
          icon: (
            <IconWrapper
              icon={<FaCalendarCheck />}
              gradient="from-emerald-500 to-emerald-600"
            />
          ),
          title: "التحديث المستمر لضمان أحدث التقنيات",
          description: "",
        },
        {
          icon: (
            <IconWrapper
              icon={<FaShieldAlt />}
              gradient="from-emerald-500 to-emerald-600"
            />
          ),
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
          icon: (
            <IconWrapper icon={<FaPlug />} gradient="from-blue-500 to-blue-600" />
          ),
          title: "تطوير الحلول التقنية المبتكرة",
          description: "",
        },
        {
          icon: (
            <IconWrapper icon={<FaGlobe />} gradient="from-blue-500 to-blue-600" />
          ),
          title: "خدمة السوق المحلي والعالمي",
          description: "",
        },
        {
          icon: (
            <IconWrapper icon={<FaBolt />} gradient="from-blue-500 to-blue-600" />
          ),
          title: "التركيز على الجودة والكفاءة",
          description: "",
        },
        {
          icon: (
            <IconWrapper
              icon={<FaShieldAlt />}
              gradient="from-blue-500 to-blue-600"
            />
          ),
          title: "ضمان الاستدامة في التطوير",
          description: "",
        },
      ],
      background: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      reverse: false,
    },
  ];

  return (
    <>
      <div className="mt-2 relative min-h-screen bg-gradient-to-br from-[#96EDD9] via-[#A8F0DC] to-[#B8F3E0] overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <div className="absolute top-32 right-1/3 w-40 h-40 bg-gradient-to-br from-[#96EDD9]/30 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-32 left-1/4 w-60 h-60 bg-gradient-to-tr from-[#004D5A]/20 to-transparent rounded-full blur-3xl"></div>
        </div>
        {/* Main Content Container - RTL Grid Layout */}
        <div className="min-h-screen flex items-center" dir="rtl">
          <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* Text Content - Right Side */}
              <div className="text-right space-y-8 relative z-10 order-1">
                
                {/* Main Heading */}
                <div className="space-y-6 animate-in slide-in-from-right duration-1000">
                  {/* Decorative Elements */}
                  <div className="flex items-center justify-end gap-4">
                    <div className="w-3 h-3 bg-[#96EDD9] rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Description Text */}
                <div className="space-y-6 animate-in slide-in-from-right duration-1000 delay-300">
                  <p className="text-xl sm:text-2xl lg:text-3xl text-[#003940] font-bold leading-relaxed">
                    شركة 
                    <span className="relative inline-block mx-2">
                      <span className="text-[#004D5A] font-black">TMC</span>
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#96EDD9] to-[#004D5A]"></div>
                    </span>
                    Technology Metro Center
                    <span className="block text-lg sm:text-xl lg:text-2xl text-[#004D5A]/80 font-medium mt-2">
                      هي شركة متخصصة في التقنية والتجارة الإلكترونية
                    </span>
                  </p>
                  
                  <p className="text-base sm:text-lg lg:text-xl text-[#004D5A]/70 leading-loose">
                    نوفر منصة متكاملة لبناء المتاجر الإلكترونية بسهولة وأمان، 
                    مع حلول تقنية متقدمة تشمل إدارة المحتوى الشامل والدفع الرقمي، 
                    بالإضافة إلى أدوات تسويقية ذكية تساعد على زيادة التفاعل والمبيعات
                  </p>
                </div>

                {/* Call to Action */}
                <div className="pt-6 animate-in slide-in-from-right duration-1000 delay-500">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <button className="group relative bg-gradient-to-l from-[#004D5A] via-[#005965] to-[#006670] hover:from-[#006670] hover:via-[#005965] hover:to-[#004D5A] text-white font-bold py-4 px-8 lg:px-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 text-base lg:text-lg border-2 border-transparent hover:border-[#96EDD9]/30">
                      <span className="relative z-10">ابدأ الآن مجاناً</span>
                      <div className="absolute inset-0 bg-gradient-to-l from-[#96EDD9]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                </div>

                {/* Enhanced Stats */}
                <div className="pt-2 border-t border-white/40 animate-in slide-in-from-right duration-1000 delay-700">
                  <div className="grid grid-cols-3 gap-6 lg:gap-8 text-center">
                    <div className="group space-y-3 p-3 lg:p-4 rounded-2xl hover:bg-white/20 transition-all duration-300">
                      <div className="text-2xl lg:text-3xl xl:text-4xl font-black text-[#004D5A] group-hover:scale-110 transition-transform duration-300">
                        +60K
                      </div>
                      <div className="text-xs lg:text-sm text-[#004D5A]/70 font-medium">
                        تاجر نشط
                      </div>
                    </div>
                    <div className="group space-y-3 p-3 lg:p-4 rounded-2xl hover:bg-white/20 transition-all duration-300">
                      <div className="text-2xl lg:text-3xl xl:text-4xl font-black text-[#004D5A] group-hover:scale-110 transition-transform duration-300">
                        24/7
                      </div>
                      <div className="text-xs lg:text-sm text-[#004D5A]/70 font-medium">
                        دعم تقني
                      </div>
                    </div>
                    <div className="group space-y-3 p-3 lg:p-4 rounded-2xl hover:bg-white/20 transition-all duration-300">
                      <div className="text-2xl lg:text-3xl xl:text-4xl font-black text-[#004D5A] group-hover:scale-110 transition-transform duration-300">
                        99%
                      </div>
                      <div className="text-xs lg:text-sm text-[#004D5A]/70 font-medium">
                        رضا العملاء
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Section - Left Side */}
              <div className="relative order-2 animate-in slide-in-from-left duration-1000 delay-200">
                <div className="relative group">
                  {/* Floating Background Elements */}
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#96EDD9]/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-[#004D5A]/20 rounded-full blur-lg animate-pulse delay-1000"></div>
                  
                  {/* Main Image Container */}
                  <div className="relative z-10 flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
                    <div className="relative transform group-hover:scale-105 transition-transform duration-700">
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#96EDD9]/40 to-[#004D5A]/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"></div>
                      
                      {/* Main Content Card */}
                      <div className="relative w-72 h-80 lg:w-80 lg:h-96 xl:w-96 xl:h-[420px] max-w-full rounded-3xl shadow-2xl bg-gradient-to-br from-[#96EDD9] via-[#5CA9B5] to-[#004D5A] p-1">
                        {/* Inner Card */}
                        <div className="w-full h-full bg-white/95 backdrop-blur-sm rounded-3xl p-6 lg:p-8 flex flex-col items-center justify-center relative overflow-hidden">
                          {/* Background Pattern */}
                          <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-4 right-4 w-12 h-12 border-2 border-[#004D5A] rounded-lg rotate-12"></div>
                            <div className="absolute bottom-6 left-6 w-8 h-8 border border-[#96EDD9] rounded-full"></div>
                            <div className="absolute top-1/2 left-4 w-6 h-6 bg-[#5CA9B5] rounded rotate-45"></div>
                          </div>
                          
                          {/* Main Icon */}
                          <div className="relative z-10 mb-6">
                            <div className="w-24 h-24 lg:w-28 lg:h-28 mx-auto bg-gradient-to-br from-[#004D5A] to-[#005965] rounded-2xl flex items-center justify-center shadow-xl transform group-hover:rotate-6 transition-transform duration-500">
                              <FaRocket className="text-3xl lg:text-4xl text-white" />
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="text-center relative z-10">
                            <h3 className="text-xl lg:text-2xl font-bold text-[#004D5A] mb-3">
                              التميز التقني
                            </h3>
                            <p className="text-sm lg:text-base text-[#004D5A]/70 mb-4 leading-relaxed">
                              نحول أفكارك إلى حلول رقمية متقدمة تساعدك في تحقيق أهدافك التجارية
                            </p>
                            
                            {/* Feature Icons */}
                            <div className="flex justify-center space-x-reverse space-x-4 mb-4">
                              <div className="w-8 h-8 bg-[#96EDD9]/20 rounded-lg flex items-center justify-center group-hover:bg-[#96EDD9]/40 transition-colors duration-300">
                                <FaPlug className="text-[#004D5A] text-sm" />
                              </div>
                              <div className="w-8 h-8 bg-[#96EDD9]/20 rounded-lg flex items-center justify-center group-hover:bg-[#96EDD9]/40 transition-colors duration-300">
                                <FaGlobe className="text-[#004D5A] text-sm" />
                              </div>
                              <div className="w-8 h-8 bg-[#96EDD9]/20 rounded-lg flex items-center justify-center group-hover:bg-[#96EDD9]/40 transition-colors duration-300">
                                <FaShieldAlt className="text-[#004D5A] text-sm" />
                              </div>
                            </div>
                            
                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 text-center">
                              <div className="p-2">
                                <div className="text-lg font-bold text-[#004D5A]">5+</div>
                                <div className="text-xs text-[#004D5A]/60">سنوات خبرة</div>
                              </div>
                              <div className="p-2">
                                <div className="text-lg font-bold text-[#004D5A]">100%</div>
                                <div className="text-xs text-[#004D5A]/60">جودة عالية</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
      </div>
    
      {/* About Content Sections */}
      <div className="relative bg-gradient-to-br from-[#96EDD9]/10 via-white to-[#004D5A]/5">
        <div className="container mx-auto px-6 py-16">
          {/* Solutions Container */}
          <div className="text-right space-y-16" dir="rtl">
            {solutions.map((solution) => (
              <div key={solution.id} className="relative">
                {/* Background Effect */}
                <div
                  className={`absolute inset-0 ${
                    solution.id === 1
                      ? "bg-gradient-to-l from-[#96EDD9]/20 to-transparent"
                      : solution.id === 2
                      ? "bg-gradient-to-br from-[#96EDD9]/15 via-white/40 to-[#96EDD9]/25"
                      : "bg-[#96EDD9]/30"
                  } rounded-3xl blur-3xl`}
                ></div>

                {/* Solution Card */}
                <div className="relative backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
                  <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 p-6 lg:p-10 items-center">
                    {/* Content Side */}
                    <div
                      className={`${
                        solution.reverse ? "lg:order-2" : ""
                      } space-y-6`}
                    >
                      {/* Header */}
                      <div>
                        <h3 className="text-xl lg:text-2xl font-bold text-[#004D5A] mb-3">
                          {solution.title}
                        </h3>
                        <p className="text-[#004D5A]/70 leading-relaxed text-sm">
                          {solution.description}
                        </p>
                      </div>
                      {/* Features List */}
                      <div className="space-y-4">
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
                      <div className="pt-3">
                        <button className="inline-flex items-center space-x-reverse space-x-2 bg-gradient-to-r from-[#004D5A] to-[#005965] hover:from-[#005965] hover:to-[#006670] text-white font-semibold py-3 px-5 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm">
                          <span>{solution.buttonText}</span>
                          {solution.buttonIcon}
                        </button>
                      </div>
                    </div>
                    
                    {/* Image Side - تم إصلاح هذا الجزء */}
                    <div className={`${solution.reverse ? "lg:order-1" : ""}`}>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#004D5A]/10 to-[#96EDD9]/10 rounded-3xl transform rotate-2 group-hover:rotate-3 transition-transform duration-500"></div>
                        <div className="relative bg-white rounded-3xl p-6 shadow-xl transform group-hover:-rotate-0.5 transition-transform duration-500">
                          {/* صورة حقيقية - تم تكبيرها */}
                          <div className="w-full h-64 md:h-72 lg:h-80 xl:h-96 rounded-2xl overflow-hidden relative mb-6">
                            <img 
                              src="/images/pexels-jill-wellington-1638660-257816.jpg" 
                              alt={solution.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {/* طبقة تراكب */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#004D5A]/20 to-[#96EDD9]/10 group-hover:opacity-75 transition-opacity duration-300"></div>
                            
                            {/* أيقونة صغيرة في الزاوية */}
                            <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                              {solution.id === 1 && <FaRocket className="text-xl text-[#004D5A]" />}
                              {solution.id === 2 && <FaBolt className="text-xl text-[#004D5A]" />}
                              {solution.id === 3 && <FaGlobe className="text-xl text-[#004D5A]" />}
                            </div>
                          </div>
                          
                          {/* النص والعناصر خارج الصورة - تم إصلاحها */}
                          <div className="px-2">
                            <h4 className="text-xl font-bold text-[#004D5A] mb-3">{solution.title}</h4>
                            <div className="flex space-x-reverse space-x-3 justify-center">
                              <div className="w-3 h-3 bg-[#96EDD9] rounded-full animate-pulse"></div>
                              <div className="w-3 h-3 bg-[#5CA9B5] rounded-full animate-pulse delay-200"></div>
                              <div className="w-3 h-3 bg-[#004D5A] rounded-full animate-pulse delay-400"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-[#004D5A] via-[#005965] to-[#006670] rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
              {/* Enhanced Decorative Background - تم تصغير الأحجام */}
              <div className="absolute top-0 right-0 w-24 h-12 bg-[#96EDD9]/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#96EDD9]/5 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/10 rounded-full"></div>
              <div className="absolute top-4 left-4 w-4 h-4 bg-[#96EDD9]/20 rounded rotate-45"></div>
              <div className="absolute bottom-4 right-4 w-5 h-5 border border-white/20 rounded-full"></div>
              
              <div className="relative text-center" dir="rtl">
                {/* Icon */}
                <div className="w-20 h-20 bg-[#96EDD9]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <FaRocket className="text-3xl text-[#96EDD9]" />
                </div>
                
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4">
                  هل أنت مستعد للبدء معنا؟
                </h3>
                <p className="text-white/90 text-base lg:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                  انضم إلى آلاف العملاء الذين يثقون في خدماتنا ويحققون النجاح معنا. 
                  دعنا نساعدك في تحويل أفكارك إلى واقع رقمي مميز
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button className="group bg-[#96EDD9] hover:bg-[#7dd3bf] text-[#004D5A] font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base relative overflow-hidden">
                    <span className="relative z-10 flex items-center space-x-reverse space-x-2">
                      <span>ابدأ رحلتك الآن</span>
                      <FaRocket className="text-sm" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  </button>
                  
                  <button className="group border-2 border-white/30 hover:border-[#96EDD9] text-white hover:text-[#004D5A] hover:bg-[#96EDD9] font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 text-base">
                    <span className="flex items-center space-x-reverse space-x-2">
                      <span>تواصل معنا</span>
                      <FaUsers className="text-sm" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
