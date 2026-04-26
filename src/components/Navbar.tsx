import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { brandAssets } from "@/lib/brand-assets";
const logo = brandAssets.logo;

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "#blog" },
  { label: "About", href: "#about" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Design Bakery" className="h-10" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isRoute = link.href.startsWith("/");
            const isActive = isRoute && location.pathname === link.href;
            const className = `text-sm font-medium transition-colors hover:text-accent ${isActive ? "text-accent" : "text-primary"}`;
            return isRoute ? (
              <Link key={link.label} to={link.href} className={className}>
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} className={className}>
                {link.label}
              </a>
            );
          })}
          <Button className="rounded-full px-6 font-semibold text-sm">
            Submit Design Request
          </Button>
        </div>

        <button
          className="md:hidden text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 pb-4 space-y-3">
          {navLinks.map((link) => {
            const isRoute = link.href.startsWith("/");
            const isActive = isRoute && location.pathname === link.href;
            const className = `block text-sm font-medium py-2 ${isActive ? "text-accent" : "text-primary"}`;
            return isRoute ? (
              <Link key={link.label} to={link.href} className={className} onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} className={className} onClick={() => setMobileOpen(false)}>
                {link.label}
              </a>
            );
          })}
          <Button className="rounded-full w-full font-semibold text-sm">
            Submit Design Request
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
