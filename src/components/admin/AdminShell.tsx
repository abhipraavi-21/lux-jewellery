import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Boxes,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings2,
  Shield,
  Sparkles,
  Tag,
  X,
  UserCircle2,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { adminCanvasClass, adminSearchFieldClass, adminSecondaryButtonClass } from "@/components/admin/AdminUI";
import { useStore } from "@/lib/store";

export type AdminNavItem = {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
};

const navItems: AdminNavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Categories", to: "/admin/categories", icon: Grid2X2 },
  { label: "Collections", to: "/admin/collections", icon: Boxes },
  { label: "Inventory", to: "/admin/inventory", icon: BarChart3 },
  { label: "Enquiries", to: "/admin/enquiries", icon: Bell },
  { label: "Offers & Discounts", to: "/admin/offers", icon: Tag },
  { label: "Homepage Management", to: "/admin/homepage", icon: Sparkles },
  { label: "Website Settings", to: "/admin/settings", icon: Settings2 },
  { label: "Admin Profile", to: "/admin/profile", icon: UserCircle2 },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { currentAdmin, logoutAdmin, dashboardMetrics, homepage, settings } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const currentNav = useMemo(() => {
    const match = navItems.find((item) => (item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to)));
    return match ?? navItems[0];
  }, [pathname]);

  const liveSections = Object.values(homepage.sectionVisibility).filter(Boolean).length;
  const homepageBanners = homepage.heroBanners.filter((banner) => banner.active).length;

  const handleLogout = () => {
    logoutAdmin();
    void navigate({ to: "/admin/login" });
  };

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  return (
    <div className={`${adminCanvasClass} overflow-x-hidden`}>
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 hidden border-r border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-[color-mix(in_oklab,var(--ivory)_88%,white_12%)]/90 backdrop-blur-xl transition-all duration-300 lg:flex lg:flex-col ${
            collapsed ? "w-24" : "w-[19rem]"
          }`}
        >
          <div className="flex h-20 items-center justify-between border-b border-[color-mix(in_oklab,var(--gold)_14%,transparent)] px-5">
            <Link to="/admin" className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
              <div className="grid size-10 place-items-center rounded-2xl bg-maroon text-ivory shadow-[0_16px_30px_-18px_color-mix(in_oklab,var(--maroon)_70%,transparent)]">
                <Shield className="size-5" />
              </div>
              {!collapsed && (
                <div>
                  <p className="text-sm font-semibold tracking-[0.22em] text-charcoal">AURELIA</p>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-maroon/55">Admin Studio</p>
                </div>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="grid size-9 place-items-center rounded-full border border-[color-mix(in_oklab,var(--gold)_18%,transparent)] text-charcoal/60 hover:bg-beige/60 hover:text-maroon"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "border-[color-mix(in_oklab,var(--gold)_20%,transparent)] bg-maroon text-ivory shadow-[0_12px_28px_-18px_color-mix(in_oklab,var(--maroon)_70%,transparent)]"
                      : "border-transparent text-charcoal/70 hover:border-[color-mix(in_oklab,var(--gold)_12%,transparent)] hover:bg-beige/55 hover:text-maroon"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <Icon className="size-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-4 border-t border-[color-mix(in_oklab,var(--gold)_14%,transparent)] p-4">
            <div className={`rounded-2xl border border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-[color-mix(in_oklab,var(--beige)_62%,white_38%)] px-4 py-4 ${collapsed ? "text-center" : ""}`}>
              <p className="text-[10px] uppercase tracking-[0.32em] text-maroon/55">Signed in as</p>
              <p className="mt-2 font-medium text-charcoal">{currentAdmin?.name ?? "Admin"}</p>
              {!collapsed && <p className="mt-1 text-xs text-charcoal/55">{currentAdmin?.email ?? "No active session"}</p>}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className={`flex w-full items-center gap-3 rounded-2xl border border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-white/75 px-4 py-3 text-sm font-semibold text-charcoal/75 hover:border-gold hover:bg-beige/60 hover:text-maroon ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <LogOut className="size-4" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-charcoal/45 lg:hidden" onClick={() => setMobileOpen(false)}>
            <aside
              className="absolute inset-y-0 left-0 w-[86%] max-w-sm border-r border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-[color-mix(in_oklab,var(--ivory)_92%,white_8%)] p-4 shadow-[0_36px_80px_-40px_color-mix(in_oklab,var(--maroon)_55%,transparent)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[color-mix(in_oklab,var(--gold)_14%,transparent)] pb-4">
                <div>
                  <p className="text-sm font-semibold tracking-[0.22em] text-charcoal">AURELIA</p>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-maroon/55">Admin Studio</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="grid size-9 place-items-center rounded-full border border-[color-mix(in_oklab,var(--gold)_18%,transparent)] text-charcoal/65 hover:bg-beige/60 hover:text-maroon"
                >
                  <X className="size-4" />
                </button>
              </div>
              <nav className="space-y-1 py-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                        active ? "bg-maroon text-ivory" : "text-charcoal/70 hover:bg-beige/55 hover:text-maroon"
                      }`}
                    >
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 border-t border-[color-mix(in_oklab,var(--gold)_14%,transparent)] pt-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-white/80 px-4 py-3 text-sm font-semibold text-charcoal/75 hover:bg-beige/60 hover:text-maroon"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </div>
            </aside>
          </div>
        )}

        <div className={`min-h-screen flex-1 ${collapsed ? "lg:pl-24" : "lg:pl-[19rem]"}`}>
          <header className="sticky top-0 z-30 border-b border-[color-mix(in_oklab,var(--gold)_14%,transparent)] bg-[color-mix(in_oklab,var(--ivory)_88%,white_12%)]/90 backdrop-blur-xl">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center gap-3 px-4 md:px-6">
              <button
                type="button"
                className="grid size-10 place-items-center rounded-full border border-[color-mix(in_oklab,var(--gold)_18%,transparent)] text-charcoal/65 hover:bg-beige/60 hover:text-maroon lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="size-5" />
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-maroon/55">
                  <span>Aurelia Admin</span>
                  <ChevronRight className="size-3" />
                  <span>{currentNav.label}</span>
                </div>
                <h1 className="truncate text-2xl font-semibold text-charcoal md:text-3xl">{currentNav.label}</h1>
              </div>

              <label className={`${adminSearchFieldClass} hidden w-full max-w-md xl:flex`}>
                <Search className="size-4 text-maroon/55" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-charcoal/35"
                  placeholder="Search products, enquiries, settings..."
                />
              </label>

              <div className="ml-auto flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-maroon px-4 text-xs font-bold uppercase tracking-[0.28em] text-ivory shadow-[0_16px_30px_-18px_color-mix(in_oklab,var(--maroon)_65%,transparent)] hover:bg-maroon-deep"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((value) => !value)}
                    className="flex items-center gap-3 rounded-full border border-[color-mix(in_oklab,var(--gold)_18%,transparent)] bg-white/80 px-3 py-2 text-sm hover:bg-beige/55"
                  >
                    <div className="grid size-8 place-items-center rounded-full bg-maroon text-ivory">
                      <UserCircle2 className="size-4" />
                    </div>
                    <div className="hidden text-left sm:block">
                      <p className="text-sm font-medium leading-none text-charcoal">{currentAdmin?.name ?? "Admin"}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-maroon/55">{currentAdmin?.role ?? "Guest"}</p>
                    </div>
                    <ChevronDown className="size-4 text-charcoal/45" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-72 rounded-[1.5rem] border border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-[color-mix(in_oklab,var(--ivory)_92%,white_8%)] p-2 shadow-[0_24px_48px_-28px_color-mix(in_oklab,var(--maroon)_45%,transparent)]">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          void navigate({ to: "/admin/profile" });
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-charcoal/80 hover:bg-beige/55 hover:text-maroon"
                      >
                        <UserCircle2 className="size-4 text-maroon/70" />
                        Profile settings
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-charcoal/80 hover:bg-beige/55 hover:text-maroon"
                      >
                        <LogOut className="size-4 text-maroon/70" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-[color-mix(in_oklab,var(--gold)_12%,transparent)] bg-[color-mix(in_oklab,var(--beige)_48%,white_52%)]">
              <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-[0.28em] text-maroon/60 md:px-6">
                <span className="rounded-full border border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-white/70 px-3 py-1">Live sections: {liveSections}</span>
                <span className="rounded-full border border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-white/70 px-3 py-1">Hero banners: {homepageBanners}</span>
                <span className="rounded-full border border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-white/70 px-3 py-1">Pending enquiries: {dashboardMetrics.pendingEnquiries}</span>
                <span className="rounded-full border border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-white/70 px-3 py-1">{settings.businessName}</span>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
