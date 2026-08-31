import { Outlet, createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { adminCanvasClass } from "@/components/admin/AdminUI";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/_layout")({
  component: AdminLayout,
});

function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { hydrated, isAuthenticated } = useStore();
  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated && !isLoginRoute) {
      void navigate({ to: "/admin/login", replace: true });
    }
  }, [hydrated, isAuthenticated, isLoginRoute, navigate]);

  if (!hydrated) {
    return (
      <div className={`${adminCanvasClass} grid place-items-center`}>
        <div className="text-center">
          <div className="mx-auto size-12 animate-pulse rounded-full border-2 border-beige border-t-maroon" />
          <p className="mt-4 text-sm uppercase tracking-[0.3em] text-maroon/55">Loading admin panel</p>
        </div>
      </div>
    );
  }

  if (isLoginRoute) {
    return (
      <div className={adminCanvasClass}>
        <Outlet />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`${adminCanvasClass} grid place-items-center`}>
        <div className="text-center">
          <div className="mx-auto size-12 animate-pulse rounded-full border-2 border-beige border-t-maroon" />
          <p className="mt-4 text-sm uppercase tracking-[0.3em] text-maroon/55">Redirecting to login</p>
        </div>
      </div>
    );
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}

