import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Phone, Search, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { AdminModal, Badge, FieldLabel, adminPrimaryButtonClass, adminSectionClass, inputClass, textAreaClass } from "@/components/admin/AdminUI";
import { useStore } from "@/lib/store";

const statusOrder = ["new", "contacted", "interested", "converted", "closed"] as const;

export const Route = createFileRoute("/admin/enquiries")({
  component: AdminEnquiriesPage,
});

function AdminEnquiriesPage() {
  const { enquiries, updateEnquiry } = useStore();
  const [filter, setFilter] = useState<(typeof statusOrder)[number] | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      enquiries.filter((enquiry) => {
        const matchesQuery =
          query.trim() === "" ||
          enquiry.customerName.toLowerCase().includes(query.toLowerCase()) ||
          enquiry.phone.toLowerCase().includes(query.toLowerCase()) ||
          enquiry.requirement.toLowerCase().includes(query.toLowerCase());
        const matchesFilter = filter === "all" || enquiry.status === filter;
        return matchesQuery && matchesFilter;
      }),
    [enquiries, filter, query],
  );

  const selected = enquiries.find((enquiry) => enquiry.id === selectedId) ?? null;

  return (
    <div className="space-y-6">
      <section className={adminSectionClass.replace("p-6", "p-5")}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <label className="flex w-full max-w-md items-center gap-3 rounded-full border border-[color-mix(in_oklab,var(--gold)_18%,transparent)] bg-white/80 px-4 py-3">
            <Search className="size-4 text-maroon/55" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-charcoal/35" placeholder="Search enquiries..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <div className="flex flex-wrap gap-2">
            {(["all", ...statusOrder] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] ${
                  filter === status
                    ? "bg-maroon text-ivory"
                    : "border border-[color-mix(in_oklab,var(--gold)_18%,transparent)] bg-white/75 text-charcoal/70 hover:bg-beige/60 hover:text-maroon"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.75rem] border border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-[color-mix(in_oklab,var(--ivory)_92%,white_8%)] shadow-[0_24px_60px_-40px_color-mix(in_oklab,var(--maroon)_36%,transparent)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[color-mix(in_oklab,var(--beige)_62%,white_38%)] text-[10px] uppercase tracking-[0.3em] text-maroon/65">
              <tr>
                <th className="px-5 py-4">Customer Name</th>
                <th className="px-5 py-4">Mobile</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Requirement</th>
                <th className="px-5 py-4">Budget</th>
                <th className="px-5 py-4">Enquiry Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((enquiry) => (
                <tr key={enquiry.id} className="border-t border-slate-200">
                  <td className="px-5 py-4 font-medium">{enquiry.customerName}</td>
                  <td className="px-5 py-4 text-slate-600">{enquiry.phone}</td>
                  <td className="px-5 py-4 text-slate-600">{enquiry.email}</td>
                  <td className="px-5 py-4 text-slate-600">{enquiry.requirement}</td>
                  <td className="px-5 py-4 text-slate-600">{enquiry.budget}</td>
                  <td className="px-5 py-4 text-slate-600">{enquiry.enquiryDate}</td>
                  <td className="px-5 py-4">
                    <Badge tone={enquiry.status === "converted" ? "success" : enquiry.status === "closed" ? "danger" : enquiry.status === "new" ? "warning" : "neutral"}>{enquiry.status}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <button type="button" onClick={() => setSelectedId(enquiry.id)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-5 py-10 text-sm text-slate-500" colSpan={8}>
                    No enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected && (
        <AdminModal title={selected.customerName} subtitle={selected.phone} onClose={() => setSelectedId(null)} wide>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Customer Name", selected.customerName],
              ["Phone", selected.phone],
              ["Email", selected.email],
              ["Budget", selected.budget],
              ["Requirement", selected.requirement],
              ["Date", selected.enquiryDate],
            ].map(([label, value]) => (
              <Card key={label} label={label} value={value} />
            ))}
            <div className="md:col-span-2 rounded-2xl border border-[color-mix(in_oklab,var(--gold)_12%,transparent)] bg-white/75 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.35em] text-maroon/55">Message</p>
              <p className="mt-2 text-sm leading-7 text-charcoal/70">{selected.message}</p>
            </div>
            <div className="md:col-span-2">
              <FieldLabel label="Admin Notes">
                <textarea
                  className={textAreaClass}
                  rows={4}
                  value={selected.adminNotes}
                  onChange={(event) => updateEnquiry(selected.id, { adminNotes: event.target.value })}
                  placeholder="Add internal notes..."
                />
              </FieldLabel>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {statusOrder.map((status, index) => {
              const active = selected.status === status;
              const nextDisabled = index > 0 && selected.status !== statusOrder[index - 1] && selected.status !== status;
              return (
                <button
                  key={status}
                  type="button"
                  disabled={nextDisabled}
                  onClick={() => updateEnquiry(selected.id, { status })}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] ${
                    active ? "bg-maroon text-ivory" : "border border-[color-mix(in_oklab,var(--gold)_18%,transparent)] bg-white/75 text-charcoal/70 hover:bg-beige/60 hover:text-maroon"
                  } disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  {status}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Shortcut href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`} label="WhatsApp" icon={MessageCircle} />
              <Shortcut href={`tel:${selected.phone}`} label="Call" icon={Phone} />
            </div>
            <button
              type="button"
              onClick={() => {
                toast.success("Enquiry updated");
                setSelectedId(null);
              }}
              className={adminPrimaryButtonClass}
            >
              Save Changes
            </button>
          </div>
        </AdminModal>
      )}
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[color-mix(in_oklab,var(--gold)_12%,transparent)] bg-white/75 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.35em] text-maroon/55">{label}</p>
      <p className="mt-2 font-medium text-charcoal">{value}</p>
    </div>
  );
}

function Shortcut({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--gold)_18%,transparent)] bg-white/75 px-4 py-2 text-xs font-semibold text-charcoal/70 hover:bg-beige/60 hover:text-maroon">
      <Icon className="size-3.5" />
      {label}
    </a>
  );
}


