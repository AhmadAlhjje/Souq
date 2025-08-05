import MainLayout from '../components/templates/MainLayout';
import HeroSection from '../components/molecules/HeroSection';
import Header from '../components/organisms/Header';

export default function Home() {
  return (
 <>
  <MainLayout>  <Header />
      <HeroSection />
    </MainLayout>
 </>
 
  );
}
