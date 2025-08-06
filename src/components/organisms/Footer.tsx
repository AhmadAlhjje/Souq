// src/components/organisms/Footer.tsx
import React from "react";
import Text from "../atoms/Text";
import Icon from "../atoms/Icon";

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-10 py-5 px-5">
      <div className="flex flex-col md:flex-row justify-between max-w-7xl mx-auto gap-8">
        
        {/* قسم Instagram */}
        <div className="flex-1">
          <Text text="INSTAGRAM" className="text-xl font-bold mb-2" />
          <div className="w-full h-px bg-gray-600 mb-4"></div>
          <div className="flex flex-wrap gap-2 mt-3">
            {[...Array(4)].map((_, i) => (
              <img
                key={i}
                src="/placeholder.jpg"
                alt="Instagram Post"
                className="w-12 h-12 bg-gray-300 object-cover rounded"
              />
            ))}
          </div>
        </div>

        {/* قسم طرق الدفع المتاحة */}
        <div className="flex-1">
          <Text text="طرق الدفع المتاحة" className="text-xl font-bold mb-2" />
          <div className="w-full h-px bg-gray-600 mb-4"></div>
          <ul className="list-none p-0 mt-3 space-y-2">
            <li><Text text="دفع 1" className="text-lg"/></li>
            <li><Text text="دفع 2" className="text-lg"/></li>
            <li><Text text="دفع 4" className="text-lg"/></li>
            <li><Text text="دفع 3" className="text-lg"/></li>
          </ul>
        </div>

        {/* قسم من نحن */}
        <div className="flex-1">
          <Text text="من نحن" className="text-xl font-bold mb-2" />
          <div className="w-full h-px bg-gray-600 mb-4"></div>
          <ul className="list-none p-0 mt-3 space-y-2">
            <li><Text text="أشهر المتاجر" className="text-lg" /></li>
            <li><Text text="مقالاتنا" className="text-lg" /></li>
            <li><Text text="سياسة الخصوصية للمتاجر"  className="text-lg"/></li>
            <li><Text text="سياسات ملفات تعريف الارتباط" className="text-lg" /></li>
          </ul>
        </div>

        {/* قسم تواصل معنا */}
        <div className="flex-1">
          <Text text="تواصل معنا" className="text-xl font-bold mb-2" />
          <div className="w-full h-px bg-gray-600 mb-4"></div>
          <div className="mt-3 space-y-2">
            <Text text="موقع 1، شارع رقم 1" className="text-lg" />
            <Text text="39-055-12345+" className="text-lg" />
            <Text text="info@tmc.com" className="text-lg" />
          </div>
          <div className="flex ml-16 space-x-4 mt-6 rtl:space-x-reverse">
            <Icon name="facebook" className="w-6 h-6 hover:text-blue-500 transition text-lg" />
            <Icon name="twitter" className="w-6 h-6 hover:text-blue-400 transition text-lg" />
            <Icon name="linkedin" className="w-6 h-6 hover:text-blue-600 transition text-lg" />
            <Icon name="instagram" className="w-6 h-6 hover:text-pink-500 transition text-lg" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;