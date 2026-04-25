import { ArrowRight } from "lucide-react";
import ecommerceIllustration from "@/assets/ecommerce-illustration.gif";

const EcommerceBanner = () => {
  return (
    <div className="bg-primary rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1">
        <p className="text-[#5BC8F5] font-bold text-xl mb-1">New!</p>
        <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
          E-Commerce Free 7 days
        </h3>
        <p className="text-primary-foreground/80 text-sm md:text-base mb-6 max-w-md">
          Transform your small business into great business with more customer
          engagement & acquisition.
        </p>
        <a
          href="/free-trial"
          className="inline-flex items-center gap-2 bg-[#5BC8F5] text-primary font-bold text-sm px-6 py-3 rounded-lg hover:bg-[#4AB8E5] transition-colors"
        >
          <ArrowRight size={16} /> Learn More
        </a>
      </div>
      <div className="flex-shrink-0">
        <img
          src={ecommerceIllustration}
          alt="E-Commerce illustration"
          className="w-48 md:w-64 h-auto"
          loading="lazy"
          width={512}
          height={512}
        />
      </div>
    </div>
  );
};

export default EcommerceBanner;
