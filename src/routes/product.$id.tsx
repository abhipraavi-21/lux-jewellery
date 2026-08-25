import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, ShoppingBag, Truck, Shield, RefreshCw, Star, Check, ChevronRight } from "lucide-react";
import { PRODUCTS, WHATSAPP_LINK } from "@/lib/products";
import { useStore, formatPrice } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = PRODUCTS.find((x) => x.id === params.id);
    return {
      meta: [
        { title: p ? `${p.name} — Aurelia Heritage` : "Product — Aurelia" },
        { name: "description", content: p?.description ?? "Aurelia jewellery piece." },
        { property: "og:title", content: p?.name ?? "Aurelia" },
        { property: "og:description", content: p?.description ?? "" },
        { property: "og:type", content: "product" },
        ...(p ? [{ property: "og:image", content: p.image }] : []),
        { property: "og:url", content: `/product/${params.id}` },
      ],
      links: [{ rel: "canonical", href: `/product/${params.id}` }],
    };
  },
  loader: ({ params }) => {
    const p = PRODUCTS.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { product: p };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [qty, setQty] = useState(1);
  const wished = wishlist.includes(product.id);
  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-beige/30 px-6 py-4 border-b border-gold/15">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-charcoal/60">
          <Link to="/" className="hover:text-maroon">Home</Link>
          <ChevronRight className="size-3" />
          <Link to="/shop" className="hover:text-maroon">Shop</Link>
          <ChevronRight className="size-3" />
          <span className="text-maroon">{product.name}</span>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden ring-1 ring-gold/15 bg-white group">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-150 transition-transform duration-700 cursor-zoom-in" />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-maroon text-ivory text-[10px] font-bold tracking-[0.3em] uppercase px-3 py-1.5">{product.badge}</span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square overflow-hidden ring-1 ring-gold/15 hover:ring-gold cursor-pointer bg-white">
                <img src={product.image} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">{product.category}</p>
          <h1 className="font-display text-3xl md:text-5xl text-maroon mt-3 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-3 mt-4">
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => <Star key={i} className={`size-4 ${i < Math.round(product.rating) ? "fill-current" : ""}`} />)}
            </div>
            <span className="text-xs text-charcoal/60">{product.rating} · 248 reviews</span>
          </div>

          <div className="mt-6 pb-6 border-b border-gold/20 flex items-baseline gap-4">
            <span className="font-display text-4xl text-maroon">{formatPrice(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-lg text-charcoal/40 line-through">{formatPrice(product.mrp)}</span>
                <span className="text-xs bg-gold/20 text-maroon font-bold px-2 py-1 tracking-widest">SAVE {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%</span>
              </>
            )}
          </div>

          <p className="mt-6 text-charcoal/70 leading-relaxed">{product.description}</p>

          {/* Spec table */}
          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            {[
              ["Metal", product.material],
              ["Purity", product.purity],
              ["Weight", product.weight],
              ["Stone", product.stone],
              ["Occasion", product.occasion],
              ["Certification", "BIS · GIA"],
            ].map(([k, v]) => (
              <div key={k} className="border-b border-gold/10 pb-2">
                <dt className="text-[10px] uppercase tracking-[0.25em] text-charcoal/50">{k}</dt>
                <dd className="font-semibold text-charcoal mt-1">{v}</dd>
              </div>
            ))}
          </dl>

          {/* Qty + buttons */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center ring-1 ring-gold/30">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-3 text-lg hover:bg-beige">−</button>
              <span className="px-5 font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-4 py-3 text-lg hover:bg-beige">+</button>
            </div>
            <button
              onClick={() => addToCart(product.id, qty)}
              className="flex-1 bg-maroon text-ivory px-6 py-4 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-charcoal transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="size-4" /> Add to Bag
            </button>
            <button onClick={() => toggleWishlist(product.id)} aria-label="Wishlist" className={`size-14 grid place-items-center ring-1 ring-gold/40 hover:bg-beige transition ${wished ? "text-maroon" : ""}`}>
              <Heart className={`size-5 ${wished ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="mt-4 flex gap-3">
            <Link to="/checkout" className="flex-1 bg-gold text-charcoal px-6 py-4 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-ivory ring-1 ring-gold text-center transition-colors">Buy Now</Link>
            <a href={WHATSAPP_LINK(`Hello, I'd like to enquire about ${product.name}.`)} target="_blank" rel="noreferrer" className="px-6 py-4 text-[11px] uppercase tracking-[0.3em] font-bold ring-1 ring-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors">WhatsApp Enquiry</a>
          </div>

          {/* Trust strip */}
          <div className="mt-10 grid grid-cols-3 gap-4 pt-8 border-t border-gold/15">
            {[
              { icon: Truck, label: "Free Shipping" },
              { icon: Shield, label: "Certified Pure" },
              { icon: RefreshCw, label: "Lifetime Exchange" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="text-center">
                <Icon className="size-5 text-gold mx-auto" />
                <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-charcoal/65">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-20 px-6 bg-beige/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-maroon mb-10 text-center">You May Also Love</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </>
  );
}
