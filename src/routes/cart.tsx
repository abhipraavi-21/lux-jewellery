import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useStore, formatPrice } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Bag — Aurelia Heritage" }, { name: "description", content: "Review your selected pieces." }] }),
  component: CartPage,
});

function CartPage() {
  const { cartProducts, updateQty, removeFromCart, cartTotal } = useStore();
  const shipping = cartTotal > 1000 ? 0 : 25;
  const total = cartTotal + shipping;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl md:text-5xl text-maroon">Your Jewellery Bag</h1>
      <div className="hairline w-24 mt-4 mb-12" />

      {cartProducts.length === 0 ? (
        <div className="text-center py-20 bg-beige/30 ring-1 ring-gold/15">
          <ShoppingBag className="size-12 text-gold mx-auto" />
          <h2 className="font-display text-2xl text-maroon mt-6">Your bag is empty</h2>
          <p className="text-sm text-charcoal/60 mt-2">Discover pieces worth treasuring.</p>
          <Link to="/shop" className="inline-block mt-8 bg-maroon text-ivory px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-charcoal transition-colors">Start Shopping</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          <div className="space-y-6">
            {cartProducts.map((p) => (
              <div key={p.id} className="flex gap-4 md:gap-6 pb-6 border-b border-gold/15">
                <Link to="/product/$id" params={{ id: p.id }} className="shrink-0">
                  <img src={p.image} alt={p.name} className="size-24 md:size-32 object-cover ring-1 ring-gold/20" />
                </Link>
                <div className="flex-1">
                  <Link to="/product/$id" params={{ id: p.id }}>
                    <h3 className="font-display text-lg md:text-xl text-maroon">{p.name}</h3>
                  </Link>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal/50 mt-1">{p.material} · {p.purity}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center ring-1 ring-gold/30">
                      <button onClick={() => updateQty(p.id, p.qty - 1)} className="px-3 py-1.5 hover:bg-beige"><Minus className="size-3" /></button>
                      <span className="px-4 text-sm font-semibold">{p.qty}</span>
                      <button onClick={() => updateQty(p.id, p.qty + 1)} className="px-3 py-1.5 hover:bg-beige"><Plus className="size-3" /></button>
                    </div>
                    <button onClick={() => removeFromCart(p.id)} className="text-charcoal/50 hover:text-maroon" aria-label="Remove">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl text-maroon">{formatPrice(p.price * p.qty)}</p>
                  {p.mrp > p.price && <p className="text-xs text-charcoal/40 line-through mt-1">{formatPrice(p.mrp * p.qty)}</p>}
                </div>
              </div>
            ))}
          </div>

          <aside className="bg-beige/30 ring-1 ring-gold/15 p-8 h-fit lg:sticky lg:top-32">
            <h2 className="font-display text-2xl text-maroon">Order Summary</h2>
            <div className="hairline w-12 my-4" />
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-charcoal/70">Subtotal</dt><dd className="font-semibold">{formatPrice(cartTotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-charcoal/70">Shipping</dt><dd className="font-semibold">{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</dd></div>
              <div className="flex justify-between"><dt className="text-charcoal/70">Insurance</dt><dd className="font-semibold">Included</dd></div>
            </dl>
            <div className="border-t border-gold/30 mt-6 pt-6 flex justify-between items-baseline">
              <span className="font-display text-lg text-maroon">Total</span>
              <span className="font-display text-2xl text-maroon">{formatPrice(total)}</span>
            </div>
            <Link to="/checkout" className="block text-center mt-8 bg-maroon text-ivory py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-charcoal transition-colors">Proceed to Checkout</Link>
            <Link to="/shop" className="block text-center mt-3 text-[10px] uppercase tracking-[0.3em] font-bold text-charcoal/60 hover:text-maroon">Continue Shopping</Link>
          </aside>
        </div>
      )}
    </section>
  );
}
