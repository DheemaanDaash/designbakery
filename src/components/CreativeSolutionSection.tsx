const features = [
  {
    label: "ANALYZE",
    labelColor: "text-[#E89B2D]",
    title: "Get a Dedicated Designer",
    highlight: "",
    description:
      "Our experts analyze your design requirements and connect you with a designer with relevant experience. You engage with a designer who knows your brand and works just for you.",
    align: "left" as const,
  },
  {
    label: "SATISFIED",
    labelColor: "text-[#64CFFE]",
    title: "We Keep Designing Until You are Satisfied",
    highlight: "",
    description:
      "We know that some tweaks and revisions are inevitable. With Design Bakery, you get unlimited revisions until the design looks and feels perfect to you. Convey your requests directly to the designer and experience working with top-class graphic design agency!",
    align: "right" as const,
  },
  {
    label: "ENGAGEMENT",
    labelColor: "text-[#E89B2D]",
    title: "Creative Deliverables in",
    highlight: "Days, Not Weeks.",
    description: "",
    bullets: [
      "Get same-day turnarounds with Pro",
      "Get 1-2 day turnarounds with Scale",
    ],
    cta: "See Plans →",
    align: "left" as const,
  },
  {
    label: "ACCESSIBILITY",
    labelColor: "text-[#64CFFE]",
    title: "Faster and Hassle-Free Communication",
    highlight: "",
    description:
      "Our portal allows uninterrupted communication with your dedicated designers. You can now request new designs, ask for revisions, and stay in touch with designers through an intuitive and engaging portal. Let your on-demand graphic designs rolling with Design Bakery!",
    align: "right" as const,
  },
];

const CreativeSolutionSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            The Ultimate Creative Solution
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Design Bakery makes possible faster design delivery, high-end innovation and creativity, and undivided attention to your project. We know what it takes to create designs that result in higher audience engagement and better reach. Our veteran graphic designers will blow you away with their creativity. You have the best graphic design services company at your disposal!
          </p>
        </div>

        {/* Features */}
        <div className="space-y-20 md:space-y-28">
          {features.map((f, i) => (
            <div
              key={i}
              className={`flex flex-col md:flex-row items-start gap-8 md:gap-16 ${
                f.align === "right" ? "md:justify-end" : ""
              }`}
            >
              <div
                className={`max-w-lg ${
                  f.align === "right" ? "md:ml-auto" : ""
                }`}
              >
                <span
                  className={`text-xs font-bold tracking-widest uppercase ${f.labelColor} mb-2 block`}
                >
                  {f.label}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4 leading-tight">
                  {f.title}
                  {f.highlight && (
                    <>
                      <br />
                      <span className="text-secondary">{f.highlight}</span>
                    </>
                  )}
                </h3>
                {f.description && (
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {f.description}
                  </p>
                )}
                {f.bullets && (
                  <ul className="mt-3 space-y-2">
                    {f.bullets.map((b, j) => (
                      <li
                        key={j}
                        className="text-muted-foreground text-base flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {f.cta && (
                  <a
                    href="#pricing"
                    className="inline-block mt-4 text-secondary font-semibold hover:underline"
                  >
                    {f.cta}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CreativeSolutionSection;
