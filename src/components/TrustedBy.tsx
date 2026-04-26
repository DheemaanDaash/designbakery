import { brandAssets } from "@/lib/brand-assets";

const logos = [
  { name: "Bengal Enterprise Inc.", src: brandAssets.trusted.bengal },
  { name: "Dental Pixel", src: brandAssets.trusted.dentalPixel },
  { name: "Parking Koi", src: brandAssets.trusted.parkingKoi },
  { name: "Brain House", src: brandAssets.trusted.brainHouse },
];

const TrustedBy = () => {
  return (
    <section className="bg-[#A7792E10] py-16 md:py-20 pb-24 md:pb-28 px-4 md:px-8">
      <div className="container mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-bold text-primary mb-12">
          Trusted By Thousands of Businesses Worldwide
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {logos.map((logo) => (
            <div key={logo.name} className="flex items-center justify-center">
              <img src={logo.src} alt={logo.name} className="h-12 md:h-16 w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default TrustedBy;
