import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const placeholders = Array.from({ length: 8 });

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-28 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl relative">
        {/* Hero text */}
        <div className="relative z-10 max-w-2xl">
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
            className="relative z-10 inline-flex items-center gap-2 mt-8 text-sm font-bold text-[hsl(195,100%,55%)] hover:text-[hsl(195,100%,45%)] transition-colors"
          >
            Watch Demo <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* Horizontal scrolling image row below the text */}
      <div
        aria-hidden="true"
        className="pointer-events-none mt-12 md:mt-16 w-full overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex gap-4 w-max animate-scroll-x motion-reduce:animate-none hover:[animation-play-state:paused]">
          {[...placeholders, ...placeholders].map((_, i) => (
            <div
              key={i}
              className="w-[160px] md:w-[200px] lg:w-[220px] shrink-0 rounded-2xl overflow-hidden border border-border/50 shadow-sm bg-gradient-to-br from-muted to-muted/40"
            >
              <AspectRatio ratio={9 / 16}>
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                </div>
              </AspectRatio>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
