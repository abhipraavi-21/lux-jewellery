import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Aurelia Heritage" },
      { name: "description", content: "Access your Aurelia account." },
      { property: "og:url", content: "/login" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"signin" | "register">("signin");
  return (
    <section className="min-h-[80vh] grid lg:grid-cols-2">
      <div className="bg-maroon text-ivory flex flex-col justify-center p-12 lg:p-20">
        <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">Members Only</span>
        <h1 className="font-display text-4xl md:text-6xl mt-4 leading-tight text-balance">The Aurelia <span className="italic">Inner Circle</span></h1>
        <p className="text-ivory/70 mt-6 max-w-md leading-relaxed">Track your orders, save your wishlist, and receive private invitations to our seasonal collection previews.</p>
        <ul className="mt-8 space-y-3 text-sm text-ivory/80">
          {["Early access to new arrivals", "Private atelier appointments", "Birthday & anniversary gifts", "Members-only events"].map((x) => (
            <li key={x} className="flex gap-3 items-center"><span className="size-1.5 bg-gold rounded-full" />{x}</li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-center p-8 md:p-16 bg-ivory">
        <div className="w-full max-w-sm">
          <div className="flex gap-1 mb-8 bg-beige/40 p-1">
            <button onClick={() => setMode("signin")} className={`flex-1 py-3 text-[10px] uppercase tracking-[0.3em] font-bold transition-all ${mode === "signin" ? "bg-maroon text-ivory" : "text-charcoal/60"}`}>Sign In</button>
            <button onClick={() => setMode("register")} className={`flex-1 py-3 text-[10px] uppercase tracking-[0.3em] font-bold transition-all ${mode === "register" ? "bg-maroon text-ivory" : "text-charcoal/60"}`}>Register</button>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {mode === "register" && <Input label="Full Name" required />}
            <Input label="Email" type="email" required />
            <Input label="Password" type="password" required />
            {mode === "signin" && (
              <div className="text-right">
                <a href="#" className="text-[10px] uppercase tracking-[0.3em] text-charcoal/60 hover:text-maroon">Forgot password?</a>
              </div>
            )}
            <button className="w-full bg-maroon text-ivory py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-charcoal transition-colors">{mode === "signin" ? "Sign In" : "Create Account"}</button>
          </form>

          <p className="mt-6 text-center text-xs text-charcoal/55">
            By continuing you agree to our <Link to="/about" className="text-maroon underline">Terms</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}

function Input({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-charcoal/70">{label}</span>
      <input {...rest} className="mt-2 w-full bg-white ring-1 ring-gold/20 focus:ring-gold outline-none px-4 py-3 text-sm" />
    </label>
  );
}
