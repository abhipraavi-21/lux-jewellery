import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Youtube, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-charcoal text-ivory/75 pt-24 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-6">
          <div className="flex flex-col leading-none">
            <span className="font-display text-3xl tracking-[0.18em] text-gold">AURELIA</span>
            <span className="text-[9px] tracking-[0.5em] text-ivory/40 mt-1">HERITAGE · 1924</span>
          </div>
          <p className="text-sm leading-relaxed max-w-[36ch]">
            A century of devotion to purity, craft, and the women who wear our pieces. Every Aurelia masterwork is hand-finished in our Mumbai atelier.
          </p>
          <div className="flex gap-3">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" aria-label="social" className="size-9 rounded-full ring-1 ring-ivory/15 flex items-center justify-center hover:bg-gold hover:text-charcoal hover:ring-gold transition-all">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold">Shop</h4>
          <ul className="space-y-3 text-sm">
            {["Gold", "Diamond", "Silver", "Bridal", "Traditional", "Bespoke"].map((x) => (
              <li key={x}><Link to="/shop" className="hover:text-gold transition-colors">{x}</Link></li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold">Client Care</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link to="/about" className="hover:text-gold">Certification</Link></li>
            <li><Link to="/about" className="hover:text-gold">Shipping</Link></li>
            <li><Link to="/about" className="hover:text-gold">Returns</Link></li>
            <li><Link to="/custom" className="hover:text-gold">Bespoke Atelier</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-4 space-y-5">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold">Inner Circle</h4>
          <p className="text-sm">Private previews, atelier openings, and seasonal lookbooks — delivered with discretion.</p>
          <form className="flex border-b border-ivory/25 py-2" onSubmit={(e) => e.preventDefault()}>
            <Mail className="size-4 text-ivory/40 mr-2 mt-0.5 shrink-0" />
            <input type="email" required placeholder="Your email address" className="flex-1 bg-transparent text-sm outline-none placeholder:text-ivory/30" />
            <button className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold ml-2">Join</button>
          </form>
          <div className="flex gap-2 flex-wrap pt-2">
            {["VISA", "MC", "AMEX", "UPI", "PAYPAL"].map((p) => (
              <span key={p} className="text-[9px] tracking-widest ring-1 ring-ivory/15 px-2 py-1 rounded-sm text-ivory/50">{p}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-ivory/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-ivory/40">
        <p>© 2026 Aurelia Heritage House. All Rights Reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gold">Privacy</a>
          <a href="#" className="hover:text-gold">Terms</a>
          <a href="#" className="hover:text-gold">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
