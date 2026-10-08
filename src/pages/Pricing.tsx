import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Pricing — Flat-Rate Unlimited Design Plans | Design Bakery"
        description="Compare Design Bakery's flat-rate design plans. Unlimited requests, unlimited revisions and fast turnarounds for every business size."
        path="/pricing"
      />
      <Navbar />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Pricing;
