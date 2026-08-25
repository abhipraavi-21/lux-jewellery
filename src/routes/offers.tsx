import { createFileRoute, Link } from "@tanstack/react-router";
import { Tag } from "lucide-react";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offers — Aurelia Heritage" },
      { name: "description", content: "Seasonal promotions and exclusive offers on Aurelia jewellery." },
      { property: "og:url", content: "/offers" },
    ],
    links: [{ rel: "canonical", href: "/offers" }],
  }),
  component: OffersPage,
});

const offers = [
  { title: "Festive Privilege", code: "FESTIVE26", text: "Up to 25% off making charges on all 22K gold pieces this Diwali.", tone: "maroon" },
  { title: "Bridal Trousseau", code: "VIVAH", text: "Complimentary kamarband with every bridal choker set above $5,000.", tone: "gold" },
  { title: "Diamond Days", code: "BRILLIANT", text: "0% finance on certified diamond solitaires above $2,500.", tone: "charcoal" },
  { title: "Inner Circle", code: "INSIDER", text: "Members receive private access to upcoming collections, 7 days early.", tone: "maroon" },
];

function OffersPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">Privileges</span>
        <h1 className="font-display text-5xl md:text-6xl text-maroon mt-4">Exclusive Offers</h1>
        <div className="hairline w-24 mx-auto mt-6" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {offers.map((o) => (
          <div key={o.code} className={`relative p-10 overflow-hidden ${o.tone === "maroon" ? "bg-maroon text-ivory" : o.tone === "charcoal" ? "bg-charcoal text-ivory" : "bg-gold text-charcoal"}`}>
            <Tag className="absolute -top-6 -right-6 size-32 opacity-10" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-80">Limited Time</span>
            <h2 className="font-display text-3xl md:text-4xl mt-3 leading-tight">{o.title}</h2>
            <p className="mt-4 leading-relaxed opacity-90">{o.text}</p>
            <div className="mt-8 flex items-center justify-between border-t border-current/20 pt-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">Code</p>
                <p className="font-display text-2xl mt-1">{o.code}</p>
              </div>
              <Link to="/shop" className="text-[10px] uppercase tracking-[0.3em] font-bold border-b-2 border-current pb-1">Shop Now</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
