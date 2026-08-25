import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Gem, Sparkles, Truck, Star, Quote } from "lucide-react";
import heroBridal from "@/assets/hero-bridal.jpg";
import diamondEditorial from "@/assets/diamond-editorial.jpg";
import bridalBand from "@/assets/bridal-band.jpg";
import bespoke from "@/assets/bespoke.jpg";
import { PRODUCTS, CATEGORIES, WHATSAPP_LINK } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurelia Heritage — Timeless Jewellery Crafted for Every Occasion" },
      { name: "description", content: "Discover Aurelia Heritage: gold, diamond, silver, bridal and bespoke jewellery handcrafted in our Mumbai atelier since 1924." },
      { property: "og:title", content: "Aurelia Heritage — Timeless Luxury Jewellery" },
      { property: "og:description", content: "Handcrafted heritage jewellery since 1924." },
      { property: "og:image", content: heroBridal },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "JewelryStore",
        name: "Aurelia Heritage",
        description: "Handcrafted gold, diamond, silver and bridal jewellery since 1924.",
        image: heroBridal,
      }),
    }],
  }),
  component: HomePage,
});

const featured = PRODUCTS.slice(0, 4);
const bestSellers = PRODUCTS.slice(2, 6);
const newArrivals = PRODUCTS.slice(4, 8);

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[600px] overflow-hidden bg-charcoal">
        <img src={heroBridal} alt="Bride wearing intricate gold and ruby bridal choker" className="absolute inset-0 w-full h-full object-cover opacity-65" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-3 text-gold uppercase tracking-[0.4em] text-[10px] md:text-xs font-semibold animate-fade-up">
              <span className="w-8 h-px bg-gold" /> Heritage Atelier · Est. 1924
            </span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] text-ivory leading-[0.95] mt-6 animate-fade-up delay-100 text-balance">
              Timeless Jewellery <br />
              <span className="italic font-normal text-gold-soft">Crafted for Every Occasion</span>
            </h1>
            <p className="text-ivory/75 max-w-md mt-6 leading-relaxed animate-fade-up delay-200">
              From bridal heirlooms to everyday brilliance — every Aurelia piece is hand-finished by our master karigars in 22K gold, certified diamonds and ethically sourced stones.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-up delay-300">
              <Link to="/shop" className="group bg-gold text-charcoal px-9 py-4 text-[11px] uppercase tracking-[0.3em] font-bold shimmer hover:bg-ivory transition-colors inline-flex items-center justify-center gap-3">
                Shop Now <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/collections" className="border border-ivory/40 text-ivory px-9 py-4 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-ivory hover:text-charcoal transition-all inline-flex items-center justify-center">
                Explore Collections
              </Link>
            </div>
          </div>
        </div>

        {/* Hero counter strip */}
        <div className="absolute bottom-0 inset-x-0 bg-charcoal/60 backdrop-blur border-t border-gold/20">
          <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              ["100+", "Years of Craft"],
              ["50K+", "Brides Adorned"],
              ["BIS", "Hallmark Certified"],
              ["GIA", "Diamond Certified"],
            ].map(([n, l]) => (
              <div key={l as string}>
                <div className="font-display text-2xl text-gold">{n}</div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-ivory/60 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY SHOWCASE */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <SectionHeader eyebrow="The Atelier" title="Signature Categories" intro="Six distinct languages of luxury — each curated by our master designers." />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to="/shop"
              className="group relative aspect-[4/5] md:aspect-square overflow-hidden ring-1 ring-gold/10"
            >
              <img src={cat.image} alt={cat.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <div className={`absolute inset-0 transition-opacity ${cat.tone === "charcoal" ? "bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" : cat.tone === "maroon" ? "bg-gradient-to-t from-maroon/85 via-maroon/20 to-transparent" : "bg-gradient-to-t from-charcoal/70 via-transparent to-transparent"}`} />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                <h3 className="font-display text-xl md:text-2xl text-ivory leading-tight">{cat.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-ivory/70">{cat.count} pieces</span>
                  <span className="text-gold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"><ArrowRight className="size-4" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-beige/30 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            align="split"
            eyebrow="Curated"
            title="Featured Masterpieces"
            action={<Link to="/shop" className="text-[10px] uppercase tracking-[0.3em] font-bold border-b-2 border-gold pb-1 hover:text-maroon transition-colors">View All Pieces</Link>}
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* BRIDAL EDITORIAL BAND */}
      <section className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative min-h-[500px] lg:min-h-[700px]">
          <img src={bridalBand} alt="Bride hands with henna and gold bangles" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="bg-maroon text-ivory flex flex-col justify-center px-8 md:px-16 py-20">
          <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">The Bridal Edit · 2026</span>
          <h2 className="font-display text-4xl md:text-6xl mt-6 leading-[0.95] text-balance">
            Vows in Gold <br /><span className="italic">& Diamonds</span>
          </h2>
          <p className="text-ivory/70 max-w-md mt-6 leading-relaxed">
            Our bridal collections are an offering to the sacred union — every choker, every kamarband meticulously hand-crafted over 300 hours by our most senior karigars.
          </p>
          <div className="mt-10 flex flex-wrap gap-6">
            <Link to="/bridal" className="bg-gold text-charcoal px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-ivory transition-colors">View Bridal Lookbook</Link>
            <a href={WHATSAPP_LINK("Hello Aurelia, I'd like to book a bridal consultation.")} target="_blank" rel="noreferrer" className="border border-gold/50 text-gold px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gold hover:text-charcoal transition-all">Book Consultation</a>
          </div>
        </div>
      </section>

      {/* DIAMOND LUXURY SECTION */}
      <section className="py-24 px-6 bg-charcoal text-ivory">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">The Diamond House</span>
            <h2 className="font-display text-4xl md:text-5xl mt-4 leading-tight text-balance">
              Brilliance, <span className="italic text-gold-soft">distilled.</span>
            </h2>
            <p className="text-ivory/65 mt-6 leading-relaxed max-w-md">
              Every diamond at Aurelia is GIA certified, conflict-free, and personally inspected by our master gemologist. We trade only in the top 1% of the world's diamonds.
            </p>
            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-gold/20">
              {[["F+", "Colour Grade"], ["VVS", "Clarity Min."], ["3X", "Excellent Cut"]].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-3xl text-gold">{n}</div>
                  <div className="text-[9px] uppercase tracking-[0.25em] text-ivory/50 mt-1">{l}</div>
                </div>
              ))}
            </div>
            <Link to="/shop" className="mt-10 inline-flex items-center gap-3 bg-gold text-charcoal px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-ivory transition-colors">
              Explore Diamonds <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="order-1 lg:order-2 relative">
            <img src={diamondEditorial} alt="Solitaire diamond ring on velvet" loading="lazy" className="w-full aspect-[4/5] object-cover luxury-shadow" />
            <div className="absolute -bottom-6 -left-6 hidden md:block glass-card px-6 py-4 text-charcoal">
              <div className="text-[9px] uppercase tracking-[0.3em] text-maroon font-bold">Certified</div>
              <div className="font-display text-lg">GIA · IGI · HRD</div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <SectionHeader
          align="split"
          eyebrow="Just In"
          title="New Arrivals"
          action={<Link to="/shop" className="text-[10px] uppercase tracking-[0.3em] font-bold border-b-2 border-gold pb-1 hover:text-maroon transition-colors">Shop All New</Link>}
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-ivory py-24 px-6 border-y border-gold/15">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="The Aurelia Promise" title="Why Choose Us" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: Award, title: "Certified Purity", text: "Every gold piece BIS hallmarked. Every diamond GIA certified." },
              { icon: Gem, title: "Master Craftsmanship", text: "Hand-finished by karigars whose families have served us for generations." },
              { icon: Truck, title: "Insured Worldwide Shipping", text: "Discreet, fully insured logistics to over 80 countries." },
              { icon: Sparkles, title: "Lifetime Exchange", text: "Trade in your pieces at full gold value, for life." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center group">
                <div className="mx-auto size-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 grid place-items-center ring-1 ring-gold/30 group-hover:bg-gold group-hover:text-ivory transition-all">
                  <Icon className="size-6 text-maroon group-hover:text-ivory transition-colors" />
                </div>
                <h3 className="font-display text-xl text-maroon mt-6">{title}</h3>
                <p className="text-sm text-charcoal/60 mt-2 leading-relaxed max-w-[28ch] mx-auto">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <SectionHeader align="split" eyebrow="Loved by Clients" title="Best Selling Jewellery" action={<Link to="/shop" className="text-[10px] uppercase tracking-[0.3em] font-bold border-b-2 border-gold pb-1 hover:text-maroon transition-colors">Shop Bestsellers</Link>} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* BESPOKE / CUSTOM */}
      <section className="grid lg:grid-cols-2 items-center">
        <div className="px-8 md:px-16 py-20 bg-beige/40 order-2 lg:order-1">
          <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">The Bespoke Atelier</span>
          <h2 className="font-display text-4xl md:text-5xl text-maroon mt-4 leading-tight text-balance">
            Designed only <br /><span className="italic">for you.</span>
          </h2>
          <p className="text-charcoal/70 mt-6 leading-relaxed max-w-md">
            Sit with our designers. Choose your stone. Shape your story. From engagement rings to family heirlooms, our atelier crafts pieces that no one else in the world will ever wear.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-charcoal/75">
            {["One-on-one design consultation", "3D rendering before crafting", "60-90 day handcrafted timeline", "Lifetime certificate of authenticity"].map((x) => (
              <li key={x} className="flex items-start gap-3">
                <span className="size-1.5 rounded-full bg-gold mt-2 shrink-0" /> {x}
              </li>
            ))}
          </ul>
          <Link to="/custom" className="mt-10 inline-flex bg-maroon text-ivory px-9 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-charcoal transition-colors">Begin Your Commission</Link>
        </div>
        <div className="relative min-h-[400px] lg:min-h-[700px] order-1 lg:order-2">
          <img src={bespoke} alt="Jewellery designer sketching ring with gemstones" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 bg-maroon text-ivory">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Client Stories" title={<span className="text-ivory">Whispers from the Inner Circle</span>} />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Ananya Mehta", role: "Bridal Client, Mumbai", text: "Aurelia did not just make my bridal set — they made me feel like a queen on my most important day. Every detail was beyond perfection." },
              { name: "Priya & Rohan", role: "Engagement Commission", text: "Our solitaire is more than a ring. It's a story. The atelier team made the entire experience feel sacred." },
              { name: "Meera Iyer", role: "Heirloom Restoration", text: "They restored my grandmother's choker with such care. It now feels both ancient and new — exactly as she would have wanted." },
            ].map((t) => (
              <div key={t.name} className="bg-ivory/5 backdrop-blur ring-1 ring-gold/20 p-8">
                <Quote className="size-8 text-gold" />
                <p className="mt-6 text-sm leading-relaxed text-ivory/85 italic">"{t.text}"</p>
                <div className="mt-6 pt-6 border-t border-gold/20">
                  <div className="font-display text-lg text-gold-soft">{t.name}</div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-ivory/50 mt-1">{t.role}</div>
                </div>
                <div className="flex gap-0.5 mt-3 text-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} className="size-3 fill-current" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM GALLERY */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <SectionHeader eyebrow="@aureliaheritage" title="From Our Atelier" intro="Follow the craft, the muses, the moments that become heirlooms." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...PRODUCTS, ...PRODUCTS].slice(0, 8).map((p, i) => (
            <a key={`${p.id}-${i}`} href="#" className="group relative aspect-square overflow-hidden ring-1 ring-gold/10">
              <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-maroon/0 group-hover:bg-maroon/60 transition-colors grid place-items-center">
                <span className="text-ivory opacity-0 group-hover:opacity-100 font-display text-2xl">♡</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 px-6 bg-charcoal">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">Stay In Touch</span>
          <h2 className="font-display text-3xl md:text-5xl text-ivory mt-4 leading-tight text-balance">Join the Inner Circle</h2>
          <p className="text-ivory/55 mt-4 text-sm">Private previews of seasonal collections, atelier events, and high jewellery releases — delivered with discretion.</p>
          <form className="mt-10 flex border-b border-gold/30 pb-3" onSubmit={(e) => e.preventDefault()}>
            <input type="email" required placeholder="your@email.com" className="flex-1 bg-transparent text-ivory placeholder:text-ivory/30 outline-none text-sm" />
            <button className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold ml-4">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}
