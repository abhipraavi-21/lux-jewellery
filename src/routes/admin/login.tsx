import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, KeyRound, LockKeyhole, Mail, Shield } from "lucide-react";
import { useState, type ComponentType, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { toast } from "sonner";

import { adminCanvasClass, adminPrimaryButtonClass, adminSectionClass, inputClass } from "@/components/admin/AdminUI";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const { loginAdmin } = useStore();
  const [email, setEmail] = useState("admin@luxjewellery.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setSubmitting(true);
    const result = loginAdmin(email, password, rememberMe);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      toast.error(result.message);
      return;
    }

    toast.success("Login successful");
    await navigate({ to: "/admin", replace: true });
  };

  return (
    <div className={`${adminCanvasClass} grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]`}>
      <section className="hidden flex-col justify-between border-r border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-[linear-gradient(165deg,color-mix(in_oklab,var(--maroon)_96%,black_4%)_0%,color-mix(in_oklab,var(--maroon-deep)_94%,black_6%)_100%)] p-10 text-ivory lg:flex xl:p-16">
        <div>
          <p className="text-[10px] uppercase tracking-[0.45em] text-gold/80">Aurelia Admin Studio</p>
          <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-[0.95] text-balance">
            Luxury commerce,
            <span className="text-gold-soft"> controlled with clarity.</span>
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-7 text-ivory/80">
            Manage jewellery products, enquiries, homepage content, and settings from one calm dashboard that mirrors the storefront's luxury tone.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8 text-sm">
          <Stat label="Products" value="Live CRUD" />
          <Stat label="Visibility" value="Instant Sync" />
          <Stat label="Access" value="Role Based" />
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-12 md:px-8 lg:px-12">
        <div className={`${adminSectionClass} w-full max-w-md`}>
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-white/75 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-maroon/60">
              <Shield className="size-3.5" />
              Admin Login
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-charcoal">Welcome back</h2>
            <p className="mt-2 text-sm text-charcoal/60">Sign in to manage the site.</p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <Field label="Email" icon={Mail} value={email} onChange={setEmail} type="email" placeholder="admin@luxjewellery.com" />
            <Field
              label="Password"
              icon={LockKeyhole}
              value={password}
              onChange={setPassword}
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              rightAction={
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-[10px] uppercase tracking-[0.3em] text-charcoal/55 hover:text-maroon"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              }
            />

            <label className="flex items-center gap-3 rounded-2xl border border-[color-mix(in_oklab,var(--gold)_14%,transparent)] bg-white/75 px-4 py-3 text-sm">
              <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="size-4 accent-maroon" />
              Remember me
            </label>

            {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

            <button type="submit" disabled={submitting} className={`${adminPrimaryButtonClass} w-full`}>
              {submitting ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  rightAction,
  value,
  onChange,
  ...rest
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  rightAction?: ReactNode;
  value: string;
  onChange: (value: string) => void;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.35em] text-maroon/55">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-[color-mix(in_oklab,var(--gold)_18%,transparent)] bg-white/80 px-4 py-3 focus-within:border-maroon focus-within:ring-2 focus-within:ring-gold/30">
        <Icon className="size-4 shrink-0 text-maroon/55" />
        <input
          {...rest}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full bg-transparent text-sm outline-none placeholder:text-charcoal/35 ${inputClass}`}
        />
        {rightAction}
      </div>
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-[10px] uppercase tracking-[0.35em] text-gold/80">{label}</p>
      <p className="mt-3 text-xl font-semibold text-ivory">{value}</p>
    </div>
  );
}
