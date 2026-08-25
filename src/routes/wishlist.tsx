import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Aurelia Heritage" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlistProducts } = useStore();
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl md:text-5xl text-maroon">Your Wishlist</h1>
      <div className="hairline w-24 mt-4 mb-12" />

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20 bg-beige/30 ring-1 ring-gold/15">
          <Heart className="size-12 text-gold mx-auto" />
          <h2 className="font-display text-2xl text-maroon mt-6">No pieces saved yet</h2>
          <p className="text-sm text-charcoal/60 mt-2">Tap the heart on any piece to save it for later.</p>
          <Link to="/shop" className="inline-block mt-8 bg-maroon text-ivory px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-charcoal transition-colors">Browse Pieces</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {wishlistProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
}
