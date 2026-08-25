import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import bespoke from "@/assets/bespoke.jpg";
import { WHATSAPP_LINK } from "@/lib/products";

export const Route = createFileRoute("/custom")({
  head: () => ({
    meta: [
      { title: "Bespoke Atelier — Aurelia Heritage" },
      { name: "description", content: "Commission a custom jewellery piece designed only for you. From sketch to heirloom." },
      { property: "og:url", content: "/custom" },
    ],
    links: [{ rel: "canonical", href: "/custom" }],
  }),
  component: CustomPage,
});

function CustomPage() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <section className="relative bg-charcoal text-ivory">
        <img src={bespoke} alt="Bespoke jewellery design" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">Bespoke Atelier</span>
          <h1 className="font-display text-5xl md:text-7xl mt-6 leading-tight text-balance">Designed only <span className="italic text-gold-soft">for you.</span></h1>
          <p className="text-ivory/75 mt-6 max-w-2xl mx-auto">From engagement rings to family heirlooms. Sit with our designers, choose your stones, and watch your vision become a piece no one else in the world will ever wear.</p>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-maroon mb-12 text-center">The Bespoke Process</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            ["01", "Consultation", "Meet our designers virtually or at our atelier."],
            ["02", "Design", "Receive sketches and 3D renderings of your piece."],
            ["03", "Crafting", "Our karigars handcraft your piece over 60–90 days."],
            ["04", "Delivery", "Insured delivery with lifetime certificate of authenticity."],
          ].map(([n, t, d]) => (
            <div key={n}>
              <div className="font-display text-5xl text-gold">{n}</div>
              <div className="hairline w-12 my-3" />
              <h3 className="font-display text-xl text-maroon">{t}</h3>
              <p className="text-sm text-charcoal/65 mt-2 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-beige/30">
        <div className="max-w-2xl mx-auto bg-ivory p-10 ring-1 ring-gold/15 luxury-shadow">
          <h2 className="font-display text-3xl text-maroon">Begin Your Commission</h2>
          <div className="hairline w-12 mt-3 mb-6" />
          {sent ? (
            <p className="text-charcoal/70">Thank you — our atelier director will be in touch within 48 hours to schedule your private consultation.</p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <Input label="Name" required />
              <Input label="Email" type="email" required />
              <Input label="Phone" type="tel" required />
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-charcoal/70">Describe Your Vision</span>
                <textarea rows={5} required className="mt-2 w-full bg-white ring-1 ring-gold/20 focus:ring-gold outline-none px-4 py-3 text-sm" />
              </label>
              <button className="w-full bg-maroon text-ivory py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-charcoal transition-colors">Request Consultation</button>
              <a href={WHATSAPP_LINK("Hi, I'd like to commission a custom piece.")} target="_blank" rel="noreferrer" className="block text-center text-[10px] uppercase tracking-[0.3em] text-[#25D366] font-bold hover:underline">Or chat on WhatsApp</a>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function Input({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-charcoal/70">{label}</span>
      <input {...rest} className="mt-2 w-full bg-white ring-1 ring-gold/20 focus:ring-gold outline-none px-4 py-3 text-sm" />
    </label>
  );
}
