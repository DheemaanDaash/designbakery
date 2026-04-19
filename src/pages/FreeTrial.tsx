import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FreeTrialForm from "@/components/FreeTrialForm";
import { LayoutTemplate, Video } from "lucide-react";

const FreeTrial = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-primary py-20 md:py-28 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-accent font-bold text-sm md:text-base tracking-wider uppercase mb-4">
            Try Design Bakery's 14 Days E-Commerce For Free
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight tracking-tight mb-4">
            Your Business Need Graphic Design
          </h1>
          <p className="text-base md:text-lg text-primary-foreground font-normal">
            Get started with a free trial.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-12">
            With your 7-day team trial, you can
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-16 mb-12 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-primary flex items-center justify-center mb-5">
                <LayoutTemplate className="text-primary-foreground" size={44} />
              </div>
              <p className="text-lg md:text-xl font-semibold text-primary">
                3 Template Design
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-primary flex items-center justify-center mb-5">
                <Video className="text-primary-foreground" size={44} />
              </div>
              <p className="text-lg md:text-xl font-semibold text-primary">
                1 Marketing Video
              </p>
            </div>
          </div>

          <a
            href="#signup-form"
            className="inline-block bg-primary text-primary-foreground font-bold text-sm md:text-base px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Start A Free Trial
          </a>
        </div>
      </section>

      {/* Signup Form */}
      <section id="signup-form" className="pb-20 md:pb-28 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl">
          <FreeTrialForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FreeTrial;
