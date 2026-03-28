import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustedBy from "@/components/TrustedBy";
import PricingSection from "@/components/PricingSection";
import TestimonialSection from "@/components/TestimonialSection";
import CreativeSolutionSection from "@/components/CreativeSolutionSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div
        className="bg-[#A7792E10]"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 40px), 50% 100%, 0 calc(100% - 40px))' }}
      >
        <HeroSection />
        <TrustedBy />
      </div>
      <PricingSection />
      <TestimonialSection />
      <CreativeSolutionSection />
    </div>
  );
};

export default Index;
