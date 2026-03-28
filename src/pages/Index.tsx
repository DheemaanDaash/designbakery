import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustedBy from "@/components/TrustedBy";

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
    </div>
  );
};

export default Index;
