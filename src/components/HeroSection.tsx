import { ArrowRight } from "lucide-react";
import hero4 from "@/assets/hero-4.png.asset.json";
import hero5 from "@/assets/hero-5.png.asset.json";
import hero6 from "@/assets/hero-6.png.asset.json";
import hero7 from "@/assets/hero-7.png.asset.json";
import hero8 from "@/assets/hero-8.png.asset.json";
import hero9 from "@/assets/hero-9.png.asset.json";
import hero10 from "@/assets/hero-10.png.asset.json";

const showcase = [
  { src: hero4.url, alt: "Best Burger food delivery app UI design" },
  { src: hero5.url, alt: "Department of CSE hoodie apparel design" },
  { src: hero6.url, alt: "Vector portrait illustration in pink tones" },
  { src: hero7.url, alt: "Tea brand packaging design" },
  { src: hero8.url, alt: "Dental Pixel logo and brand guideline" },
  { src: hero9.url, alt: "Halloween sale social media campaign design" },
  { src: hero10.url, alt: "Special Burger restaurant promo design" },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-28 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-10 lg:gap-16 items-center">
          {/* Left column: Hero text */}
          <div className="relative z-10 order-1">
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

          {/* Right column: Horizontal infinite-scroll row (right → left) */}
          <div
            aria-hidden="true"
            className="order-2 pointer-events-none w-full h-[360px] md:h-[420px] lg:h-[480px] overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            }}
          >
            <div className="flex flex-row gap-4 h-full w-max animate-scroll-x motion-reduce:animate-none hover:[animation-play-state:paused]">
              {[...placeholders, ...placeholders].map((_, i) => (
                <div
                  key={i}
                  className="h-full shrink-0 w-[202px] md:w-[236px] lg:w-[270px] rounded-2xl overflow-hidden border border-border/50 shadow-sm bg-gradient-to-br from-muted to-muted/40 flex items-center justify-center"
                >
                  <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
