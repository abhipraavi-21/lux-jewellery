import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";
import catGold from "@/assets/cat-gold.jpg";
import catDiamond from "@/assets/cat-diamond.jpg";
import catSilver from "@/assets/cat-silver.jpg";
import catBridal from "@/assets/cat-bridal.jpg";
import catTraditional from "@/assets/cat-traditional.jpg";
import catArtificial from "@/assets/cat-artificial.jpg";

export type Product = {
  id: string;
  name: string;
  category: string;
  collection: string;
  material: string;
  purity: string;
  occasion: string;
  price: number;
  mrp: number;
  rating: number;
  image: string;
  description: string;
  weight: string;
  stone: string;
  badge?: string;
};

export const PRODUCTS: Product[] = [
  { id: "ethereal-rose-studs", name: "Ethereal Rose Studs", category: "Diamond Earrings", collection: "New Arrivals", material: "Rose Gold", purity: "18K", occasion: "Daily Wear", price: 1240, mrp: 1550, rating: 4.9, image: p1, description: "Hand-set brilliant cut diamonds in our signature rose gold setting — a modern heirloom for everyday luxury.", weight: "2.4 g", stone: "VVS Diamond", badge: "15% OFF" },
  { id: "moonlight-chain", name: "Moonlight Silver Chain", category: "Silver Bracelets", collection: "Office Wear Collection", material: "Sterling Silver", purity: "925", occasion: "Office Wear", price: 450, mrp: 540, rating: 4.7, image: p2, description: "A whisper-thin sterling chain finished with a single moonstone — feather light, all-day comfort.", weight: "3.1 g", stone: "Moonstone" },
  { id: "princess-solitaire", name: "Princess Cut Solitaire", category: "Diamond Rings", collection: "Luxury Collection", material: "Platinum", purity: "950", occasion: "Engagement", price: 4900, mrp: 5400, rating: 5.0, image: p3, description: "A 1.20ct princess cut solitaire on a tapered platinum band, GIA certified for the most precious moments.", weight: "4.6 g", stone: "1.20ct Princess Diamond", badge: "Bestseller" },
  { id: "goddess-lakshmi-choker", name: "Goddess Lakshmi Choker", category: "Gold Necklaces", collection: "Wedding Collection", material: "22K Gold", purity: "916", occasion: "Bridal", price: 2100, mrp: 2400, rating: 4.9, image: p4, description: "Inspired by South Indian temple artistry — every motif hand-engraved by our master karigars.", weight: "42.8 g", stone: "Uncut Ruby" },
  { id: "sacred-mangalsutra", name: "Sacred Black Bead Mangalsutra", category: "Gold Mangalsutra", collection: "Wedding Collection", material: "18K Gold", purity: "750", occasion: "Bridal", price: 880, mrp: 980, rating: 4.8, image: p5, description: "A delicate mangalsutra with diamond floret pendant — sacred symbolism in modern silhouette.", weight: "8.2 g", stone: "Diamond Cluster" },
  { id: "emerald-chandbalis", name: "Mughal Emerald Chandbalis", category: "Traditional Earrings", collection: "Festive Collection", material: "22K Gold", purity: "916", occasion: "Festive", price: 3200, mrp: 3800, rating: 4.9, image: p6, description: "Polki and Zambian emerald chandbali earrings — heritage craftsmanship reimagined for the modern muse.", weight: "18.6 g", stone: "Emerald & Polki", badge: "Limited" },
  { id: "regal-bangle-stack", name: "Regal Engraved Bangle Stack", category: "Gold Bangles", collection: "Best Sellers", material: "22K Gold", purity: "916", occasion: "Daily Wear", price: 5600, mrp: 6100, rating: 4.8, image: p7, description: "A set of six engraved gold bangles — the daily armour of the modern Indian woman.", weight: "68.0 g", stone: "—" },
  { id: "blush-tennis-bracelet", name: "Blush Tennis Bracelet", category: "Diamond Bracelets", collection: "Gift Collection", material: "Rose Gold", purity: "18K", occasion: "Anniversary", price: 1980, mrp: 2300, rating: 4.9, image: p8, description: "A continuous line of round brilliants in warm rose gold — the perfect anniversary gesture.", weight: "5.4 g", stone: "Brilliant Diamonds", badge: "10% OFF" },
];

export const CATEGORIES = [
  { slug: "gold", name: "Gold Jewellery", image: catGold, count: 148, tone: "ivory" },
  { slug: "diamond", name: "Diamond Jewellery", image: catDiamond, count: 92, tone: "charcoal" },
  { slug: "silver", name: "Silver Jewellery", image: catSilver, count: 64, tone: "ivory" },
  { slug: "bridal", name: "Bridal Jewellery", image: catBridal, count: 38, tone: "maroon" },
  { slug: "traditional", name: "Traditional & Temple", image: catTraditional, count: 56, tone: "charcoal" },
  { slug: "artificial", name: "Artificial & Daily Wear", image: catArtificial, count: 112, tone: "ivory" },
];

export const NAV = {
  categories: [
    "Gold Jewellery", "Diamond Jewellery", "Silver Jewellery",
    "Bridal Jewellery", "Traditional Jewellery", "Temple Jewellery",
    "Antique Jewellery", "Artificial Jewellery", "Daily Wear Jewellery",
    "Kids Jewellery", "Men's Jewellery", "Customized Jewellery",
  ],
  collections: [
    "New Arrivals", "Best Sellers", "Wedding Collection",
    "Festive Collection", "Luxury Collection", "Office Wear Collection", "Gift Collection",
  ],
};

export const WHATSAPP_NUMBER = "919999999999";
export const WHATSAPP_LINK = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
