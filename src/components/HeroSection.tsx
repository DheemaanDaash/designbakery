import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 px-4 md:px-8 bg-[#A7792E10]">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight tracking-tight">
          The Leading Graphic
          <br />
          Design Subscription
        </h1>
        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
          Scale your business and fix your design bottleneck with flat-rate,
          unlimited graphic design and custom illustrations solutions.
        </p>
        <a
          href="#demo"
          className="inline-flex items-center gap-2 mt-8 text-sm font-bold text-[hsl(195,100%,55%)] hover:text-[hsl(195,100%,45%)] transition-colors"
        >
          Watch Demo <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
