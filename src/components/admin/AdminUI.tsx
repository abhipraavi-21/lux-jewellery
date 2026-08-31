import { X } from "lucide-react";
import type { ReactNode } from "react";

export function AdminModal({
  title,
  subtitle,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-charcoal/45 px-4 py-6 backdrop-blur-sm">
      <div
        className={`w-full ${
          wide ? "max-w-5xl" : "max-w-3xl"
        } max-h-[92vh] overflow-y-auto rounded-[1.75rem] border border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-[color-mix(in_oklab,var(--ivory)_92%,white_8%)] shadow-[0_36px_80px_-40px_color-mix(in_oklab,var(--maroon)_50%,transparent)]`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[color-mix(in_oklab,var(--gold)_14%,transparent)] px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-maroon/55">Admin Panel</p>
            <h3 className="mt-2 text-xl font-semibold text-charcoal">{title}</h3>
            {subtitle ? <p className="mt-1 text-sm text-charcoal/55">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full border border-[color-mix(in_oklab,var(--gold)_18%,transparent)] text-charcoal/60 hover:bg-beige/60 hover:text-maroon"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function AdminConfirmModal({
  title,
  message,
  onClose,
  onConfirm,
  confirmLabel = "Delete",
}: {
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}) {
  return (
    <AdminModal title={title} subtitle={message} onClose={onClose}>
      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-[color-mix(in_oklab,var(--gold)_18%,transparent)] bg-white/70 px-5 py-3 text-sm font-semibold text-charcoal/80 hover:bg-beige/60 hover:text-maroon"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-full bg-maroon px-5 py-3 text-sm font-semibold text-ivory shadow-[0_16px_30px_-18px_color-mix(in_oklab,var(--maroon)_60%,transparent)] hover:bg-maroon-deep"
        >
          {confirmLabel}
        </button>
      </div>
    </AdminModal>
  );
}

export function FieldLabel({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.35em] text-maroon/55">
        {label}
        {required ? <span className="text-maroon"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-2xl border border-[color-mix(in_oklab,var(--gold)_18%,transparent)] bg-white/80 px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-charcoal/35 focus:border-maroon focus:ring-2 focus:ring-gold/30";
export const textAreaClass =
  "w-full rounded-2xl border border-[color-mix(in_oklab,var(--gold)_18%,transparent)] bg-white/80 px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-charcoal/35 focus:border-maroon focus:ring-2 focus:ring-gold/30";

export const adminCanvasClass =
  "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),_transparent_34%),linear-gradient(180deg,#fff8ef_0%,#fbf4e8_40%,#f4ede2_100%)] text-charcoal";
export const adminSurfaceClass =
  "rounded-[1.75rem] border border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-[color-mix(in_oklab,var(--ivory)_90%,white_10%)] shadow-[0_24px_60px_-36px_color-mix(in_oklab,var(--maroon)_42%,transparent)] backdrop-blur";
export const adminSectionClass = `${adminSurfaceClass} p-6`;
export const adminTableShellClass =
  "overflow-hidden rounded-[1.75rem] border border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-[color-mix(in_oklab,var(--ivory)_92%,white_8%)] shadow-[0_24px_60px_-40px_color-mix(in_oklab,var(--maroon)_36%,transparent)]";
export const adminTableHeadClass =
  "bg-[color-mix(in_oklab,var(--beige)_62%,white_38%)] text-[10px] uppercase tracking-[0.3em] text-maroon/65";
export const adminSearchFieldClass =
  "flex items-center gap-3 rounded-full border border-[color-mix(in_oklab,var(--gold)_18%,transparent)] bg-white/80 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]";
export const adminSecondaryButtonClass =
  "inline-flex min-h-12 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--gold)_20%,transparent)] bg-[color-mix(in_oklab,var(--ivory)_84%,white_16%)] px-4 text-xs font-semibold text-charcoal/80 transition hover:border-gold hover:bg-beige/70 hover:text-maroon";
export const adminPrimaryButtonClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-maroon px-5 text-sm font-semibold text-ivory shadow-[0_16px_30px_-16px_color-mix(in_oklab,var(--maroon)_58%,transparent)] transition hover:bg-maroon-deep hover:shadow-[0_18px_36px_-16px_color-mix(in_oklab,var(--maroon)_64%,transparent)]";
export const adminActionButtonClass =
  "inline-flex min-h-10 items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-white/80 px-3 text-xs font-semibold text-charcoal/75 transition hover:border-gold/35 hover:bg-beige/60 hover:text-maroon";
export const adminActionDangerButtonClass =
  "inline-flex min-h-10 items-center gap-2 rounded-full border border-rose-200 bg-rose-50/80 px-3 text-xs font-semibold text-rose-700";

export function Badge({
  tone,
  children,
}: {
  tone: "success" | "warning" | "danger" | "neutral";
  children: ReactNode;
}) {
  const className =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "warning"
        ? "bg-[color-mix(in_oklab,var(--gold)_20%,white_80%)] text-maroon ring-[color-mix(in_oklab,var(--gold)_34%,transparent)]"
        : tone === "danger"
          ? "bg-rose-50 text-rose-700 ring-rose-200"
          : "bg-[color-mix(in_oklab,var(--beige)_72%,white_28%)] text-charcoal/75 ring-[color-mix(in_oklab,var(--gold)_16%,transparent)]";
  return <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] ring-1 ${className}`}>{children}</span>;
}

