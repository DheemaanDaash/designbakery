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
};
