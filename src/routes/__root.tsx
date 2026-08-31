import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { getSiteData } from "../lib/api/site-data.functions";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { StoreProvider } from "../lib/store";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ivory px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-maroon">404</h1>
        <div className="hairline w-24 mx-auto my-6" />
        <h2 className="font-display text-2xl text-charcoal">This piece is no longer in the vault</h2>
        <p className="mt-3 text-sm text-charcoal/60">The page you were looking for has been moved or no longer exists.</p>
        <Link to="/" className="inline-block mt-8 bg-maroon text-ivory px-8 py-3 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-charcoal transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-maroon">Something went amiss</h1>
        <p className="mt-3 text-sm text-charcoal/60">Please try again or return to the boutique.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="bg-maroon text-ivory px-6 py-3 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-charcoal transition-colors"
          >
            Try again
          </button>
          <a href="/" className="border border-maroon text-maroon px-6 py-3 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-maroon hover:text-ivory transition-colors">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async () => {
    const siteData = await getSiteData();
    return { siteData };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Aurelia Heritage — Timeless Luxury Jewellery" },
      { name: "description", content: "Aurelia Heritage crafts gold, diamond, silver and bridal jewellery with century-old artisanal mastery. Shop timeless pieces handcrafted for every occasion." },
      { name: "author", content: "Aurelia Heritage" },
      { property: "og:site_name", content: "Aurelia Heritage" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Aurelia Heritage — Timeless Luxury Jewellery" },
      { property: "og:description", content: "Gold, diamond, silver and bridal jewellery, handcrafted since 1924." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,500&family=Montserrat:wght@300;400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { siteData } = Route.useLoaderData();
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider initialSiteData={siteData}>
        <Toaster richColors closeButton position="top-right" />
        {!isAdminRoute && <Header />}
        <main className={isAdminRoute ? "min-h-screen" : ""}>
          <Outlet />
        </main>
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <WhatsAppButton />}
      </StoreProvider>
    </QueryClientProvider>
  );
}
