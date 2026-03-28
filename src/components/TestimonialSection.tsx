import { useState, useEffect } from "react";

const testimonials = [
  {
    quote:
      "We have seen our social media footprint improve by 600% because we are able to create custom graphics for each post through Design Bakery.",
    name: "Andrew Spilsbury",
    title: "Global VP - Brand at Gallagher Bassett",
    company: "Gallagher Bassett",
  },
  {
    quote:
      "Design Bakery has transformed how we approach creative projects. The quality and speed of delivery exceeded our expectations.",
    name: "Sarah Mitchell",
    title: "Marketing Director at TechVision",
    company: "TechVision",
  },
  {
    quote:
      "Working with Design Bakery has been a game-changer for our brand consistency across all platforms and channels.",
    name: "James Rodriguez",
    title: "Creative Lead at Nova Studios",
    company: "Nova Studios",
  },
];

const TestimonialSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[current];

  return (
    <section className="py-16 md:py-24 bg-[#64CFFE]">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 select-text">
          {/* Left - Avatar with accent shape */}
          <div className="relative flex-shrink-0">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#C8FF00] rounded-tl-[40px] rounded-br-[40px] rotate-[-15deg]" />
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-white/30 overflow-hidden relative z-10 border-4 border-white/40">
              <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-4xl">
                {t.name.charAt(0)}
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="flex-1">
            <blockquote className="text-xl md:text-2xl lg:text-3xl font-bold text-primary leading-snug mb-6">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <p className="text-primary/80 text-base md:text-lg mb-4">
              {t.name}, {t.title}
            </p>
            <span className="text-primary/60 font-semibold text-sm tracking-wider uppercase">
              {t.company}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
