import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import EcommerceBanner from "@/components/EcommerceBanner";
import TrustedBy from "@/components/TrustedBy";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero — same beige clipped background as the home page */}
      <div
        className="bg-[#A7792E10]"
        style={{
          clipPath:
            "polygon(0 0, 100% 0, 100% calc(100% - 40px), 50% 100%, 0 calc(100% - 40px))",
        }}
      >
        <section className="py-20 md:py-32 pb-40 md:pb-56 px-4 md:px-8">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight tracking-tight">
              How can we help with your Graphic Needs!
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the best plan for your business and get ready to receive
              unbelievably creative designs.
            </p>
          </div>
        </section>
      </div>

      {/* Contact form — overlaps the hero by ~10% */}
      <section className="px-4 md:px-8">
        <div className="container mx-auto max-w-2xl relative z-10 -mt-24 md:-mt-32">
          <ContactForm />
        </div>
      </section>

      {/* E-Commerce Banner */}
      <section className="px-4 md:px-8 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <EcommerceBanner />
        </div>
      </section>

      {/* Trusted brands */}
      <TrustedBy />

      <Footer />
    </div>
  );
};

export default Contact;
