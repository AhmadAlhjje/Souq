import MainLayout from '../components/templates/MainLayout';
import HeroSection from '../components/molecules/HeroSection';
import Header from '../components/organisms/Header';
import Heading from '../components/atoms/Heading';
import ServicesSection from '../components/organisms/ServicesSection';
import StatisticsSection from '../components/organisms/StatisticsSection';
import Button from '../components/atoms/Button';
import Footer from '@/components/organisms/Footer';
export default function Home() {
  return (
 <>
  <MainLayout>
      <Header />
      <HeroSection />
      <div className="container mx-auto p-4   ">
        {/* Section 1: Title */}
        <div className=" p-8 rounded-lg my-8 text-[#004D5A]" >
          <Heading text="أكبر منصة سورية للتجارة في الشرق الأوسط" level={2} />
        </div>
  <div className=' p-6 rounded-xl bg-[#96EDD9] '>

        {/* Section 2: Services */}
        <ServicesSection />

        {/* Section 3: Statistics */}
        <StatisticsSection />

        {/* Section 4: Call to Action */}
        <div className="mt-8 text-center">
          <Button
            text="انضم الآن"
            className="bg-[#004D5A] hover:bg-green-700 text-white font-bold py-3 px-6 ml-16 rounded-lg shadow-md"
          />
        </div>
  </div>
      </div>
      <Footer/>
    </MainLayout>
 </>
 
  );
}
