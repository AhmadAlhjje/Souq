import HeroSection from "../components/molecules/HeroSection";
import Header from "../components/organisms/Header";
import Heading from "../components/atoms/Heading";
import ServicesSection from "../components/organisms/ServicesSection";
import StatisticsSection from "../components/organisms/StatisticsSection";
import Footer from "@/components/organisms/Footer";
import MainLayout from "../components/templates/MainLayout";
import SolutionSection from "@/components/molecules/SolutionSection";
import { FaRocket } from "react-icons/fa";
import FeaturesSection from "@/components/organisms/FeaturesSection";

export default function Home() {
  return (
    <>
      <MainLayout>
        <Header />
        <HeroSection />
        <div className=" mx-auto p-4   ">
          {/* Section 1: Title */}
          <div className="font-bold text-4xl p-8 rounded-lg my-8 text-[#004D5A]">
            <Heading text="أكبر منصة سورية للتجارة في الشرق الأوسط" level={2} />
          </div>
          <div className=" p-6 rounded-xl bg-[#96EDD9] ">
            {/* Section 2: Services */}
            <ServicesSection />
          </div>
          <div className="text-2xl  p-8 rounded-lg my-8 text-black">
            <Heading
              text="TMC أنشئ متجرك اليوم وانضم لآلاف الأفراد والمؤسسات والشركات الناجحة مع   "
              level={2}
            />
          </div>
          {/* Section 3: Statistics */}
          <StatisticsSection />

          {/* Section 4: Statistics */}
  
          <FeaturesSection />
        </div>
        <Footer />
      </MainLayout>
    </>
  );
}
