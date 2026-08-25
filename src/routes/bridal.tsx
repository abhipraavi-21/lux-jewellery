import { createFileRoute, Link } from "@tanstack/react-router";
import heroBridal from "@/assets/hero-bridal.jpg";
import bridalBand from "@/assets/bridal-band.jpg";
import { PRODUCTS, WHATSAPP_LINK } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/bridal")({
  head: () => ({
    meta: [
      { title: "Bridal Jewellery — Aurelia Heritage" },
      { name: "description", content: "Aurelia's bridal collections — chokers, kamarbands, maang tikkas and complete bridal sets, hand-crafted over 300 hours each." },
      { property: "og:title", content: "The Bridal Edit — Aurelia Heritage" },
      { property: "og:image", content: heroBridal },
      { property: "og:url", content: "/bridal" },
    ],
    links: [{ rel: "canonical", href: "/bridal" }],
  }),
  component: BridalPage,
});

function BridalPage() {
  const bridalProducts = PRODUCTS.filter((p) => p.occasion === "Bridal" || p.collection === "Wedding Collection");
  return (
    <>
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-charcoal">
        <img src={heroBridal} alt="Bride wearing bridal jewellery" className="absolute inset-0 w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-charcoal/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-end max-w-7xl mx-auto px-6 pb-16">
          <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">The Bridal Atelier</span>
          <h1 className="font-display text-5xl md:text-7xl text-ivory mt-4 leading-[0.95] max-w-2xl text-balance">Vows in Gold <span className="italic">& Diamonds</span></h1>
        </div>
      </section>

      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <p className="text-lg md:text-xl text-charcoal/75 leading-relaxed text-pretty">
          Our bridal collections are sacred works — every choker, every kamarband meticulously hand-crafted over 300 hours by our most senior karigars. From Maharashtrian nath to South Indian temple sets, we offer the most extensive bridal heritage atelier in the country.
        </p>
        <a href={WHATSAPP_LINK("Hello, I'd like to book a bridal consultation.")} target="_blank" rel="noreferrer" className="mt-10 inline-flex bg-maroon text-ivory px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-charcoal transition-colors">Book Bridal Consultation</a>
      </section>

      <section className="px-6 max-w-7xl mx-auto pb-20">
        <h2 className="font-display text-3xl md:text-4xl text-maroon mb-10 text-center">The Bridal Sub-Collections</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-center">
          {["Bridal Necklace Sets", "Bridal Chokers", "Bridal Bangles", "Maang Tikka", "Nath", "Kamarband", "Maharashtrian Sets", "Temple Sets", "Complete Bridal Sets"].map((c) => (
            <Link key={c} to="/shop" className="aspect-[4/3] bg-beige/40 ring-1 ring-gold/15 grid place-items-center p-4 hover:bg-maroon hover:text-ivory transition-all group">
              <span className="font-display text-lg group-hover:text-ivory">{c}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-2">
        <img src={bridalBand} alt="Bridal hands" className="w-full h-full object-cover min-h-[400px]" />
        <div className="bg-maroon text-ivory p-12 lg:p-20 flex flex-col justify-center">
          <h2 className="font-display text-4xl md:text-5xl">The Bridal Experience</h2>
          <ul className="mt-8 space-y-4">
            {["Private bridal lounge appointments", "Dedicated stylist and consultant", "Customisation on every piece", "Sister, mother & extended family co-ordination", "Pre-wedding insurance & secure storage"].map((x) => (
              <li key={x} className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-gold mt-2 shrink-0" />{x}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-maroon mb-10 text-center">Featured Bridal Pieces</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {bridalProducts.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </>
  );
}
