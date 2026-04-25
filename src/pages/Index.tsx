import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import TrustBar from "@/components/landing/TrustBar";
import MissionSection from "@/components/landing/MissionSection";
import HowItWorks from "@/components/landing/HowItWorks";
import ValuesSection from "@/components/landing/ValuesSection";
import SellerCTA from "@/components/landing/SellerCTA";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  const { user, isAdmin, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to={isAdmin ? "/admin" : "/marche"} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main>
        <HeroSection />
        <TrustBar />
        <MissionSection />
        <HowItWorks />
        <ValuesSection />
        <SellerCTA />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
