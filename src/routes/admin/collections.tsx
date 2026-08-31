import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { toast } from "sonner";

import { AdminConfirmModal, AdminModal, Badge, FieldLabel, adminPrimaryButtonClass, adminSectionClass, adminSecondaryButtonClass, inputClass, textAreaClass } from "@/components/admin/AdminUI";
import { useStore } from "@/lib/store";
import { createId, type CollectionRecord } from "@/lib/site-data";

export const Route = createFileRoute("/admin/collections")({
  component: AdminCollectionsPage,
});

const emptyCollection = (): CollectionRecord => ({
  id: createId("collection"),
  name: "",
  image: "",
  description: "",
  active: true,
  featured: false,
});

function AdminCollectionsPage() {
  const { collections, products, upsertCollection, deleteCollection } = useStore();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<CollectionRecord | null>(null);
  const [confirming, setConfirming] = useState<CollectionRecord | null>(null);

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    const image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    setDraft((current) => (current ? { ...current, image } : current));
  };

  const rows = useMemo(
    () =>
      collections.filter((collection) =>
        query.trim() === ""
          ? true
          : collection.name.toLowerCase().includes(query.toLowerCase()) || collection.description.toLowerCase().includes(query.toLowerCase()),
      ),
    [collections, query],
  );

  return (
    <div className="space-y-6">
      <section className={adminSectionClass.replace("p-6", "p-5")}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <label className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
            <Search className="size-4 text-slate-500" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-900/35" placeholder="Search collections..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <button
            type="button"
            onClick={() => setDraft(emptyCollection())}
          className={adminPrimaryButtonClass}
          >
            <Plus className="size-4" />
            Add Collection
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.75rem] border border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-[color-mix(in_oklab,var(--ivory)_92%,white_8%)] shadow-[0_24px_60px_-40px_color-mix(in_oklab,var(--maroon)_36%,transparent)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[color-mix(in_oklab,var(--beige)_62%,white_38%)] text-[10px] uppercase tracking-[0.3em] text-maroon/65">
              <tr>
                <th className="px-5 py-4">Banner/Image</th>
                <th className="px-5 py-4">Collection Name</th>
                <th className="px-5 py-4">Description</th>
                <th className="px-5 py-4">Products</th>
                <th className="px-5 py-4">Featured</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((collection) => {
                const count = products.filter((product) => product.collection === collection.name).length;
                return (
                  <tr key={collection.id} className="border-t border-slate-200">
                    <td className="px-5 py-4">
                      <img src={collection.image} alt={collection.name} className="size-14 rounded-2xl object-cover ring-1 ring-slate-200" />
                    </td>
                    <td className="px-5 py-4 font-medium">{collection.name}</td>
                    <td className="px-5 py-4 text-slate-600">{collection.description}</td>
                    <td className="px-5 py-4 text-slate-600">{count}</td>
                    <td className="px-5 py-4">
                      <Badge tone={collection.featured ? "warning" : "neutral"}>{collection.featured ? "Featured" : "Regular"}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge tone={collection.active ? "success" : "neutral"}>{collection.active ? "Active" : "Inactive"}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <ActionButton label="Edit" icon={Pencil} onClick={() => setDraft(structuredClone(collection))} />
                        <ActionButton label="Delete" icon={Trash2} destructive onClick={() => setConfirming(collection)} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td className="px-5 py-10 text-sm text-slate-500" colSpan={7}>
                    No collections found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {draft && (
        <AdminModal title={draft.id ? "Edit Collection" : "Add Collection"} subtitle="Maintain collection banners and activation." onClose={() => setDraft(null)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Collection Name" required>
              <input className={inputClass} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            </Field>
            <Field label="Banner/Image" required>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
                  <span>Upload image</span>
                  <Plus className="size-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => void handleImageUpload(event.target.files?.[0] ?? null)}
                  />
                </label>
                <input
                  className={inputClass}
                  value={draft.image}
                  onChange={(event) => setDraft({ ...draft, image: event.target.value })}
                  placeholder="Or paste an image URL"
                />
                {draft.image ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <img src={draft.image} alt="Collection preview" className="h-32 w-full object-cover" />
                  </div>
                ) : null}
              </div>
            </Field>
            <Field label="Description" className="md:col-span-2">
              <textarea className={textAreaClass} rows={4} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
            </Field>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
              <input type="checkbox" checked={draft.featured} onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} className="size-4 accent-slate-900" />
              Featured collection
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
              <input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} className="size-4 accent-slate-900" />
              Active collection
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setDraft(null)} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (!draft.name || !draft.image) {
                  toast.error("Collection name and image are required.");
                  return;
                }
                upsertCollection(draft);
                toast.success("Collection saved successfully");
                setDraft(null);
              }}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Save Collection
            </button>
          </div>
        </AdminModal>
      )}

      {confirming && (
        <AdminConfirmModal
          title="Delete Collection"
          message="Are you sure you want to delete this item?"
          onClose={() => setConfirming(null)}
          onConfirm={() => {
            deleteCollection(confirming.id);
            toast.success("Collection deleted successfully");
            setConfirming(null);
          }}
        />
      )}
    </div>
  );
}

function Field({ label, required, className, children }: { label: string; required?: boolean; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <FieldLabel label={label} required={required}>
        {children}
      </FieldLabel>
    </div>
  );
}

function ActionButton({
  label,
  icon: Icon,
  destructive,
  onClick,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  destructive?: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={destructive ? "inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/80 px-3 py-2 text-xs font-semibold text-rose-700" : adminSecondaryButtonClass}>
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}


