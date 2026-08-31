import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/products";
import { useStore, formatPrice } from "@/lib/store";
import type { ProductRecord } from "@/lib/site-data";

export function ProductCard({ product }: { product: ProductRecord }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const wished = wishlist.includes(product.id);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="group relative">
      <div className="relative aspect-[4/5] bg-white overflow-hidden soft-shadow ring-1 ring-gold/10 group-hover:ring-gold/30 transition-all">
        <Link to="/product/$id" params={{ id: product.id }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.badge && (
            <span className="bg-maroon text-ivory text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-1">{product.badge}</span>
          )}
          {discount > 0 && !product.badge && (
            <span className="bg-gold text-charcoal text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-1">-{discount}%</span>
          )}
        </div>

        {/* Floating icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label="Wishlist"
            className={`size-9 rounded-full bg-ivory/90 backdrop-blur grid place-items-center ring-1 ring-gold/20 hover:bg-maroon hover:text-ivory transition-all ${wished ? "text-maroon" : "text-charcoal/70"}`}
          >
            <Heart className={`size-4 ${wished ? "fill-current" : ""}`} />
          </button>
          <Link
            to="/product/$id"
            params={{ id: product.id }}
            aria-label="Quick view"
            className="size-9 rounded-full bg-ivory/90 backdrop-blur grid place-items-center ring-1 ring-gold/20 text-charcoal/70 hover:bg-maroon hover:text-ivory transition-all opacity-0 group-hover:opacity-100"
          >
            <Eye className="size-4" />
          </Link>
          <a
            href={WHATSAPP_LINK(`Hello, I'd like to enquire about ${product.name}.`)}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp enquiry"
            className="size-9 rounded-full bg-ivory/90 backdrop-blur grid place-items-center ring-1 ring-gold/20 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412 0 6.556-5.338 11.892-11.893 11.892-1.997 0-3.951-.5-5.688-1.448l-6.309 1.656z"/>
            </svg>
          </a>
        </div>

        {/* Quick add */}
        <button
          onClick={() => addToCart(product.id)}
          className="absolute inset-x-0 bottom-0 bg-charcoal text-ivory py-3.5 text-[10px] font-bold uppercase tracking-[0.3em] translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-center gap-2"
        >
          <ShoppingBag className="size-3.5" /> Add to Bag
        </button>
      </div>

      <div className="mt-4 px-1">
        <p className="text-[10px] uppercase text-charcoal/50 tracking-[0.25em] mb-1">{product.category}</p>
        <Link to="/product/$id" params={{ id: product.id }}>
          <h4 className="font-display text-lg text-charcoal hover:text-maroon transition-colors leading-tight">{product.name}</h4>
        </Link>
        <div className="flex items-baseline justify-between mt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-maroon">{formatPrice(product.price)}</span>
            {product.mrp > product.price && (
              <span className="text-xs text-charcoal/40 line-through">{formatPrice(product.mrp)}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gold">
            <Star className="size-3 fill-current" />
            <span className="text-charcoal/70">{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
