import bengalLogo from "@/assets/bengal-enterprise.png";
import dentalPixelLogo from "@/assets/dental-pixel.png";
import parkingKoiLogo from "@/assets/parking-koi.png";
import brainHouseLogo from "@/assets/brain-house.png";

const logos = [
  { name: "Bengal Enterprise Inc.", src: bengalLogo },
  { name: "Dental Pixel", src: dentalPixelLogo },
  { name: "Parking Koi", src: parkingKoiLogo },
  { name: "Brain House", src: brainHouseLogo },
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
