import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { toast } from "sonner";

import { AdminModal, Badge, FieldLabel, adminPrimaryButtonClass, adminSectionClass, adminSecondaryButtonClass, inputClass, textAreaClass } from "@/components/admin/AdminUI";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/inventory")({
  component: AdminInventoryPage,
});

function AdminInventoryPage() {
  const { products, stockHistory, updateStock } = useStore();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [delta, setDelta] = useState(0);
  const [reason, setReason] = useState("");

  const rows = useMemo(
    () => products.filter((product) => query.trim() === "" || product.name.toLowerCase().includes(query.toLowerCase()) || product.sku.toLowerCase().includes(query.toLowerCase())),
    [products, query],
  );

  const selected = products.find((product) => product.id === editing) ?? null;

  return (
    <div className="space-y-6">
      <section className={adminSectionClass.replace("p-6", "p-5")}>
        <label className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
          <Search className="size-4 text-slate-500" />
          <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-900/35" placeholder="Search inventory..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
      </section>

      <section className="overflow-hidden rounded-[1.75rem] border border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-[color-mix(in_oklab,var(--ivory)_92%,white_8%)] shadow-[0_24px_60px_-40px_color-mix(in_oklab,var(--maroon)_36%,transparent)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[color-mix(in_oklab,var(--beige)_62%,white_38%)] text-[10px] uppercase tracking-[0.3em] text-maroon/65">
              <tr>
                <th className="px-5 py-4">Product Image</th>
                <th className="px-5 py-4">Product Name</th>
                <th className="px-5 py-4">SKU</th>
                <th className="px-5 py-4">Current Stock</th>
                <th className="px-5 py-4">Low Stock Limit</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Update Stock</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((product) => {
                const status = product.stock <= 0 ? "out-of-stock" : product.stock <= product.lowStockLimit ? "low-stock" : "in-stock";
                return (
                  <tr key={product.id} className="border-t border-slate-200">
                    <td className="px-5 py-4">
                      <img src={product.image} alt={product.name} className="size-14 rounded-2xl object-cover ring-1 ring-slate-200" />
                    </td>
                    <td className="px-5 py-4 font-medium">{product.name}</td>
                    <td className="px-5 py-4 text-slate-600">{product.sku}</td>
                    <td className="px-5 py-4 text-slate-600">{product.stock}</td>
                    <td className="px-5 py-4 text-slate-600">{product.lowStockLimit}</td>
                    <td className="px-5 py-4">
                      <Badge tone={status === "in-stock" ? "success" : status === "low-stock" ? "warning" : "danger"}>
                        {status === "in-stock" ? "In Stock" : status === "low-stock" ? "Low Stock" : "Out of Stock"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <button type="button" onClick={() => setEditing(product.id)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                        <Pencil className="size-3.5" />
                        Update
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td className="px-5 py-10 text-sm text-slate-500" colSpan={7}>
                    No inventory results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected && editing && (
        <AdminModal title="Update Stock" subtitle={selected.name} onClose={() => setEditing(null)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Info label="Previous Stock" value={String(selected.stock)} />
            <Info label="Product" value={selected.sku} />
            <Field label="Stock Change" required>
              <input type="number" className={inputClass} value={delta} onChange={(event) => setDelta(Number(event.target.value))} placeholder="Use negative numbers to reduce stock" />
            </Field>
            <Field label="Reason" required>
              <input className={inputClass} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Restock, damage, sale adjustment..." />
            </Field>
          </div>
          <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => setEditing(null)} className={adminSecondaryButtonClass}>
            Cancel
          </button>
            <button
              type="button"
              onClick={() => {
                updateStock(selected.id, delta, reason);
                toast.success("Stock updated successfully");
                setEditing(null);
                setDelta(0);
                setReason("");
              }}
              className={adminPrimaryButtonClass}
            >
              Save Stock Update
            </button>
          </div>
        </AdminModal>
      )}

      <section className={adminSectionClass}>
        <h2 className="font-display text-2xl text-slate-900">Stock History</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[color-mix(in_oklab,var(--gold)_12%,transparent)] text-[10px] uppercase tracking-[0.3em] text-maroon/65">
              <tr>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Previous</th>
                <th className="py-3 pr-4">Changed</th>
                <th className="py-3 pr-4">Updated</th>
                <th className="py-3 pr-4">Reason</th>
              </tr>
            </thead>
            <tbody>
              {stockHistory.map((entry) => (
                <tr key={entry.id} className="border-b border-slate-200">
                  <td className="py-3 pr-4 text-slate-600">{new Date(entry.date).toLocaleString()}</td>
                  <td className="py-3 pr-4 text-slate-600">{entry.previousStock}</td>
                  <td className="py-3 pr-4 text-slate-600">{entry.quantityChanged}</td>
                  <td className="py-3 pr-4 text-slate-600">{entry.updatedStock}</td>
                  <td className="py-3 pr-4 text-slate-600">{entry.reason}</td>
                </tr>
              ))}
              {stockHistory.length === 0 && (
                <tr>
                  <td className="py-8 text-sm text-slate-500" colSpan={5}>
                    No stock updates yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">{label}</p>
      <p className="mt-2 font-medium text-slate-900">{value}</p>
    </div>
  );
}


