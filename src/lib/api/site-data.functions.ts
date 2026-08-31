import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { loadSiteDataFromDatabase, saveSiteDataToDatabase } from "../db.server";
import { cloneSiteData, type SiteData } from "../site-data";

export const getSiteData = createServerFn({ method: "POST" }).handler(async () => {
  return await loadSiteDataFromDatabase();
});

export const persistSiteData = createServerFn({ method: "POST" })
  .validator(z.object({ data: z.unknown() }))
  .handler(async ({ data }) => {
    const siteData = cloneSiteData(data.data as SiteData);
    await saveSiteDataToDatabase(siteData);
    return { ok: true };
  });
