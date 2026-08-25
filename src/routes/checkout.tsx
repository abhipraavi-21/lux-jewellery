import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { useStore, formatPrice } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Aurelia Heritage" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cartProducts, cartTotal, clearCart } = useStore();
  const [placed, setPlaced] = useState(false);
  const shipping = cartTotal > 1000 ? 0 : 25;
  const total = cartTotal + shipping;

  if (placed) {
    return (
      <section className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="size-20 rounded-full bg-gold/20 ring-1 ring-gold mx-auto grid place-items-center">
          <Check className="size-10 text-maroon" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-maroon mt-8">Thank You</h1>
        <p className="text-charcoal/70 mt-4">Your order has been placed. Our concierge will be in touch shortly with shipping details.</p>
        <Link to="/" className="inline-block mt-10 bg-maroon text-ivory px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-charcoal transition-colors">Continue Browsing</Link>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl md:text-5xl text-maroon">Secure Checkout</h1>
      <div className="hairline w-24 mt-4 mb-12" />

      <form
        onSubmit={(e) => { e.preventDefault(); clearCart(); setPlaced(true); }}
        className="grid lg:grid-cols-[1fr_380px] gap-12"
      >
        <div className="space-y-10">
          <fieldset className="space-y-4">
            <legend className="font-display text-2xl text-maroon mb-2">Contact</legend>
            <Input label="Email" type="email" required />
            <Input label="Phone" type="tel" required />
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-display text-2xl text-maroon mb-2">Shipping Address</legend>
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" required />
              <Input label="Last Name" required />
            </div>
            <Input label="Address" required />
            <div className="grid grid-cols-3 gap-4">
              <Input label="City" required />
              <Input label="State" required />
              <Input label="PIN" required />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-display text-2xl text-maroon mb-2">Payment</legend>
            <Input label="Card Number" required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Expiry (MM/YY)" required />
              <Input label="CVV" required />
            </div>
          </fieldset>
        </div>

        <aside className="bg-beige/30 ring-1 ring-gold/15 p-8 h-fit lg:sticky lg:top-32">
          <h2 className="font-display text-2xl text-maroon">Your Order</h2>
          <div className="hairline w-12 my-4" />
          <ul className="space-y-3 text-sm max-h-64 overflow-auto">
            {cartProducts.map((p) => (
              <li key={p.id} className="flex gap-3">
                <img src={p.image} alt={p.name} className="size-12 object-cover ring-1 ring-gold/20" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-charcoal truncate">{p.name}</p>
                  <p className="text-xs text-charcoal/60">Qty {p.qty}</p>
                </div>
                <span className="font-semibold">{formatPrice(p.price * p.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 text-sm mt-6 pt-6 border-t border-gold/20">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(cartTotal)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd></div>
            <div className="flex justify-between font-display text-lg text-maroon pt-3 border-t border-gold/20"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
          <button type="submit" disabled={cartProducts.length === 0} className="w-full mt-8 bg-maroon text-ivory py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-charcoal transition-colors disabled:opacity-50">
            Place Order
          </button>
        </aside>
      </form>
    </section>
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
