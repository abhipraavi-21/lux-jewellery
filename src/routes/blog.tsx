import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Journal — Aurelia Heritage" },
      { name: "description", content: "Stories from the Aurelia atelier — craft, heritage, and the women who wear our pieces." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

const POSTS = [
  { slug: "how-to-care-for-your-gold", title: "How to Care for Your 22K Gold", excerpt: "Six rituals from our master karigars to keep your heirlooms radiant for generations.", date: "May 12, 2026", cat: "Care Guide" },
  { slug: "anatomy-of-a-bridal-choker", title: "Anatomy of a Bridal Choker", excerpt: "Inside the 300-hour journey of crafting one of our signature bridal pieces.", date: "April 28, 2026", cat: "Craft" },
  { slug: "the-language-of-gemstones", title: "The Language of Gemstones", excerpt: "From sapphires to uncut polki — what each stone whispers to the woman who wears it.", date: "April 02, 2026", cat: "Heritage" },
  { slug: "choosing-the-perfect-solitaire", title: "Choosing the Perfect Solitaire", excerpt: "Our master gemologist on the four Cs, and the fifth that matters most.", date: "March 18, 2026", cat: "Diamonds" },
];

function BlogPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">Stories</span>
        <h1 className="font-display text-5xl md:text-6xl text-maroon mt-4">The Aurelia Journal</h1>
        <div className="hairline w-24 mx-auto mt-6" />
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {POSTS.map((post, i) => (
          <article key={post.slug} className="group">
            <a href="#" className="block aspect-[4/3] overflow-hidden ring-1 ring-gold/15 mb-6">
              <img src={PRODUCTS[i].image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </a>
            <div className="flex gap-4 text-[10px] uppercase tracking-[0.3em] text-charcoal/50 mb-3">
              <span className="text-gold font-bold">{post.cat}</span>
              <span>·</span>
              <span>{post.date}</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-maroon group-hover:text-charcoal transition-colors"><a href="#">{post.title}</a></h2>
            <p className="text-charcoal/70 mt-3 leading-relaxed">{post.excerpt}</p>
            <a href="#" className="inline-block mt-4 text-[10px] uppercase tracking-[0.3em] font-bold border-b-2 border-gold pb-1">Read Story</a>
          </article>
        ))}
      </div>
    </section>
  );
}
