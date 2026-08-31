import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — Aurelia Heritage" },
      { name: "description", content: "Explore Aurelia's curated collections — Wedding, Festive, Luxury, Gift and more." },
      { property: "og:url", content: "/collections" },
    ],
    links: [{ rel: "canonical", href: "/collections" }],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  const { collections, products } = useStore();
  const visibleCollections = collections
    .filter((collection) => collection.active)
    .map((collection, index) => ({
      key: collection.id,
      name: collection.name,
      image: collection.image || products[index % Math.max(products.length, 1)]?.image,
    }));

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">Curated</span>
        <h1 className="font-display text-5xl md:text-6xl text-maroon mt-4 leading-tight">Our Collections</h1>
        <div className="hairline w-24 mx-auto mt-6" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {visibleCollections.map((collection, i) => {
          return (
            <Link key={collection.key} to="/shop" className="group relative aspect-[16/10] overflow-hidden ring-1 ring-gold/10">
              <img src={collection.image} alt={collection.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-tr from-maroon/85 via-maroon/30 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">Collection</span>
                <h2 className="font-display text-3xl text-ivory mt-2">{collection.name}</h2>
                <span className="mt-3 text-[10px] uppercase tracking-[0.3em] text-ivory/80 border-b border-gold w-fit pb-1">Explore</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
