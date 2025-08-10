import React from 'react';
import ImageSlider from '../../components/molecules/ImageSlider';

interface LoginTemplateProps {
  children: React.ReactNode;
  showSlider?: boolean;
}

const LoginTemplate: React.FC<LoginTemplateProps> = ({ children, showSlider = false }) => {
  // بيانات الشرائح
  const slides = [
    {
      id: 1,
      image: '/images/image 1.png',
      title: 'أتي النظام على آخر تحديثات TMC',
      description: 'استفد من أحدث التقنيات والأدوات المتطورة لإدارة متجرك الإلكتروني بكفاءة عالية'
    },
    {
      id: 2,
      image: '/images/image2.png',
      title: 'إدارة شاملة لمتجرك',
      description: 'نظام متكامل يوفر لك جميع الأدوات اللازمة لإدارة المبيعات والمخزون والعملاء'
    },
    {
      id: 3,
      image: '/images/image3.png',
      title: 'تحليلات متقدمة',
      description: 'احصل على رؤى عميقة حول أداء متجرك من خلال التقارير والتحليلات المفصلة'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* نموذج تسجيل الدخول - على اليسار */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 order-2 lg:order-1">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-md">
          {children}
        </div>
      </div>

      {/* الصورة والمحتوى - على اليمين */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center relative overflow-hidden min-h-[200px] sm:min-h-[300px] lg:min-h-screen order-1 lg:order-2">
        <div className="text-center text-white p-4 sm:p-6 lg:p-8 w-full max-w-lg">
          
          {showSlider ? (
            // عرض الـ Dashboard عند showSlider = true
            <>
              {/* صورة Dashboard */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8 transform rotate-1 sm:rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-teal-400 rounded-full"></div>
                  <div className="text-right">
                    <h3 className="text-sm sm:text-lg font-bold text-gray-800">Dashboard</h3>
                    <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Lorem ipsum dolor sit amet</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                    <div className="text-teal-500 text-sm sm:text-xl font-bold">$1753</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                    <div className="w-full h-4 sm:h-8 bg-gray-200 rounded mt-1 sm:mt-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-500 rounded" style={{width: '65%'}}></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                    <div className="text-teal-500 text-xs sm:text-xl font-bold">1,503,765</div>
                    <div className="text-xs text-gray-500">Downloads</div>
                    <div className="w-full h-4 sm:h-8 bg-gray-200 rounded mt-1 sm:mt-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-500 rounded" style={{width: '80%'}}></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                    <div className="text-teal-500 text-xs sm:text-xl font-bold">257,135</div>
                    <div className="text-xs text-gray-500">Followers</div>
                    <div className="w-full h-4 sm:h-8 bg-gray-200 rounded mt-1 sm:mt-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-500 rounded" style={{width: '45%'}}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Revenue Data</h4>
                  <div className="flex items-end space-x-1 h-8 sm:h-16">
                    {[40, 65, 45, 80, 60, 90, 70, 85, 55, 75].map((height, index) => (
                      <div 
                        key={index}
                        className="bg-teal-400 rounded-t flex-1" 
                        style={{height: `${height}%`}}
                      ></div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 sm:gap-4">
                  <div className="flex-1 bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
                    <div className="w-8 h-8 sm:w-16 sm:h-16 bg-teal-400 rounded-full mx-auto mb-1 sm:mb-2 flex items-center justify-center">
                      <span className="text-white font-bold text-xs sm:text-lg">70%</span>
                    </div>
                    <div className="text-xs text-gray-500">Progress</div>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-600 leading-tight">
                      <div className="font-semibold mb-1">Ready by Now</div>
                      <div className="hidden sm:block">Sunt qui minim exercitation ullamco mollit adipiscing sit.</div>
                      <div className="hidden sm:block mt-1">Voluptate veniam officia elit ipsum.</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // عرض الـ Slider عند showSlider = false
            <ImageSlider slides={slides} />
          )}
          
          {/* عناصر زخرفية - تظهر فقط على الشاشات الكبيرة */}
          <div className="absolute top-10 right-10 w-10 h-10 sm:w-20 sm:h-20 bg-white bg-opacity-10 rounded-full hidden lg:block"></div>
          <div className="absolute bottom-20 left-10 w-8 h-8 sm:w-16 sm:h-16 bg-white bg-opacity-10 rounded-full hidden lg:block"></div>
          <div className="absolute top-1/2 right-5 w-4 h-4 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-full hidden lg:block"></div>
        </div>
      </div>


    </div>
  );
};

export default LoginTemplate;