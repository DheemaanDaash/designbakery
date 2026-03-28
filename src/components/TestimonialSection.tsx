import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote:
      "We have seen our social media footprint improve by 600% because we are able to create custom graphics for each post through Design Bakery.",
    name: "Andrew Spilsbury",
    title: "Global VP - Brand at Gallagher Bassett",
    company: "Gallagher Bassett",
    stat: "4,250+",
    statLabel: "Hours saved",
  },
  {
    quote:
      "Design Bakery has transformed how we approach creative projects. The quality and speed of delivery exceeded our expectations.",
    name: "Sarah Mitchell",
    title: "Marketing Director at TechVision",
    company: "TechVision",
    stat: "3,800+",
    statLabel: "Designs delivered",
  },
  {
    quote:
      "Working with Design Bakery has been a game-changer for our brand consistency across all platforms and channels.",
    name: "James Rodriguez",
    title: "Creative Lead at Nova Studios",
    company: "Nova Studios",
    stat: "2,100+",
    statLabel: "Projects completed",
  },
];

const TestimonialSection = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section className="py-16 md:py-24 bg-[#64CFFE]">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
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
              "{t.quote}"
            </blockquote>
            <p className="text-primary/80 text-base md:text-lg mb-8">
              {t.name}, {t.title}
            </p>

            <div className="flex flex-wrap items-center gap-6 md:gap-10">
              <span className="text-primary/60 font-semibold text-sm tracking-wider uppercase">
                {t.company}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-black text-[#C8FF00]">
                  {t.stat}
                </span>
                <span className="text-primary/70 text-sm">{t.statLabel}</span>
              </div>
              <button className="ml-auto bg-primary/80 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary transition-colors">
                Read case study
              </button>
            </div>
          </div>
        </div>

        {/* Navigation dots & arrows */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i === current ? "bg-primary" : "bg-white/50"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
