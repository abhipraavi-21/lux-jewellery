import { createFileRoute } from "@tanstack/react-router";
import bespoke from "@/assets/bespoke.jpg";
import bridal from "@/assets/bridal-band.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Aurelia Heritage" },
      { name: "description", content: "A century of craft. Aurelia Heritage was founded in 1924 in Mumbai's jewellery district." },
      { property: "og:title", content: "About — Aurelia Heritage" },
      { property: "og:description", content: "Founded 1924. A century of craft, purity and trust." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="bg-maroon text-ivory py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">Our Story</span>
          <h1 className="font-display text-5xl md:text-7xl mt-6 leading-tight text-balance">A Century in <span className="italic">Gold</span></h1>
          <p className="text-ivory/70 mt-6 max-w-2xl mx-auto leading-relaxed">Founded in 1924 in the jewellery district of Mumbai, Aurelia Heritage has clothed four generations of brides, queens, and the women who quietly rule their worlds.</p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <img src={bespoke} alt="Master jeweller at work" className="ring-1 ring-gold/20 soft-shadow" />
        <div>
          <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">Craftsmanship</span>
          <h2 className="font-display text-4xl md:text-5xl text-maroon mt-4 leading-tight">The Hands That Shape Heirlooms</h2>
          <p className="text-charcoal/70 mt-6 leading-relaxed">Behind every Aurelia piece are families of karigars whose skills have been passed down for generations. We do not industrialise our craft. A single bridal choker can take 300 hours; a custom solitaire setting, sixty days.</p>
          <p className="text-charcoal/70 mt-4 leading-relaxed">Every diamond is GIA certified. Every gram of gold is BIS hallmarked. Every emotion, honoured.</p>
        </div>
      </section>

      <section className="py-24 px-6 bg-beige/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 text-center">
          {[
            ["100+", "Years of Heritage"],
            ["50,000", "Brides Adorned"],
            ["80+", "Countries Shipped"],
            ["4.9/5", "Client Satisfaction"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-display text-5xl text-maroon">{n}</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-charcoal/60 mt-2">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1">
          <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">Our Promise</span>
          <h2 className="font-display text-4xl md:text-5xl text-maroon mt-4 leading-tight">Purity. Trust. Forever.</h2>
          <ul className="mt-8 space-y-4">
            {[
              "Every gold piece BIS hallmarked",
              "Every diamond GIA / IGI certified",
              "Lifetime exchange at full gold value",
              "Bespoke atelier for one-of-a-kind commissions",
              "Specialised bridal consultation team",
              "Insured worldwide shipping",
            ].map((x) => (
              <li key={x} className="flex items-start gap-3 text-charcoal/80">
                <span className="size-1.5 rounded-full bg-gold mt-2 shrink-0" /> {x}
              </li>
            ))}
          </ul>
        </div>
        <img src={bridal} alt="Bridal jewellery detail" className="order-1 lg:order-2 ring-1 ring-gold/20 soft-shadow" />
      </section>
    </>
  );
}
