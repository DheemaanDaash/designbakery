const logos = [
  { name: "Bengal Enterprise Inc.", color: "text-red-600" },
  { name: "Dental Pixel", color: "text-primary" },
  { name: "Parking Koi", color: "text-yellow-600" },
  { name: "Brain House", color: "text-sky-500" },
];

const TrustedBy = () => {
  return (
    <section className="py-16 md:py-20 px-4 md:px-8">
      <div className="container mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-bold text-primary italic mb-12">
          Trusted By Thousands of Businesses Worldwide
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center justify-center"
            >
              <span className={`text-lg md:text-xl font-bold ${logo.color} whitespace-nowrap`}>
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle wave divider */}
      <div className="mt-16 -mb-1">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z"
            fill="hsl(var(--secondary))"
          />
        </svg>
      </div>
    </section>
  );
};

export default TrustedBy;
