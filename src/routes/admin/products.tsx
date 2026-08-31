import { createFileRoute } from "@tanstack/react-router";
import { Eye, Pencil, Plus, Search, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { toast } from "sonner";

import {
  AdminConfirmModal,
  AdminModal,
  Badge,
  FieldLabel,
  adminActionButtonClass,
  adminActionDangerButtonClass,
  adminPrimaryButtonClass,
  adminSearchFieldClass,
  adminSectionClass,
  adminTableHeadClass,
  adminTableShellClass,
  adminSecondaryButtonClass,
  inputClass,
  textAreaClass,
} from "@/components/admin/AdminUI";
import { useStore, formatPrice } from "@/lib/store";
import { createId, type ProductRecord } from "@/lib/site-data";

export const Route = createFileRoute("/admin/products")({
  component: AdminProductsPage,
});

type Draft = ProductRecord;

const emptyDraft = (categories: string[], collections: string[]): Draft => ({
  id: createId("product"),
  name: "",
  sku: "",
  category: categories[0] ?? "",
  collection: collections[0] ?? "",
  material: "",
  purity: "",
  occasion: "",
  price: 0,
  mrp: 0,
  rating: 4.8,
  image: "",
  images: [],
  description: "",
  weight: "",
  stone: "",
  badge: undefined,
  stock: 0,
  lowStockLimit: 5,
  active: true,
  featured: false,
  bestseller: false,
  newArrival: false,
});

export default function AdminProductsPage() {
  const { products, categories, collections, upsertProduct, deleteProduct, toggleProductActive } = useStore();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [viewing, setViewing] = useState<ProductRecord | null>(null);
  const [confirming, setConfirming] = useState<ProductRecord | null>(null);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery =
        query.trim() === "" ||
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.sku.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      const matchesCollection = collectionFilter === "all" || product.collection === collectionFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && product.active) ||
        (statusFilter === "inactive" && !product.active);
      return matchesQuery && matchesCategory && matchesCollection && matchesStatus;
    });
  }, [products, query, categoryFilter, collectionFilter, statusFilter]);

  const startCreate = () => setDraft(emptyDraft(categories.map((category) => category.name), collections.map((collection) => collection.name)));
  const startEdit = (product: ProductRecord) => setDraft(structuredClone(product));

  return (
    <div className="space-y-6">
      <section className={adminSectionClass}>
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Products</h2>
            <p className="text-sm text-slate-500">Search, filter, and manage your catalog entries.</p>
          </div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">
            {filtered.length} shown / {products.length} total
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_repeat(3,minmax(0,1fr))_auto] xl:items-end">
          <div className="min-w-0">
            <SearchField value={query} onChange={setQuery} placeholder="Search products..." />
          </div>
          <SelectField label="Category" value={categoryFilter} onChange={setCategoryFilter} options={["all", ...categories.map((category) => category.name)]} />
          <SelectField label="Collection" value={collectionFilter} onChange={setCollectionFilter} options={["all", ...collections.map((collection) => collection.name)]} />
          <SelectField label="Status" value={statusFilter} onChange={setStatusFilter} options={["all", "active", "inactive"]} />
          <button type="button" onClick={startCreate} className={`${adminPrimaryButtonClass} w-full xl:w-auto`}>
            <Plus className="size-4" />
            Add Product
          </button>
        </div>
      </section>

      <section className={adminTableShellClass}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className={adminTableHeadClass}>
              <tr>
                <th className="whitespace-nowrap px-5 py-4">Product Image</th>
                <th className="whitespace-nowrap px-5 py-4">Product Name</th>
                <th className="whitespace-nowrap px-5 py-4">SKU</th>
                <th className="whitespace-nowrap px-5 py-4">Category</th>
                <th className="whitespace-nowrap px-5 py-4">Selling Price</th>
                <th className="whitespace-nowrap px-5 py-4">Stock</th>
                <th className="whitespace-nowrap px-5 py-4">Status</th>
                <th className="whitespace-nowrap px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, index) => (
                <tr key={product.id} className={`border-t border-slate-100 transition hover:bg-slate-50/60 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}>
                  <td className="px-5 py-5 align-middle">
                    <img src={product.image} alt={product.name} className="size-12 rounded-xl object-cover ring-1 ring-slate-200" />
                  </td>
                  <td className="px-5 py-5 align-middle font-medium text-slate-900">{product.name}</td>
                  <td className="whitespace-nowrap px-5 py-5 align-middle text-slate-600">{product.sku}</td>
                  <td className="px-5 py-5 align-middle text-slate-600">{product.category}</td>
                  <td className="whitespace-nowrap px-5 py-5 align-middle text-slate-600">{formatPrice(product.price)}</td>
                  <td className="whitespace-nowrap px-5 py-5 align-middle text-slate-600">{product.stock}</td>
                  <td className="px-5 py-5 align-middle">
                    <Badge tone={product.active ? "success" : "neutral"}>{product.active ? "Active" : "Inactive"}</Badge>
                  </td>
                  <td className="px-5 py-5 align-middle">
                    <div className="flex flex-wrap justify-end gap-2">
                      <ActionButton icon={Eye} label="View" onClick={() => setViewing(product)} />
                      <ActionButton icon={Pencil} label="Edit" onClick={() => startEdit(product)} />
                      <ActionButton
                        icon={product.active ? ToggleLeft : ToggleRight}
                        label={product.active ? "Deactivate" : "Activate"}
                        onClick={() => {
                          toggleProductActive(product.id);
                          toast.success(`Product ${product.active ? "deactivated" : "activated"} successfully`);
                        }}
                      />
                      <ActionButton icon={Trash2} label="Delete" destructive onClick={() => setConfirming(product)} />
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="px-5 py-10 text-sm text-slate-500" colSpan={8}>
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {draft && (
        <ProductModal
          draft={draft}
          categories={categories.map((category) => category.name)}
          collections={collections.map((collection) => collection.name)}
          onClose={() => setDraft(null)}
          onChange={setDraft}
          onSave={async (next) => {
            await upsertProduct(next);
            toast.success("Product saved successfully");
            setDraft(null);
          }}
        />
      )}

      {viewing && (
        <AdminModal title={viewing.name} subtitle={viewing.sku} onClose={() => setViewing(null)} wide>
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <img src={viewing.image} alt={viewing.name} className="w-full rounded-[1.5rem] object-cover ring-1 ring-slate-200" />
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge tone={viewing.active ? "success" : "neutral"}>{viewing.active ? "Active" : "Inactive"}</Badge>
                {viewing.featured ? <Badge tone="warning">Featured</Badge> : null}
                {viewing.bestseller ? <Badge tone="warning">Bestseller</Badge> : null}
                {viewing.newArrival ? <Badge tone="warning">New Arrival</Badge> : null}
              </div>
              <p className="text-sm leading-7 text-slate-600">{viewing.description}</p>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ["Category", viewing.category],
                  ["Collection", viewing.collection],
                  ["Material", viewing.material],
                  ["Purity", viewing.purity],
                  ["Weight", viewing.weight],
                  ["Stone", viewing.stone],
                  ["Stock", String(viewing.stock)],
                  ["Selling Price", formatPrice(viewing.price)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">{label}</p>
                    <p className="mt-2 font-medium text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AdminModal>
      )}

      {confirming && (
        <AdminConfirmModal
          title="Delete Product"
          message="Are you sure you want to delete this item?"
          onClose={() => setConfirming(null)}
          onConfirm={() => {
            deleteProduct(confirming.id);
            toast.success("Product deleted successfully");
            setConfirming(null);
          }}
        />
      )}
    </div>
  );
}

function ProductModal({
  draft,
  categories,
  collections,
  onChange,
  onClose,
  onSave,
}: {
  draft: Draft;
  categories: string[];
  collections: string[];
  onChange: (draft: Draft) => void;
  onClose: () => void;
  onSave: (draft: Draft) => void;
}) {
  const discount = draft.mrp > 0 ? Math.max(0, Math.round(((draft.mrp - draft.price) / draft.mrp) * 100)) : 0;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const images = await Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          }),
      ),
    );
    onChange({ ...draft, images, image: images[0] ?? draft.image });
  };

  return (
    <AdminModal title={draft.id ? "Edit Product" : "Add Product"} subtitle="Manage product details and visibility." onClose={onClose} wide>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Product Name" required>
          <input className={inputClass} value={draft.name} onChange={(event) => onChange({ ...draft, name: event.target.value })} placeholder="Product name" />
        </Field>
        <Field label="SKU" required>
          <input className={inputClass} value={draft.sku} onChange={(event) => onChange({ ...draft, sku: event.target.value })} placeholder="SKU" />
        </Field>
        <Field label="Category" required>
          <select className={inputClass} value={draft.category} onChange={(event) => onChange({ ...draft, category: event.target.value })}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Collection" required>
          <select className={inputClass} value={draft.collection} onChange={(event) => onChange({ ...draft, collection: event.target.value })}>
            {collections.map((collection) => (
              <option key={collection} value={collection}>
                {collection}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Material">
          <input className={inputClass} value={draft.material} onChange={(event) => onChange({ ...draft, material: event.target.value })} placeholder="Gold, diamond, silver..." />
        </Field>
        <Field label="Purity">
          <input className={inputClass} value={draft.purity} onChange={(event) => onChange({ ...draft, purity: event.target.value })} placeholder="18K / 22K / 925" />
        </Field>
        <Field label="Weight">
          <input className={inputClass} value={draft.weight} onChange={(event) => onChange({ ...draft, weight: event.target.value })} placeholder="5.2 g" />
        </Field>
        <Field label="Stone">
          <input className={inputClass} value={draft.stone} onChange={(event) => onChange({ ...draft, stone: event.target.value })} placeholder="Diamond / Ruby / None" />
        </Field>
        <Field label="Original Price">
          <input type="number" className={inputClass} value={draft.mrp} onChange={(event) => onChange({ ...draft, mrp: Number(event.target.value) })} />
        </Field>
        <Field label="Selling Price">
          <input type="number" className={inputClass} value={draft.price} onChange={(event) => onChange({ ...draft, price: Number(event.target.value) })} />
        </Field>
        <Field label="Stock Quantity">
          <input type="number" className={inputClass} value={draft.stock} onChange={(event) => onChange({ ...draft, stock: Number(event.target.value) })} />
        </Field>
        <Field label="Low Stock Limit">
          <input type="number" className={inputClass} value={draft.lowStockLimit} onChange={(event) => onChange({ ...draft, lowStockLimit: Number(event.target.value) })} />
        </Field>
        <Field label="Discount">
          <input className={inputClass} value={`${discount}%`} readOnly />
        </Field>
        <Field label="Rating">
          <input type="number" step="0.1" className={inputClass} value={draft.rating} onChange={(event) => onChange({ ...draft, rating: Number(event.target.value) })} />
        </Field>
        <Field label="Description" className="md:col-span-2">
          <textarea className={textAreaClass} rows={4} value={draft.description} onChange={(event) => onChange({ ...draft, description: event.target.value })} />
        </Field>
        <Field label="Product Images" className="md:col-span-2">
          <input type="file" accept="image/*" multiple className={inputClass} onChange={(event) => void handleFiles(event.target.files)} />
          <div className="mt-3 flex flex-wrap gap-3">
            {(draft.images.length > 0 ? draft.images : [draft.image]).filter(Boolean).map((image) => (
              <img key={image} src={image} alt="preview" className="size-20 rounded-2xl object-cover ring-1 ring-slate-200" />
            ))}
          </div>
        </Field>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Toggle label="Featured" checked={draft.featured} onChange={(checked) => onChange({ ...draft, featured: checked })} />
        <Toggle label="Bestseller" checked={draft.bestseller} onChange={(checked) => onChange({ ...draft, bestseller: checked })} />
        <Toggle label="New Arrival" checked={draft.newArrival} onChange={(checked) => onChange({ ...draft, newArrival: checked })} />
        <Toggle label="Active" checked={draft.active} onChange={(checked) => onChange({ ...draft, active: checked })} />
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button type="button" onClick={onClose} className={adminSecondaryButtonClass}>
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            if (!draft.name || !draft.sku || !draft.category || !draft.collection) {
              toast.error("Please complete the required fields.");
              return;
            }
            onSave({
              ...draft,
              badge: discount > 0 ? `${discount}% OFF` : draft.badge,
              image: draft.images[0] ?? draft.image,
            });
          }}
          className={adminPrimaryButtonClass}
        >
          Save Product
        </button>
      </div>
    </AdminModal>
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

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
        checked ? "border-slate-300 bg-slate-50 text-slate-900" : "border-slate-200 bg-white text-slate-600"
      }`}
    >
      <span>{label}</span>
      <span className={`inline-flex size-5 items-center justify-center rounded-full ${checked ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500"}`}>
        {checked ? "✓" : "·"}
      </span>
    </button>
  );
}

function SearchField({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className={adminSearchFieldClass}>
      <Search className="size-4 text-slate-500" />
      <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.35em] text-slate-500">{label}</span>
      <select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all" ? `All ${label}` : option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ActionButton({
  icon: Icon,
  label,
  destructive,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  destructive?: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={destructive ? adminActionDangerButtonClass : adminActionButtonClass}>
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}

