import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { brandAssets } from "@/lib/brand-assets";

const OurWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div
        className="bg-[#A7792E10]"
        style={{
          clipPath:
            "polygon(0 0, 100% 0, 100% calc(100% - 40px), 50% 100%, 0 calc(100% - 40px))",
        }}
      >
        <section className="container mx-auto max-w-5xl text-center py-20 md:py-28 px-4 md:px-8">
          <p className="text-accent font-semibold tracking-wide uppercase text-sm mb-4">
            Portfolio
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
            Our Works
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A selection of designs, campaigns and brand work created by the Design Bakery team.
          </p>
        </section>
      </div>

      {/* Work Samples */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(brandAssets.hero).map(([key, src]) => (
              <img
                key={key}
                src={src as string}
                alt={`Design Bakery portfolio sample ${key}`}
                loading="lazy"
                className="w-full aspect-[9/16] object-cover rounded-xl border border-border"
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OurWorks;
