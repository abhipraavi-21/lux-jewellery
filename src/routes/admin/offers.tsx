import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { AdminConfirmModal, AdminModal, Badge, FieldLabel, adminPrimaryButtonClass, adminSectionClass, adminSecondaryButtonClass, inputClass, textAreaClass } from "@/components/admin/AdminUI";
import { useStore } from "@/lib/store";
import { createId, type OfferRecord } from "@/lib/site-data";

export const Route = createFileRoute("/admin/offers")({
  component: AdminOffersPage,
});

const emptyOffer = (): OfferRecord => ({
  id: createId("offer"),
  offerName: "",
  couponCode: "",
  discountPercentage: 10,
  startDate: new Date().toISOString().slice(0, 10),
  expiryDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  applyTo: "all",
  selectionIds: [],
  active: true,
});

function AdminOffersPage() {
  const { offers, categories, products, upsertOffer, deleteOffer } = useStore();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<OfferRecord | null>(null);
  const [confirming, setConfirming] = useState<OfferRecord | null>(null);

  const rows = useMemo(
    () =>
      offers.filter((offer) => query.trim() === "" || offer.offerName.toLowerCase().includes(query.toLowerCase()) || offer.couponCode.toLowerCase().includes(query.toLowerCase())),
    [offers, query],
  );

  return (
    <div className="space-y-6">
      <section className={adminSectionClass.replace("p-6", "p-5")}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <label className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
            <Search className="size-4 text-slate-500" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-900/35" placeholder="Search offers..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <button
            type="button"
            onClick={() => setDraft(emptyOffer())}
          className={adminPrimaryButtonClass}
          >
            <Plus className="size-4" />
            Add Offer
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.75rem] border border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-[color-mix(in_oklab,var(--ivory)_92%,white_8%)] shadow-[0_24px_60px_-40px_color-mix(in_oklab,var(--maroon)_36%,transparent)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[color-mix(in_oklab,var(--beige)_62%,white_38%)] text-[10px] uppercase tracking-[0.3em] text-maroon/65">
              <tr>
                <th className="px-5 py-4">Offer Name</th>
                <th className="px-5 py-4">Coupon Code</th>
                <th className="px-5 py-4">Discount</th>
                <th className="px-5 py-4">Dates</th>
                <th className="px-5 py-4">Apply To</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((offer) => {
                const expired = offer.expiryDate < new Date().toISOString().slice(0, 10);
                return (
                  <tr key={offer.id} className="border-t border-slate-200">
                    <td className="px-5 py-4 font-medium">{offer.offerName}</td>
                    <td className="px-5 py-4 text-slate-600">{offer.couponCode}</td>
                    <td className="px-5 py-4 text-slate-600">{offer.discountPercentage}%</td>
                    <td className="px-5 py-4 text-slate-600">
                      {offer.startDate} to {offer.expiryDate}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{offer.applyTo}</td>
                    <td className="px-5 py-4">
                      <Badge tone={expired ? "danger" : offer.active ? "success" : "neutral"}>{expired ? "Expired" : offer.active ? "Active" : "Inactive"}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <ActionButton icon={Pencil} label="Edit" onClick={() => setDraft(structuredClone(offer))} />
                        <ActionButton icon={Trash2} label="Delete" destructive onClick={() => setConfirming(offer)} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td className="px-5 py-10 text-sm text-slate-500" colSpan={7}>
                    No offers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {draft && (
        <AdminModal title={draft.id ? "Edit Offer" : "Add Offer"} subtitle="Manage coupon rules and dates." onClose={() => setDraft(null)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Offer Name" required>
              <input className={inputClass} value={draft.offerName} onChange={(event) => setDraft({ ...draft, offerName: event.target.value })} />
            </Field>
            <Field label="Coupon Code" required>
              <input className={inputClass} value={draft.couponCode} onChange={(event) => setDraft({ ...draft, couponCode: event.target.value.toUpperCase() })} />
            </Field>
            <Field label="Discount Percentage">
              <input type="number" className={inputClass} value={draft.discountPercentage} onChange={(event) => setDraft({ ...draft, discountPercentage: Number(event.target.value) })} />
            </Field>
            <Field label="Apply To">
              <select className={inputClass} value={draft.applyTo} onChange={(event) => setDraft({ ...draft, applyTo: event.target.value as OfferRecord["applyTo"] })}>
                <option value="all">All</option>
                <option value="product">Product</option>
                <option value="category">Category</option>
              </select>
            </Field>
            <Field label="Start Date">
              <input type="date" className={inputClass} value={draft.startDate} onChange={(event) => setDraft({ ...draft, startDate: event.target.value })} />
            </Field>
            <Field label="Expiry Date">
              <input type="date" className={inputClass} value={draft.expiryDate} onChange={(event) => setDraft({ ...draft, expiryDate: event.target.value })} />
            </Field>
            <Field label="Selection">
              <select multiple className="min-h-32 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200" value={draft.selectionIds} onChange={(event) => setDraft({ ...draft, selectionIds: Array.from(event.target.selectedOptions, (option) => option.value) })}>
                {draft.applyTo === "category"
                  ? categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)
                  : products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
              </select>
            </Field>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
              <input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} className="size-4 accent-slate-900" />
              Active offer
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => setDraft(null)} className={adminSecondaryButtonClass}>
            Cancel
          </button>
            <button
              type="button"
              onClick={() => {
                if (!draft.offerName || !draft.couponCode) {
                  toast.error("Offer name and coupon code are required.");
                  return;
                }
                upsertOffer(draft);
                toast.success("Offer saved successfully");
                setDraft(null);
              }}
              className={adminPrimaryButtonClass}
            >
              Save Offer
            </button>
          </div>
        </AdminModal>
      )}

      {confirming && (
        <AdminConfirmModal
          title="Delete Offer"
          message="Are you sure you want to delete this item?"
          onClose={() => setConfirming(null)}
          onConfirm={() => {
            deleteOffer(confirming.id);
            toast.success("Offer deleted successfully");
            setConfirming(null);
          }}
        />
      )}
    </div>
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
    <button type="button" onClick={onClick} className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${destructive ? "border-rose-200 bg-rose-50 text-rose-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}


