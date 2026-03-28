import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Home", href: "#", active: true },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
  { label: "Blog", href: "#blog" },
  { label: "About", href: "#about" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-primary leading-none">
            <span className="block text-xs tracking-[0.25em] uppercase font-bold">Design</span>
            <span className="block text-lg font-bold -mt-1">Bakery</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                link.active ? "text-accent" : "text-primary"
              }`}
            >
              {link.label}
            </a>
          ))}
          <Button className="rounded-full px-6 font-semibold text-sm">
            Submit Design Request
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 pb-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`block text-sm font-medium py-2 ${
                link.active ? "text-accent" : "text-primary"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button className="rounded-full w-full font-semibold text-sm">
            Submit Design Request
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
