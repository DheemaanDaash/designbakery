import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DesignRequestForm from "@/components/DesignRequestForm";

const DesignRequest = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

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
              New Design Request
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Request your imagination &amp; relax. We will execute your design!
            </p>
          </div>
        </section>
      </div>

      <section className="px-4 md:px-8 pb-16 md:pb-24">
        <div className="container mx-auto max-w-2xl relative z-10 -mt-24 md:-mt-32">
          <DesignRequestForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DesignRequest;
