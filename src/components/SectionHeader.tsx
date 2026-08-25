import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = "center",
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: string;
  align?: "center" | "left" | "split";
  action?: ReactNode;
}) {
  if (align === "split") {
    return (
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gold/20 pb-6">
        <div>
          {eyebrow && <span className="text-gold uppercase tracking-[0.3em] text-[10px] font-bold">{eyebrow}</span>}
          <h2 className="font-display text-3xl md:text-5xl text-maroon mt-2 leading-tight">{title}</h2>
        </div>
        {action}
      </div>
    );
  }
  return (
    <div className={`mb-16 ${align === "center" ? "text-center" : ""}`}>
      {eyebrow && <span className="text-gold uppercase tracking-[0.3em] text-[10px] font-bold">{eyebrow}</span>}
      <h2 className="font-display text-3xl md:text-5xl text-maroon mt-3 leading-tight text-balance">{title}</h2>
      {intro && <p className={`mt-4 text-sm md:text-base text-charcoal/65 max-w-xl ${align === "center" ? "mx-auto" : ""} text-pretty`}>{intro}</p>}
      <div className={`hairline w-24 mt-6 ${align === "center" ? "mx-auto" : ""}`} />
    </div>
  );
}
