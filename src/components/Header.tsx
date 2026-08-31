import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { NAV } from "@/lib/products";
import { useStore } from "@/lib/store";

const linkCls =
  "relative whitespace-nowrap text-[11px] uppercase tracking-[0.18em] font-semibold text-charcoal/80 hover:text-maroon transition-colors";

export function Header() {
  const { cartCount, wishlistCount, activeCategories } = useStore();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const categoryLinks = activeCategories.length > 0 ? activeCategories.map((category) => category.name) : NAV.categories;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? "bg-ivory/90 backdrop-blur-md shadow-[0_1px_0_0_color-mix(in_oklab,var(--gold)_20%,transparent)]" : "bg-ivory"
      }`}
    >
      {/* Announcement bar */}
      <div className="bg-maroon text-ivory text-[10px] tracking-[0.3em] uppercase text-center py-2 font-medium">
        Complimentary insured shipping worldwide · Lifetime exchange · BIS Hallmarked
      </div>

      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 md:px-8">
        {/* Mobile menu */}
        <button onClick={() => setOpen(true)} className="lg:hidden text-charcoal p-1" aria-label="Menu">
          <Menu className="size-5" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex shrink-0 flex-col items-center leading-none lg:items-start">
          <span className="font-display text-2xl font-bold tracking-[0.16em] text-maroon md:text-3xl">AURELIA</span>
          <span className="text-[8px] tracking-[0.5em] text-gold mt-0.5">HERITAGE · 1924</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-4 overflow-visible xl:flex 2xl:gap-6">
          <Link to="/" className={linkCls}>Home</Link>
          <Link to="/shop" className={linkCls}>Shop</Link>

          <div className="group relative">
            <Link to="/categories" className={`${linkCls} flex items-center gap-1`}>
              Categories <ChevronDown className="size-3" />
            </Link>
            <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 invisible transition-all group-hover:visible group-hover:opacity-100">
              <div className="w-[320px] glass-card luxury-shadow p-5 grid grid-cols-2 gap-x-4 gap-y-1">
                {categoryLinks.map((c) => (
                  <Link
                    key={c}
                    to="/categories"
                    className="text-xs py-1.5 text-charcoal/75 hover:text-maroon transition-colors"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="group relative">
            <Link to="/collections" className={`${linkCls} flex items-center gap-1`}>
              Collections <ChevronDown className="size-3" />
            </Link>
            <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 invisible transition-all group-hover:visible group-hover:opacity-100">
              <div className="w-[260px] glass-card luxury-shadow p-5 flex flex-col gap-1">
                {NAV.collections.map((c) => (
                  <Link key={c} to="/collections" className="text-xs py-1.5 text-charcoal/75 hover:text-maroon transition-colors">{c}</Link>
                ))}
              </div>
            </div>
          </div>

          <Link to="/bridal" className={linkCls}>Bridal</Link>
          <Link to="/custom" className={linkCls}>Bespoke</Link>
          <Link to="/offers" className={linkCls}>Offers</Link>
          <Link to="/blog" className={linkCls}>Journal</Link>
          <Link to="/about" className={linkCls}>About</Link>
          <Link to="/contact" className={linkCls}>Contact</Link>
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex shrink-0 items-center gap-3 md:gap-5">
          <button
            className="hidden items-center gap-2 rounded-full bg-beige/50 px-3 py-1.5 transition-colors hover:bg-beige md:flex xl:h-10 xl:w-10 xl:justify-center xl:px-0 2xl:w-auto 2xl:px-3.5 2xl:justify-start"
            aria-label="Search"
          >
            <Search className="size-3.5 text-charcoal/70" />
            <span className="hidden max-w-[96px] truncate text-[11px] tracking-wider text-charcoal/60 2xl:inline 2xl:max-w-none">Search...</span>
          </button>
          <Link to="/login" className="text-charcoal/80 hover:text-maroon transition-colors" aria-label="Account">
            <User className="size-5" />
          </Link>
          <Link to="/wishlist" className="relative text-charcoal/80 hover:text-maroon transition-colors" aria-label="Wishlist">
            <Heart className="size-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-gold text-charcoal text-[9px] font-bold rounded-full size-4 flex items-center justify-center">{wishlistCount}</span>
            )}
          </Link>
          <Link to="/cart" className="relative text-charcoal/80 hover:text-maroon transition-colors" aria-label="Cart">
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-maroon text-ivory text-[9px] font-bold rounded-full size-4 flex items-center justify-center">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-charcoal/40 animate-fade-in" onClick={() => setOpen(false)}>
          <aside className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-ivory p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <span className="font-display text-xl text-maroon tracking-widest">AURELIA</span>
              <button onClick={() => setOpen(false)} aria-label="Close"><X className="size-5" /></button>
            </div>
            <nav className="flex flex-col gap-1">
              {[
                ["/", "Home"], ["/shop", "Shop"], ["/categories", "Categories"],
                ["/collections", "Collections"], ["/bridal", "Bridal"], ["/custom", "Bespoke"],
                ["/offers", "Offers"], ["/blog", "Journal"], ["/about", "About"], ["/contact", "Contact"],
              ].map(([to, label]) => (
                <Link key={to} to={to as string} onClick={() => setOpen(false)} className="py-3 border-b border-gold/15 text-sm uppercase tracking-widest font-semibold text-charcoal/80">
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-maroon/60 font-semibold">Categories</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {categoryLinks.slice(0, 8).map((category) => (
                  <Link key={category} to="/categories" onClick={() => setOpen(false)} className="rounded-full border border-gold/15 px-3 py-2 text-xs text-charcoal/75 hover:border-maroon hover:text-maroon">
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
