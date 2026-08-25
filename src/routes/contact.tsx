import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/products";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Aurelia Heritage" },
      { name: "description", content: "Get in touch with Aurelia Heritage. Visit our Mumbai atelier or book a private consultation." },
      { property: "og:title", content: "Contact — Aurelia Heritage" },
      { property: "og:description", content: "Speak with our concierge or visit our Mumbai atelier." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <section className="bg-maroon text-ivory py-20 px-6 text-center">
        <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">In Touch</span>
        <h1 className="font-display text-5xl md:text-6xl mt-4 leading-tight">Visit Our Atelier</h1>
        <p className="text-ivory/70 mt-4 max-w-xl mx-auto text-sm">For private viewings, bridal consultations and bespoke commissions — we are at your service.</p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-[1fr_1.2fr] gap-12">
        {/* Info */}
        <div className="space-y-8">
          {[
            { icon: MapPin, title: "Visit", lines: ["Aurelia Heritage House", "12 Zaveri Bazaar, Kalbadevi", "Mumbai · Maharashtra · 400002"] },
            { icon: Phone, title: "Call", lines: ["+91 99999 99999", "Mon–Sat · 10am – 8pm IST"] },
            { icon: Mail, title: "Write", lines: ["concierge@aurelia.example", "bespoke@aurelia.example"] },
            { icon: Clock, title: "Hours", lines: ["Mon–Sat: 10am – 8pm", "Sun: By appointment"] },
          ].map(({ icon: Icon, title, lines }) => (
            <div key={title} className="flex gap-4">
              <div className="size-12 rounded-full bg-gold/15 ring-1 ring-gold/30 grid place-items-center shrink-0">
                <Icon className="size-5 text-maroon" />
              </div>
              <div>
                <h3 className="font-display text-xl text-maroon">{title}</h3>
                {lines.map((l) => <p key={l} className="text-sm text-charcoal/70 mt-1">{l}</p>)}
              </div>
            </div>
          ))}

          <a href={WHATSAPP_LINK("Hello Aurelia, I'd like to enquire.")} target="_blank" rel="noreferrer" className="inline-block bg-[#25D366] text-white px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#1ea954] transition-colors">Chat on WhatsApp</a>

          <div className="aspect-video ring-1 ring-gold/20 overflow-hidden">
            <iframe
              title="Aurelia Heritage location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.0!2d72.83!3d18.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Form */}
        <div className="bg-beige/30 p-8 md:p-12 ring-1 ring-gold/15">
          {sent ? (
            <div className="text-center py-12">
              <h2 className="font-display text-3xl text-maroon">Thank you</h2>
              <p className="text-charcoal/70 mt-4">Our concierge will respond within one business day.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-5">
              <h2 className="font-display text-3xl text-maroon">Send a message</h2>
              <div className="hairline w-12" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name" required />
                <Field label="Phone Number" type="tel" required />
              </div>
              <Field label="Email" type="email" required />
              <Field label="Jewellery Requirement" />
              <Field label="Budget Range" />
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-charcoal/70">Message</span>
                <textarea rows={4} className="mt-2 w-full bg-white ring-1 ring-gold/20 focus:ring-gold outline-none px-4 py-3 text-sm" />
              </label>
              <button className="w-full bg-maroon text-ivory py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-charcoal transition-colors">Send Enquiry</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-charcoal/70">{label}</span>
      <input {...rest} className="mt-2 w-full bg-white ring-1 ring-gold/20 focus:ring-gold outline-none px-4 py-3 text-sm" />
    </label>
  );
}
