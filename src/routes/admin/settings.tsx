import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { FieldLabel, adminPrimaryButtonClass, adminSectionClass, inputClass, textAreaClass } from "@/components/admin/AdminUI";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const { settings, updateSettings } = useStore();
  const [draft, setDraft] = useState(settings);

  return (
    <div className={adminSectionClass}>
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-maroon/55">Brand Settings</p>
          <h2 className="mt-2 font-display text-2xl text-charcoal">Website Settings</h2>
        </div>
        <p className="text-sm text-charcoal/55">Update business details, contact info, and social links.</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {[
          ["Website Logo", "websiteLogo"],
          ["Business Name", "businessName"],
          ["Phone Number", "phoneNumber"],
          ["WhatsApp Number", "whatsappNumber"],
          ["Email", "email"],
          ["Address", "address"],
          ["Facebook URL", "facebookUrl"],
          ["Instagram URL", "instagramUrl"],
          ["YouTube URL", "youtubeUrl"],
          ["Other Social Links", "otherLinks"],
        ].map(([label, key]) => (
          <Field key={key} label={label}>
            <input className={inputClass} value={(draft as Record<string, string>)[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} />
          </Field>
        ))}
        <Field label="Business Information" className="md:col-span-2">
          <textarea className={textAreaClass} rows={5} value={draft.businessInformation} onChange={(event) => setDraft({ ...draft, businessInformation: event.target.value })} />
        </Field>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => {
            updateSettings(draft);
            toast.success("Settings saved successfully");
          }}
          className={adminPrimaryButtonClass}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <FieldLabel label={label}>{children}</FieldLabel>
    </div>
  );
}

