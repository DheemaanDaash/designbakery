import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, Users, Rocket, Heart } from "lucide-react";

const values = [
  {
    icon: Sparkles,
    title: "Creativity First",
    description: "Every pixel is crafted with intention. We turn briefs into bold, on-brand design.",
  },
  {
    icon: Rocket,
    title: "Speed Without Compromise",
    description: "Fast turnarounds powered by dedicated designers, not stock templates.",
  },
  {
    icon: Users,
    title: "True Partnership",
    description: "We become an extension of your team — unlimited requests, unlimited revisions.",
  },
  {
    icon: Heart,
    title: "Care In Every Detail",
    description: "From kickoff to final delivery, quality and communication stay a priority.",
  },
];

const team = [
  {
    name: "D. Dash",
    role: "Founder & Creative Director",
    bio: "Leads the studio's creative vision with 10+ years shaping brands across three continents.",
  },
  {
    name: "T. Dhar",
    role: "Head of Design",
    bio: "Turns strategy into scroll-stopping visuals for e-commerce and SaaS brands.",
  },
  {
    name: "M.H. Sakib",
    role: "Illustration Lead",
    bio: "Crafts custom illustrations that give brands a personality of their own.",
  },
  {
    name: "A. Das",
    role: "Finance Manager",
    bio: "Keeps the studio's operations and finances running smoothly behind every project.",
  },
];

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — matches home page treatment */}
      <div
        className="bg-[#A7792E10]"
        style={{
          clipPath:
            "polygon(0 0, 100% 0, 100% calc(100% - 40px), 50% 100%, 0 calc(100% - 40px))",
        }}
      >
        <section className="container mx-auto max-w-5xl text-center py-20 md:py-28 px-4 md:px-8">
          <p className="text-accent font-semibold tracking-wide uppercase text-sm mb-4">
            About Design Bakery
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
            Design That Rises With Your Brand
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're a subscription-first design studio helping ambitious brands ship
            beautiful, on-brand creative — faster, and without the traditional agency friction.
          </p>
        </section>
      </div>

      {/* Story */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-accent mb-6">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Design Bakery started in 2021 with one belief: growing brands deserve
              world-class design without the bloated retainers of traditional agencies.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              What began as a small studio in Dhaka has grown into a global team serving
              founders, marketers, and e-commerce brands across 20+ countries — all on a
              simple flat-rate subscription with unlimited requests and unlimited revisions.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we bake fresh graphics, illustrations, websites, and video every single
              day — and we're just getting started.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { k: "5+", v: "Years in business" },
              { k: "200+", v: "Brands served" },
              { k: "10k+", v: "Designs delivered" },
              { k: "20+", v: "Countries" },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary">{s.k}</div>
                <div className="text-sm text-muted-foreground mt-2">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-[#A7792E10]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-accent">
              What We Stand For
            </h2>
            <p className="mt-4 text-sm md:text-base text-muted-foreground">
              The values that shape every design we deliver.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center"
              >
                <div className="mx-auto w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-accent">
              Meet The Bakers
            </h2>
            <p className="mt-4 text-sm md:text-base text-muted-foreground">
              A small, senior team obsessed with your brand's success.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm"
              >
                <div className="aspect-square bg-gradient-to-br from-[#F0B666] to-[#5BC8F5] flex items-center justify-center">
                  <span className="text-5xl font-bold text-primary-foreground">
                    {initials(member.name)}
                  </span>
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold text-primary">{member.name}</h3>
                  <p className="text-accent text-sm font-semibold mt-1">{member.role}</p>
                  <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
