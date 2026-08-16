import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { brandAssets } from "@/lib/brand-assets";

const colors = [
  { name: "Brand Blue", hex: "#003A8F", token: "--primary", usage: "Headlines, primary buttons, logo mark" },
  { name: "Brand Yellow", hex: "#EFB56A", token: "--accent", usage: "Accents, highlights, secondary CTAs" },
  { name: "Cream", hex: "#FDF8F1", token: "--background", usage: "Page background, light surfaces" },
  { name: "Soft Sand", hex: "#F5EDE3", token: "--secondary", usage: "Cards, section backgrounds" },
  { name: "Muted Text", hex: "#5C6A8F", token: "--muted-foreground", usage: "Body copy, supporting text" },
  { name: "Midnight", hex: "#08132B", token: "--dark surface", usage: "Dark mode background" },
];

const typography = [
  { label: "Display / H1", className: "text-4xl md:text-5xl font-bold text-primary", note: "DM Sans Bold · 48–60px" },
  { label: "Heading / H2", className: "text-3xl font-bold text-accent", note: "DM Sans Bold · 30–36px" },
  { label: "Subheading", className: "text-xl font-medium text-primary", note: "DM Sans Medium · 20px" },
  { label: "Body", className: "text-base text-muted-foreground", note: "DM Sans Regular · 16px" },
];

const BrandGuidelines = () => {
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
            Brand Guidelines &amp; Assets
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
            The Design Bakery Brand Kit
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Logos, colors, typography and usage rules — everything you need to represent
            Design Bakery consistently across every touchpoint.
          </p>
        </section>
      </div>

      {/* Logo */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-accent mb-8">Logo</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-secondary p-10 flex flex-col items-center gap-6">
              <img src={brandAssets.logo} alt="Design Bakery primary logo on light background" className="h-20 w-auto" />
              <div className="text-center">
                <p className="font-semibold text-primary">Primary logo</p>
                <p className="text-sm text-muted-foreground">Use on cream or white backgrounds.</p>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-primary p-10 flex flex-col items-center gap-6">
              <img
                src={brandAssets.logo}
                alt="Design Bakery logo on brand blue background"
                className="h-20 w-auto brightness-0 invert"
              />
              <div className="text-center">
                <p className="font-semibold text-primary-foreground">Reversed logo</p>
                <p className="text-sm text-primary-foreground/70">Use on brand blue or dark imagery.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border p-8 flex items-center gap-6">
              <img src={brandAssets.favicon} alt="Design Bakery favicon icon" className="h-16 w-16 rounded-lg" />
              <div>
                <p className="font-semibold text-primary">Icon / Favicon</p>
                <p className="text-sm text-muted-foreground">
                  The donut mark. Use standalone at small sizes (app icons, favicons, avatars).
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-border p-8">
              <p className="font-semibold text-primary mb-3">Usage rules</p>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                <li>Keep clear space equal to the height of the donut mark on all sides.</li>
                <li>Never stretch, rotate, recolor or add effects to the logo.</li>
                <li>Minimum height: 32px on screen, 12mm in print.</li>
                <li>Avoid placing the primary logo on busy or low-contrast imagery.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="rounded-full px-6">
              <a href={brandAssets.logo} download target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4" /> Download logo
              </a>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <a href={brandAssets.favicon} download target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4" /> Download icon
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Colors */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-[#A7792E10]">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-accent mb-8">Brand Colors</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {colors.map((c) => (
              <div key={c.name} className="rounded-xl border border-border overflow-hidden bg-background">
                <div className="h-28 w-full" style={{ backgroundColor: c.hex }} />
                <div className="p-5">
                  <p className="font-semibold text-primary">{c.name}</p>
                  <p className="text-sm font-mono text-muted-foreground mt-1">{c.hex.toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground mt-2">{c.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-accent mb-8">Typography</h2>
          <p className="text-muted-foreground mb-8">
            Design Bakery uses <span className="font-semibold text-primary">DM Sans</span> across
            all brand and product surfaces.
          </p>
          <div className="space-y-6">
            {typography.map((t) => (
              <div
                key={t.label}
                className="rounded-xl border border-border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <p className={t.className}>{t.label}</p>
                <span className="text-sm text-muted-foreground font-mono">{t.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Imagery */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-[#A7792E10]">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-accent mb-8">Work Samples</h2>
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

export default BrandGuidelines;
