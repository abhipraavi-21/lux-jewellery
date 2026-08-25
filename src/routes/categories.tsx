import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, NAV } from "@/lib/products";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Aurelia Heritage" },
      { name: "description", content: "Browse all Aurelia jewellery categories — gold, diamond, silver, bridal, traditional and more." },
      { property: "og:url", content: "/categories" },
    ],
    links: [{ rel: "canonical", href: "/categories" }],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">The Atelier</span>
        <h1 className="font-display text-5xl md:text-6xl text-maroon mt-4 leading-tight">All Categories</h1>
        <div className="hairline w-24 mx-auto mt-6" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {CATEGORIES.map((cat) => (
          <Link key={cat.slug} to="/shop" className="group relative aspect-[4/5] overflow-hidden ring-1 ring-gold/10">
            <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h2 className="font-display text-2xl text-ivory">{cat.name}</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/70 mt-1">{cat.count} pieces</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-beige/30 p-10 ring-1 ring-gold/15">
        <h2 className="font-display text-3xl text-maroon mb-8">All Sub-Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {NAV.categories.map((c) => (
            <Link key={c} to="/shop" className="text-sm py-2 text-charcoal/75 hover:text-maroon border-b border-gold/10">{c}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}
