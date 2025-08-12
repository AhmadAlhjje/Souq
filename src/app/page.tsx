import React from "react";
import MainLayout from "../components/templates/MainLayout";
import HeroSection from "../components/molecules/HeroSection";
import HeroTitleSection from "../components/organisms/HeroTitleSection";
import ServicesSection from "../components/organisms/ServicesSection";
import JoinUsSection from "../components/organisms/JoinUsSection";
import BusinessLaunchSection from "../components/organisms/BusinessLaunchSection";
import FeaturesSection from "../components/organisms/FeaturesSection";
import CustomerSatisfactionSection from "../components/organisms/CustomerSatisfactionSection";

export default function Home() {
  return (

    <>
    <MainLayout>
      <HeroSection />
      <HeroTitleSection />
      <ServicesSection />
      <JoinUsSection />
      <BusinessLaunchSection />
      <FeaturesSection />
      <CustomerSatisfactionSection />
    </MainLayout>
      </>
  );
}