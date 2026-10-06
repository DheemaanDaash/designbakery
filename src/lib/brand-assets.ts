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
  team: {
    dDash: `${CDN}/team/D._Dash_-_Founder_CEO_-_Design_Bakery.png`,
    tDhar: `${CDN}/team/T._Dhar_-_COO_Head_of_Design_-_Design_Bakery.jpeg`,
    mHasan: `${CDN}/team/Mehdi_Hasan_-_Illustration_Lead_-_Design_Bakery.jpeg`,
    aDas: `${CDN}/team/Amit_Das_-_Finance_-_Design_Bakery.jpeg`,
    shadheenDash: `${CDN}/team/Shadheen_Dash_-_Co-founder_CTO_-_Design_Bakery.png`,
    swapnilBhowmik: `${CDN}/team/Swapnil_Bhowmik_-_Backend_Developer-Design_Bakery.png`,
  },
};
