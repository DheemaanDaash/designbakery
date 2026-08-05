// Public URLs for brand assets hosted in cloud storage.
// Centralized so we can swap the host in one place.
const CDN = "https://jzzzujvukgzlpweiwzhl.supabase.co/storage/v1/object/public/brand-assets";

export const brandAssets = {
  logo: `${CDN}/logo.png`,
  favicon: `${CDN}/favicon.png`,
  trusted: {
    bengal: `${CDN}/trusted/bengal-enterprise.png`,
    dentalPixel: `${CDN}/trusted/dental-pixel.png`,
    parkingKoi: `${CDN}/trusted/parking-koi.png`,
    brainHouse: `${CDN}/trusted/brain-house.png`,
  },
  hero: {
    hero4: `${CDN}/hero/hero-4.png`,
    hero5: `${CDN}/hero/hero-5.png`,
    hero6: `${CDN}/hero/hero-6.png`,
    hero7: `${CDN}/hero/hero-7.png`,
    hero8: `${CDN}/hero/hero-8.png`,
    hero9: `${CDN}/hero/hero-9.png`,
    hero10: `${CDN}/hero/hero-10.png`,
  },
};
