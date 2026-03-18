export const ROOMS = {
  arch: {
    name: 'Architecture Studio',
    video: 'studio-bg.mp4',
    imgW: 1376,
    imgH: 768,
    spots: [
      { sx: 388, sy: 222, sw: 174, sh: 132, title: "The Architect's Own Home", sub: 'Architectural sketches & design process', video: 'videos/architects-office/architects-house.mp4' },
      { sx: 578, sy: 200, sw: 184, sh: 266, title: 'Dream House · Rendered Real', sub: 'Modern luxury residential design', video: 'videos/architects-office/dream-house-rendered-real.mp4' },
      { sx: 782, sy: 222, sw: 174, sh: 140, title: 'Luxury Mansion Walkthrough', sub: 'Luxury property walkthrough', video: 'videos/architects-office/luxury-mansion-walkthrough.mp4' },
      { sx: 393, sy: 386, sw: 152, sh: 110, title: 'Na-mu Lofts · Seattle', sub: 'Interior design & living spaces', video: 'videos/architects-office/namu-lofts-seattle.mp4' },
      { sx: 782, sy: 380, sw: 162, sh: 116, title: "Built for You · A Builder's Story", sub: 'Architectural sketch & concept', video: 'videos/architects-office/built-for-you-a-builders-sotry.mp4' },
      { sx: 1153, sy: 172, sw: 210, sh: 118, title: 'Alpine Retreat · Swiss Lodge', sub: 'Mountain chalet design', video: 'videos/architects-office/alphine-retreat-swiss-lodge.mp4' },
      { sx: 1150, sy: 310, sw: 214, sh: 122, title: 'Chateau · From Ground Up', sub: 'Historic chateau build process', video: 'videos/architects-office/chateau-construction.mp4' },
      { sx: 1146, sy: 492, sw: 218, sh: 196, title: 'Trevi · AI Reconstruction', sub: 'AI cinematic reconstruction', video: 'videos/architects-office/trevi-ai-reconstruction.mp4' }
    ]
  },
  web: {
    name: 'The Web Studio',
    video: '',
    imgW: 1920,
    imgH: 1080,
    spots: [
      { sx: 760, sy: 340, sw: 400, sh: 280, title: 'Coming Soon', sub: 'Web design projects launching shortly', video: '' }
    ]
  },
  brand: {
    name: 'The Brand Vault',
    video: 'videos/brand-vault/brand-bg.mp4',
    imgW: 1920,
    imgH: 1076,
    spots: [
      { sx: 88, sy: 150, sw: 255, sh: 310, title: 'Fashion Lookbook', sub: 'Editorial fashion campaign', video: 'videos/brand-vault/fashion-lookbook.mp4' },
      { sx: 428, sy: 150, sw: 240, sh: 310, title: 'Golf Course', sub: 'Luxury golf resort marketing', video: 'videos/brand-vault/golf-course.mp4' },
      { sx: 626, sy: 150, sw: 240, sh: 310, title: 'Vitality Spa', sub: 'Luxury wellness brand campaign', video: 'videos/brand-vault/vitality-spa.mp4' },
      { sx: 887, sy: 150, sw: 137, sh: 310, title: 'Dog Bakery', sub: 'Pet brand identity & marketing', video: 'videos/brand-vault/dog-bakery.mp4' },
      { sx: 1019, sy: 155, sw: 210, sh: 305, title: 'Skin Care', sub: 'Luxury skincare brand campaign', video: 'videos/brand-vault/skincare.mp4' }
    ]
  },
  imag: {
    name: 'The Imagination Lab',
    video: '',
    imgW: 1920,
    imgH: 1080,
    spots: [
      { sx: 760, sy: 340, sw: 400, sh: 280, title: 'Coming Soon', sub: 'AI creative imagery launching shortly', video: '' }
    ]
  }
};

export let currentRoom = null;
export let allHots = [];
export let activeIdx = -1;

export function setCurrentRoom(value) { currentRoom = value; }
export function setAllHots(value) { allHots = value; }
export function setActiveIdx(value) { activeIdx = value; }
