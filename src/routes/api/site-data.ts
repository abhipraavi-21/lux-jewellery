import { createFileRoute } from "@tanstack/react-router";

import { loadSiteDataFromDatabase, saveSiteDataToDatabase } from "@/lib/db.server";
import { cloneSiteData, type SiteData } from "@/lib/site-data";

export const Route = createFileRoute("/api/site-data")({
  server: {
    handlers: {
      GET: async () => {
        const siteData = await loadSiteDataFromDatabase();
        return Response.json({ data: siteData });
      },
      POST: async ({ request }) => {
        const body = (await request.json()) as { data?: SiteData };
        if (!body?.data) {
          return Response.json({ ok: false, message: "Missing site data." }, { status: 400 });
        }

        const siteData = cloneSiteData(body.data);
        await saveSiteDataToDatabase(siteData);
        return Response.json({ ok: true });
      },
    },
  },
});
