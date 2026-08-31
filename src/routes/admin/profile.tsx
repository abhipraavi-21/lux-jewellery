import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KeyRound, Shield, UserCircle2 } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { FieldLabel, adminPrimaryButtonClass, adminSectionClass, inputClass } from "@/components/admin/AdminUI";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/profile")({
  component: AdminProfilePage,
});

function AdminProfilePage() {
  const { currentAdmin, changePassword, logoutAdmin } = useStore();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
      <section className={adminSectionClass}>
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-full bg-maroon text-ivory shadow-[0_16px_30px_-18px_color-mix(in_oklab,var(--maroon)_70%,transparent)]">
            <UserCircle2 className="size-7" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-maroon/55">Admin Profile</p>
            <h2 className="mt-2 font-display text-2xl text-charcoal">{currentAdmin?.name ?? "Admin"}</h2>
            <p className="text-sm text-charcoal/60">{currentAdmin?.email ?? "No active session"}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 rounded-2xl border border-[color-mix(in_oklab,var(--gold)_12%,transparent)] bg-white/75 p-4 text-sm">
          <InfoRow label="Role" value={currentAdmin?.role ?? "guest"} />
          <InfoRow label="Permission model" value="Expandable" />
          <InfoRow label="Security" value="Password protected" />
        </div>

        <button
          type="button"
          onClick={() => {
            logoutAdmin();
            void navigate({ to: "/admin/login" });
          }}
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--gold)_20%,transparent)] bg-white/75 px-5 text-sm font-semibold text-charcoal/80 hover:bg-beige/60 hover:text-maroon"
        >
          Logout
        </button>
      </section>

      <section className={adminSectionClass}>
        <p className="text-[10px] uppercase tracking-[0.35em] text-maroon/55">Security</p>
        <h2 className="mt-2 font-display text-2xl text-charcoal">Change Password</h2>
        <div className="mt-6 space-y-4">
          <Field label="Current Password">
            <input className={inputClass} type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
          </Field>
          <Field label="New Password">
            <input className={inputClass} type="password" value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} />
          </Field>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              const result = changePassword(currentPassword, nextPassword);
              if (!result.ok) {
                toast.error(result.message);
                return;
              }
              toast.success("Password updated successfully");
              setCurrentPassword("");
              setNextPassword("");
            }}
            className={adminPrimaryButtonClass}
          >
            <KeyRound className="size-4" />
            Update Password
          </button>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <FieldLabel label={label}>{children}</FieldLabel>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[color-mix(in_oklab,var(--gold)_10%,transparent)] bg-[color-mix(in_oklab,var(--beige)_52%,white_48%)] px-4 py-3">
      <span className="text-charcoal/55">{label}</span>
      <span className="font-semibold text-charcoal">{value}</span>
    </div>
  );
}

