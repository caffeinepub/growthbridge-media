import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import BrandInquiryForm from "./components/BrandInquiryForm";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import InfluencerApplicationForm from "./components/InfluencerApplicationForm";
import Navbar from "./components/Navbar";
import PricingSection from "./components/PricingSection";
import ProfileSetupModal from "./components/ProfileSetupModal";
import ServicesSection from "./components/ServicesSection";
import StatsSection from "./components/StatsSection";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [showAdmin, setShowAdmin] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  const showProfileSetup =
    isAuthenticated &&
    !profileLoading &&
    profileFetched &&
    userProfile === null;

  // When user logs out, clear admin view
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAdmin(false);
      queryClient.clear();
    }
  }, [isAuthenticated, queryClient]);

  if (showAdmin) {
    return (
      <>
        <Navbar
          onAdminClick={() => setShowAdmin(true)}
          showAdminBack
          onBackToSite={() => setShowAdmin(false)}
        />
        <AdminDashboard />
        {showProfileSetup && <ProfileSetupModal />}
      </>
    );
  }

  return (
    <>
      <Navbar onAdminClick={() => setShowAdmin(true)} />
      <main>
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <ServicesSection />
        <PricingSection />
        <section id="influencer-form" className="scroll-mt-20">
          <InfluencerApplicationForm />
        </section>
        <section id="brand-form" className="scroll-mt-20">
          <BrandInquiryForm />
        </section>
      </main>
      <Footer />
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}
