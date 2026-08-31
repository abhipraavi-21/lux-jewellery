import { createFileRoute } from "@tanstack/react-router";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AdminModal, Badge, FieldLabel, inputClass, textAreaClass } from "@/components/admin/AdminUI";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/homepage")({
  component: AdminHomepagePage,
});

function AdminHomepagePage() {
  const { homepage, products, categories, updateHomepage } = useStore();
  const [heroEdit, setHeroEdit] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-display text-2xl text-slate-900">Homepage Section Visibility</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(Object.keys(homepage.sectionVisibility) as Array<keyof typeof homepage.sectionVisibility>).map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => updateHomepage({ sectionVisibility: { ...homepage.sectionVisibility, [section]: !homepage.sectionVisibility[section] } })}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm ${homepage.sectionVisibility[section] ? "border-slate-300 bg-slate-900/5 text-slate-900" : "border-slate-200 bg-white text-slate-600"}`}
            >
              <span>{section}</span>
              <Check className={`size-4 ${homepage.sectionVisibility[section] ? "opacity-100" : "opacity-30"}`} />
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-slate-900">Hero Banners</h2>
          <button type="button" onClick={() => setHeroEdit(homepage.heroBanners.length)} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-white">
            <Plus className="size-4" /> Add Banner
          </button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {homepage.heroBanners.map((banner, index) => (
            <button key={banner.id} type="button" onClick={() => setHeroEdit(index)} className="text-left overflow-hidden rounded-[1.5rem] border border-slate-200">
              <img src={banner.image} alt={banner.title} className="h-44 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <Badge tone={banner.active ? "success" : "neutral"}>{banner.active ? "Active" : "Inactive"}</Badge>
                </div>
                <h3 className="mt-3 font-display text-xl text-slate-900">{banner.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{banner.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-display text-2xl text-slate-900">Featured Products</h2>
        <MultiSelect label="Featured products" ids={homepage.featuredProductIds} items={products.map((product) => ({ id: product.id, label: product.name }))} onChange={(ids) => updateHomepage({ featuredProductIds: ids })} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-display text-2xl text-slate-900">Featured Categories</h2>
        <MultiSelect label="Featured categories" ids={homepage.featuredCategoryIds} items={categories.map((category) => ({ id: category.id, label: category.name }))} onChange={(ids) => updateHomepage({ featuredCategoryIds: ids })} />
      </section>

      {heroEdit !== null && (
        <HeroModal
          index={heroEdit}
          banner={homepage.heroBanners[heroEdit] ?? null}
          onClose={() => setHeroEdit(null)}
          onSave={(banner) => {
            const heroBanners = [...homepage.heroBanners];
            if (heroEdit < heroBanners.length) heroBanners[heroEdit] = banner;
            else heroBanners.push(banner);
            updateHomepage({ heroBanners });
            toast.success("Homepage banner saved");
            setHeroEdit(null);
          }}
        />
      )}
    </div>
  );
}

function MultiSelect({
  label,
  ids,
  items,
  onChange,
}: {
  label: string;
  ids: string[];
  items: Array<{ id: string; label: string }>;
  onChange: (ids: string[]) => void;
}) {
  return (
    <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const selected = ids.includes(item.id);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(selected ? ids.filter((id) => id !== item.id) : [...ids, item.id])}
            className={`rounded-2xl border px-4 py-3 text-left text-sm ${selected ? "border-slate-300 bg-slate-900/5 text-slate-900" : "border-slate-200 bg-white text-slate-600"}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function HeroModal({
  index,
  banner,
  onClose,
  onSave,
}: {
  index: number;
  banner: NonNullable<ReturnType<typeof useStore>["homepage"]["heroBanners"][number]> | null;
  onClose: () => void;
  onSave: (banner: NonNullable<ReturnType<typeof useStore>["homepage"]["heroBanners"][number]>) => void;
}) {
  const initial = banner ?? {
    id: `hero-${Date.now()}`,
    title: "",
    subtitle: "",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    image: "",
    active: true,
  };
  const [draft, setDraft] = useState(initial);

  return (
    <AdminModal title={index < 10 ? "Edit Hero Banner" : "Add Hero Banner"} subtitle="Manage the main promotional banners." onClose={onClose} wide>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" required>
          <input className={inputClass} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
        </Field>
        <Field label="Subtitle" required>
          <input className={inputClass} value={draft.subtitle} onChange={(event) => setDraft({ ...draft, subtitle: event.target.value })} />
        </Field>
        <Field label="CTA Text">
          <input className={inputClass} value={draft.ctaText} onChange={(event) => setDraft({ ...draft, ctaText: event.target.value })} />
        </Field>
        <Field label="CTA Link">
          <input className={inputClass} value={draft.ctaLink} onChange={(event) => setDraft({ ...draft, ctaLink: event.target.value })} />
        </Field>
        <Field label="Image">
          <input className={inputClass} value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} />
        </Field>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
          <input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} className="size-4 accent-slate-900" />
          Active banner
        </label>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
          Cancel
        </button>
        <button type="button" onClick={() => onSave(draft)} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          Save Banner
        </button>
      </div>
    </AdminModal>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <FieldLabel label={label} required={required}>
        {children}
      </FieldLabel>
    </div>
  );
}


