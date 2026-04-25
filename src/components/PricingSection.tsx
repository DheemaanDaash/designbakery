import EcommerceBanner from "./EcommerceBanner";

const pricingPlans = [
  {
    title: "Graphic Design",
    subtitle: "Logo | Banner",
    price: "5000",
    currency: "৳",
    period: "Monthly",
    description: "The perfect plug-in to help you scale your graphics quickly.",
    international: "$60/Month for International Payment.",
    popular: true,
    headerColor: "bg-[#F0B666]",
  },
  {
    title: "Website Design",
    subtitle: "Mobile | Website",
    price: "10800",
    currency: "৳",
    period: "Monthly",
    description:
      "Create or redesign your website's ui design into a trendy one with a dedicated designer.",
    international: "$130/Month for International Payment.",
    popular: false,
    headerColor: "bg-[#5BC8F5]",
  },
  {
    title: "Custom Illustrations",
    subtitle: "Portrait | Landscape | Icon",
    price: "8200",
    currency: "৳",
    period: "Monthly",
    description:
      "Original illustrated graphics created from scratch to meet your needs and illustration style.",
    international: "$100/Month for International Payment.",
    popular: false,
    headerColor: "bg-[#5BC8F5]",
  },
];

const PricingSection = () => {
  return (
    <section className="py-16 md:py-24 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-accent">
            Choose Your Baked Path
          </h2>
          <p className="mt-4 text-sm md:text-base text-muted-foreground">
            Unlimited requests | Unlimited revisions | No contract
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.title}
              className="relative bg-card rounded-2xl shadow-lg overflow-hidden border border-border"
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden z-10 pointer-events-none">
                  <div
                    className="absolute bg-primary text-primary-foreground text-[10px] font-bold tracking-wider text-center shadow-md"
                    style={{
                      width: "130px",
                      transform: "rotate(-45deg)",
                      top: "18px",
                      left: "-38px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                    }}
                  >
                    POPULAR
                  </div>
                </div>
              )}
              <div className={`${plan.headerColor} py-6 px-6 text-center`}>
                <h3 className="text-xl md:text-2xl font-bold text-primary">
                  {plan.title}
                </h3>
                <p className="text-primary/70 text-sm mt-1">{plan.subtitle}</p>
              </div>
              <div className="p-6 text-center">
                <div className="mb-4">
                  <span className="text-accent text-lg font-bold align-top">
                    {plan.currency}
                  </span>
                  <span className="text-5xl md:text-6xl font-bold text-primary">
                    {plan.price}
                  </span>
                </div>
                <p className="text-accent font-semibold text-sm mb-6">
                  {plan.period}
                </p>
                <p className="text-muted-foreground text-sm mb-8 px-2 min-h-[60px]">
                  {plan.description}
                </p>
                <a
                  href="#learn-more"
                  className="inline-block bg-primary text-primary-foreground font-bold text-sm px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors mb-6"
                >
                  Learn More
                </a>
                <p className="text-muted-foreground text-xs">
                  {plan.international}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* E-Commerce Banner */}
        <div className="mt-12">
          <EcommerceBanner />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
