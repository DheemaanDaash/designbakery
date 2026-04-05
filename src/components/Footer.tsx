import { Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-background pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Logo & Social */}
          <div>
            <img src={logo} alt="Design Bakery" className="h-20 mb-6" />
            <div className="flex gap-3">
              {[
                { name: "facebook", url: "https://www.facebook.com/DesignBakeryBD" },
                { name: "instagram", url: "https://www.instagram.com/designbakerybd/" },
                { name: "linkedin", url: "https://www.linkedin.com/company/designbakerybd/" },
                { name: "youtube", url: "https://www.youtube.com/channel/UCrdIFv5rUDp6lpQwQc4ntjg" },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={s.name}
                >
                  <SocialIcon name={s.name} />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-primary mb-4">Company</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="/pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-primary mb-4">Resources</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Design Samples</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-primary mb-4">Contact Info</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:+8801858638829" className="hover:text-primary transition-colors">Call Us</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:dhiman@designbakerybd.com" className="hover:text-primary transition-colors">Email Us</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-6 text-center space-y-3">
          <p className="text-muted-foreground text-sm">
            © 2021-2026 Design Bakery. All Rights Reserved.
          </p>
          <div className="flex justify-center gap-2 text-sm">
            <a href="#" className="text-primary hover:underline">Terms & Conditions</a>
            <span className="text-muted-foreground">|</span>
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ name }: { name: string }) => {
  const icons: Record<string, JSX.Element> = {
    facebook: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>,
    instagram: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" /></svg>,
    linkedin: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" /></svg>,
    youtube: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" /><path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" fill="white" /></svg>,
  };
  return icons[name] || null;
};

export default Footer;
