import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock3,
  Grid2X2,
  LayoutDashboard,
  LogOut,
  Package2,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";

import {
  Badge,
  adminPrimaryButtonClass,
  adminSectionClass,
  adminSurfaceClass,
  adminTableHeadClass,
  adminTableShellClass,
} from "@/components/admin/AdminUI";
import { formatPrice, useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const navigate = useNavigate();
  const { dashboardMetrics, recentEnquiries, lowStockProducts, products, categories, collections, homepage, settings, offers } = useStore();
  const { logoutAdmin } = useStore();

  const activeProducts = products.filter((product) => product.active).length;
  const activeCategories = categories.filter((category) => category.active).length;
  const activeCollections = collections.filter((collection) => collection.active).length;
  const activeOffers = offers.filter((offer) => offer.active).length;
  const liveSections = Object.values(homepage.sectionVisibility).filter(Boolean).length;
  const activeBanners = homepage.heroBanners.filter((banner) => banner.active).length;

  const handleLogout = () => {
    logoutAdmin();
    void navigate({ to: "/admin/login" });
  };

  const cards = [
    { label: "Total Products", value: dashboardMetrics.totalProducts, icon: Package2, to: "/admin/products" },
    { label: "Total Categories", value: dashboardMetrics.totalCategories, icon: Grid2X2, to: "/admin/categories" },
    { label: "Collections", value: collections.length, icon: Boxes, to: "/admin/collections" },
    { label: "Total Enquiries", value: dashboardMetrics.totalEnquiries, icon: Users, to: "/admin/enquiries" },
    { label: "Pending Enquiries", value: dashboardMetrics.pendingEnquiries, icon: Clock3, to: "/admin/enquiries" },
    { label: "Low Stock Alerts", value: dashboardMetrics.lowStockProducts, icon: AlertTriangle, to: "/admin/inventory" },
    { label: "Live Homepage Sections", value: liveSections, icon: Sparkles, to: "/admin/homepage" },
    { label: "Active Offers", value: activeOffers, icon: TrendingUp, to: "/admin/offers" },
  ];

  return (
    <div className="space-y-6">
      <section className={`${adminSurfaceClass} overflow-hidden`}>
        <div className="grid gap-6 border-b border-[color-mix(in_oklab,var(--gold)_12%,transparent)] p-6 xl:grid-cols-[1.35fr_0.85fr] xl:p-7">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--gold)_18%,transparent)] bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-maroon/65">
                <LayoutDashboard className="size-3.5" />
                Admin Studio
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-maroon px-4 text-[10px] font-bold uppercase tracking-[0.3em] text-ivory shadow-[0_16px_30px_-18px_color-mix(in_oklab,var(--maroon)_65%,transparent)] hover:bg-maroon-deep"
              >
                <LogOut className="size-3.5" />
                Logout
              </button>
            </div>
            <div>
              <h2 className="font-display text-3xl text-charcoal md:text-5xl">Luxury control panel for your jewellery store</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-charcoal/65 md:text-base">
                Manage products, enquiries, homepage modules, and brand settings from one calm, premium workspace that matches the public website.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/admin/products" className={adminPrimaryButtonClass}>
                Review products
                <ArrowRight className="size-4" />
              </Link>
              <Link to="/admin/homepage" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--gold)_20%,transparent)] bg-white/75 px-5 text-sm font-semibold text-charcoal/80 hover:bg-beige/60 hover:text-maroon">
                Homepage content
              </Link>
            </div>
          </div>

          <div className="grid gap-3 rounded-[1.5rem] border border-[color-mix(in_oklab,var(--gold)_14%,transparent)] bg-[linear-gradient(160deg,color-mix(in_oklab,var(--maroon)_10%,white_90%)_0%,color-mix(in_oklab,var(--beige)_72%,white_28%)_100%)] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-maroon/55">Brand Snapshot</p>
                <p className="mt-2 font-display text-2xl text-charcoal">{settings.businessName}</p>
              </div>
              <div className="grid size-12 place-items-center rounded-2xl bg-maroon text-ivory">
                <CheckCircle2 className="size-6" />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <MiniStat label="Live sections" value={String(liveSections)} />
              <MiniStat label="Hero banners" value={String(activeBanners)} />
              <MiniStat label="Active products" value={String(activeProducts)} />
              <MiniStat label="Active offers" value={String(activeOffers)} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="group rounded-[1.5rem] border border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-[color-mix(in_oklab,var(--ivory)_92%,white_8%)] p-5 shadow-[0_16px_34px_-22px_color-mix(in_oklab,var(--maroon)_42%,transparent)] transition hover:-translate-y-0.5 hover:border-gold hover:bg-white"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-maroon/55">{label}</p>
                <p className="mt-3 font-display text-3xl text-charcoal">{value}</p>
              </div>
              <div className="grid size-11 place-items-center rounded-2xl bg-beige text-maroon transition group-hover:bg-maroon group-hover:text-ivory">
                <Icon className="size-5" />
              </div>
            </div>
          </Link>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Recent Enquiries"
          subtitle="Latest customer questions and requirements."
          actionLabel="View all"
          actionTo="/admin/enquiries"
          icon={ArrowRight}
        >
          <div className={adminTableShellClass}>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className={adminTableHeadClass}>
                  <tr>
                    <th className="py-4 pl-5 pr-4">Customer Name</th>
                    <th className="py-4 pr-4">Phone</th>
                    <th className="py-4 pr-4">Requirement</th>
                    <th className="py-4 pr-4">Date</th>
                    <th className="py-4 pr-5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="border-t border-[color-mix(in_oklab,var(--gold)_10%,transparent)] hover:bg-beige/35">
                      <td className="py-4 pl-5 pr-4 font-medium text-charcoal">{enquiry.customerName}</td>
                      <td className="py-4 pr-4 text-charcoal/65">{enquiry.phone}</td>
                      <td className="py-4 pr-4 text-charcoal/65">{enquiry.requirement}</td>
                      <td className="py-4 pr-4 text-charcoal/65">{enquiry.enquiryDate}</td>
                      <td className="py-4 pr-5">
                        <Badge tone={enquiry.status === "converted" ? "success" : enquiry.status === "closed" ? "danger" : enquiry.status === "new" ? "warning" : "neutral"}>
                          {enquiry.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {recentEnquiries.length === 0 && (
                    <tr>
                      <td className="py-8 pl-5 text-sm text-charcoal/55" colSpan={5}>
                        No enquiries yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Panel>

        <Panel
          title="Catalog Snapshot"
          subtitle="A quick view of the current storefront state."
          actionLabel="Products"
          actionTo="/admin/products"
          icon={ArrowRight}
        >
          <div className="space-y-3">
            <InfoRow label="Active Products" value={String(activeProducts)} />
            <InfoRow label="Active Categories" value={String(activeCategories)} />
            <InfoRow label="Active Collections" value={String(activeCollections)} />
            <InfoRow label="Catalogue Value" value={formatPrice(products.reduce((sum, product) => sum + product.price, 0))} />
            <InfoRow label="Low Stock Alerts" value={String(lowStockProducts.length)} />
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Panel
          title="Low Stock Products"
          subtitle="Items that need inventory attention."
          actionLabel="Inventory"
          actionTo="/admin/inventory"
          icon={ArrowRight}
        >
          <div className={adminTableShellClass}>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className={adminTableHeadClass}>
                  <tr>
                    <th className="py-4 pl-5 pr-4">Product</th>
                    <th className="py-4 pr-4">SKU</th>
                    <th className="py-4 pr-4">Current Stock</th>
                    <th className="py-4 pr-4">Status</th>
                    <th className="py-4 pr-5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((product) => (
                    <tr key={product.id} className="border-t border-[color-mix(in_oklab,var(--gold)_10%,transparent)] hover:bg-beige/35">
                      <td className="py-4 pl-5 pr-4 font-medium text-charcoal">{product.name}</td>
                      <td className="py-4 pr-4 text-charcoal/65">{product.sku}</td>
                      <td className="py-4 pr-4 text-charcoal/65">{product.stock}</td>
                      <td className="py-4 pr-4">
                        <Badge tone={product.stock <= 0 ? "danger" : "warning"}>{product.stock <= 0 ? "Out of Stock" : "Low Stock"}</Badge>
                      </td>
                      <td className="py-4 pr-5">
                        <Link to="/admin/inventory" className="text-sm font-semibold text-maroon hover:text-maroon-deep">
                          Update
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {lowStockProducts.length === 0 && (
                    <tr>
                      <td className="py-8 pl-5 text-sm text-charcoal/55" colSpan={5}>
                        No low stock products. Inventory looks healthy.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Panel>

        <section className={`${adminSectionClass} space-y-4`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-charcoal">Operational notes</h2>
              <p className="mt-1 text-sm text-charcoal/60">Quick reminders for the admin team.</p>
            </div>
            <Badge tone="neutral">Live</Badge>
          </div>
          <div className="space-y-3">
            <Note
              title="Homepage sections"
              description={`${liveSections} sections are visible and ${homepage.heroBanners.length} hero banners are configured.`}
            />
            <Note
              title="Inquiry flow"
              description={`${dashboardMetrics.pendingEnquiries} enquiries are still pending follow-up.`}
            />
            <Note
              title="Brand consistency"
              description="Admin UI now follows the same ivory, maroon, and gold visual system as the storefront."
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  actionLabel,
  actionTo,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle: string;
  actionLabel: string;
  actionTo: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <section className={adminSectionClass}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-charcoal">{title}</h2>
          <p className="mt-1 text-sm text-charcoal/60">{subtitle}</p>
        </div>
        <Link
          to={actionTo}
          className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--gold)_18%,transparent)] bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-charcoal/70 hover:bg-beige/60 hover:text-maroon"
        >
          {actionLabel}
          <Icon className="size-3.5" />
        </Link>
      </div>
      {children}
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[color-mix(in_oklab,var(--gold)_12%,transparent)] bg-white/75 px-4 py-3">
      <span className="text-sm text-charcoal/65">{label}</span>
      <span className="text-xl font-semibold text-charcoal">{value}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[color-mix(in_oklab,var(--gold)_12%,transparent)] bg-white/75 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.3em] text-maroon/55">{label}</p>
      <p className="mt-2 font-display text-2xl text-charcoal">{value}</p>
    </div>
  );
}

function Note({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-[color-mix(in_oklab,var(--gold)_12%,transparent)] bg-white/75 px-4 py-4">
      <p className="text-[10px] uppercase tracking-[0.3em] text-maroon/55">{title}</p>
      <p className="mt-2 text-sm leading-7 text-charcoal/65">{description}</p>
    </div>
  );
}
