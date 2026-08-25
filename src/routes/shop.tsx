import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PRODUCTS, NAV } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { ChevronDown, Search } from "lucide-react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Jewellery — Aurelia Heritage" },
      { name: "description", content: "Browse Aurelia's complete collection of gold, diamond, silver, bridal and traditional jewellery." },
      { property: "og:title", content: "Shop — Aurelia Heritage" },
      { property: "og:description", content: "The complete Aurelia collection." },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [query, setQuery] = useState("");
  const [material, setMaterial] = useState("All");
  const [occasion, setOccasion] = useState("All");
  const [sort, setSort] = useState("featured");

  const materials = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.material)))];
  const occasions = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.occasion)))];

  const filtered = useMemo(() => {
    let r = PRODUCTS.filter((p) =>
      (material === "All" || p.material === material) &&
      (occasion === "All" || p.occasion === occasion) &&
      (query === "" || p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()))
    );
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    else if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [query, material, occasion, sort]);

  return (
    <>
      {/* Page header */}
      <section className="bg-maroon text-ivory py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">The Boutique</span>
          <h1 className="font-display text-5xl md:text-6xl mt-4 leading-tight">Shop the Collection</h1>
          <p className="text-ivory/70 mt-4 max-w-xl mx-auto text-sm">Every piece, handcrafted with intention. Filter, explore and discover your next heirloom.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-[260px_1fr] gap-10">
        {/* Sidebar */}
        <aside className="space-y-8">
          <div>
            <h3 className="font-display text-lg text-maroon mb-3">Search</h3>
            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search pieces..." className="w-full pl-9 pr-3 py-2.5 text-sm bg-white ring-1 ring-gold/20 focus:ring-gold outline-none" />
            </div>
          </div>

          <FilterGroup label="Material" options={materials} value={material} onChange={setMaterial} />
          <FilterGroup label="Occasion" options={occasions} value={occasion} onChange={setOccasion} />

          <div>
            <h3 className="font-display text-lg text-maroon mb-3">Categories</h3>
            <ul className="space-y-2 text-sm">
              {NAV.categories.slice(0, 8).map((c) => (
                <li key={c}><Link to="/categories" className="text-charcoal/70 hover:text-maroon">{c}</Link></li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Grid */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gold/20">
            <p className="text-sm text-charcoal/60">Showing <span className="font-semibold text-maroon">{filtered.length}</span> pieces</p>
            <label className="relative">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="appearance-none bg-white ring-1 ring-gold/20 px-4 py-2 pr-9 text-xs uppercase tracking-widest font-semibold outline-none focus:ring-gold">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="size-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal/50" />
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-2xl text-maroon">No pieces match your filters</p>
              <p className="text-sm text-charcoal/60 mt-2">Try adjusting your selection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function FilterGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <h3 className="font-display text-lg text-maroon mb-3">{label}</h3>
      <div className="space-y-2">
        {options.map((o) => (
          <label key={o} className="flex items-center gap-2 cursor-pointer text-sm text-charcoal/75 hover:text-maroon">
            <input type="radio" name={label} checked={value === o} onChange={() => onChange(o)} className="accent-maroon" />
            {o}
          </label>
        ))}
      </div>
    </div>
  );
}
